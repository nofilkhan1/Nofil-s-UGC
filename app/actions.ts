"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema, campaignSchema, creatorProfileSchema, deliverableSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function validationState(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): ActionState {
  return { status: "error", message: "Check the fields marked below.", errors: error.flatten().fieldErrors };
}

function normalizeSocialHandle(value: unknown) {
  const handle = String(value ?? "").trim().replace(/^@+/, "");
  return handle || null;
}

export async function createCampaignAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("brand");
  const parsed = campaignSchema.safeParse({
    title: formData.get("title"), description: formData.get("description"), platform: formData.get("platform"),
    contentFormat: formData.get("contentFormat"), postCount: formData.get("postCount"), startDate: formData.get("startDate"), endDate: formData.get("endDate"),
    niches: formData.getAll("niches"),
  });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { data, error } = await supabase.from("campaigns").insert({
    brand_id: viewer.user.id, title: parsed.data.title, description: parsed.data.description,
    platform: parsed.data.platform, content_format: parsed.data.contentFormat, post_count: parsed.data.postCount,
    start_date: parsed.data.startDate, end_date: parsed.data.endDate, status: "draft",
    niches: parsed.data.niches,
  }).select("id").single();
  if (error || !data) return { status: "error", message: "The campaign draft could not be created. Your entries are still here—try again." };
  revalidatePath("/brand/campaigns");
  redirect(`/brand/campaigns/${data.id}?created=1`);
}

export async function updateCampaignStatusAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("brand");
  const campaignId = String(formData.get("campaignId") ?? ""); const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(campaignId) || !["live", "closed"].includes(status)) return { status: "error", message: "Invalid campaign action." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("campaigns").update({ status }).eq("id", campaignId).eq("brand_id", viewer.user.id).in("status", status === "live" ? ["draft"] : ["live"]).select("id").maybeSingle();
  if (error || !data) return { status: "error", message: "This campaign is already in a different state. Refresh to see its current status." };
  revalidatePath("/brand/campaigns"); revalidatePath("/creator/campaigns"); revalidatePath(`/brand/campaigns/${campaignId}`); revalidatePath(`/creator/campaigns/${campaignId}`);
  return { status: "success", message: status === "live" ? "Campaign is live for creators." : "Campaign closed. Existing applications are unchanged." };
}

export async function applyToCampaignAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("creator");
  const parsed = applicationSchema.safeParse({ campaignId: formData.get("campaignId"), pricePerPost: formData.get("pricePerPost"), currency: formData.get("currency"), note: formData.get("note"), pitch: formData.get("pitch") });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert({
    campaign_id: parsed.data.campaignId, creator_id: viewer.user.id, price_per_post: parsed.data.pricePerPost,
    currency: parsed.data.currency, note: parsed.data.note || null, pitch: parsed.data.pitch || null,
  });
  if (error?.code === "23505") return { status: "error", message: "You already applied to this campaign. View it in My applications." };
  if (error) return { status: "error", message: "Your application was not sent. Your quote is still here—try again." };
  revalidatePath("/creator/applications");
  redirect("/creator/applications?submitted=1");
}

export async function updateCreatorProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("creator");
  const parsed = creatorProfileSchema.safeParse({
    displayName: formData.get("displayName"), gender: formData.get("gender"), age: formData.get("age"), bio: formData.get("bio"),
    portfolioUrl: formData.get("portfolioUrl"), instagramUrl: formData.get("instagramUrl"), tiktokUrl: formData.get("tiktokUrl"),
    instagramHandle: normalizeSocialHandle(formData.get("instagramHandle")), tiktokHandle: normalizeSocialHandle(formData.get("tiktokHandle")),
    topContentLinks: formData.getAll("topContentLinks"),
    niches: formData.getAll("niches"),
  });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const profileResult = await supabase.from("profiles").update({ display_name: parsed.data.displayName }).eq("id", viewer.user.id);
  const detailResult = await supabase.from("creator_profiles").update({
    gender: parsed.data.gender || null, age: parsed.data.age === "" ? null : parsed.data.age, bio: parsed.data.bio || null,
    portfolio_url: parsed.data.portfolioUrl || null, instagram_url: parsed.data.instagramUrl || null, tiktok_url: parsed.data.tiktokUrl || null,
    instagram_handle: parsed.data.instagramHandle || null, tiktok_handle: parsed.data.tiktokHandle || null,
    niches: parsed.data.niches, top_content_links: parsed.data.topContentLinks.filter(Boolean),
  }).eq("user_id", viewer.user.id);
  if (profileResult.error || detailResult.error) return { status: "error", message: "Your profile was not saved. Your entries are still here—try again." };
  revalidatePath("/creator/profile");
  return { status: "success", message: "Profile saved." };
}

export async function submitDeliverableAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("creator");
  const parsed = deliverableSchema.safeParse({ applicationId: formData.get("applicationId"), deliverableUrl: formData.get("deliverableUrl") });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_application_deliverable", { target_application_id: parsed.data.applicationId, target_creator_id: viewer.user.id, submitted_url: parsed.data.deliverableUrl });
  if (error) return { status: "error", message: "The deliverable could not be submitted. Make sure the application is approved." };
  revalidatePath("/creator/applications"); revalidatePath("/brand/campaigns");
  return { status: "success", message: "Deliverable submitted." };
}

export async function confirmDeliverableAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("brand");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(applicationId)) return { status: "error", message: "Invalid application." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("confirm_application_deliverable", { target_application_id: applicationId, target_brand_id: viewer.user.id });
  if (error) return { status: "error", message: "Delivery confirmation failed. Refresh and try again." };
  revalidatePath("/brand/campaigns"); revalidatePath("/creator/applications"); revalidatePath("/creator/notifications");
  return { status: "success", message: "Delivery confirmed and creator notified." };
}

export async function decideApplicationAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["brand", "admin"]);
  const applicationId = String(formData.get("applicationId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !["approved", "rejected"].includes(decision)) return { status: "error", message: "This application decision is invalid." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("decide_application", { application_id: applicationId, decision });
  if (error || !data) return { status: "error", message: "The decision was not saved. Refresh to confirm its current status, then try again." };
  revalidatePath("/brand/campaigns");
  revalidatePath("/creator/applications");
  revalidatePath("/creator/notifications");
  revalidatePath("/notifications");
  return { status: "success", message: decision === "approved" ? "Creator approved and notified." : "Application rejected and creator notified." };
}

export async function openNotificationAction(formData: FormData) {
  const viewer = await requireViewer();
  const id = String(formData.get("notificationId") ?? "");
  const href = String(formData.get("href") ?? "");
  const supabase = await createClient();
  await supabase.from("notifications").update({ read_at: new Date().toISOString(), is_read: true }).eq("id", id).eq("recipient_id", viewer.user.id);
  revalidatePath("/creator/notifications");
  revalidatePath("/notifications");
  if (href === "/creator/applications") redirect(href);
}

export async function inviteCreatorAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("brand");
  const creatorId = String(formData.get("creatorId") ?? "");
  const campaignId = String(formData.get("campaignId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(creatorId) || !/^[0-9a-f-]{36}$/i.test(campaignId)) return { status: "error", message: "Choose a valid creator and campaign." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("send_campaign_invite", { target_creator_id: creatorId, target_campaign_id: campaignId });
  if (error) return { status: "error", message: "Invite could not be sent. Make sure the campaign is live, then try again." };
  revalidatePath("/creator/notifications");
  revalidatePath("/notifications");
  return { status: "success", message: "Invite sent." };
}

export async function sendMessageAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireViewer();
  const applicationId = String(formData.get("applicationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !body || body.length > 2000) return { status: "error", message: "Write a message up to 2,000 characters." };
  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ application_id: applicationId, sender_id: viewer.user.id, body });
  if (error) return { status: "error", message: "Message could not be sent. Messaging is available after approval." };
  revalidatePath(`/messages/${applicationId}`);
  return { status: "success", message: "Message sent." };
}

export async function markMessagesRead(applicationId: string) {
  const viewer = await requireViewer();
  const supabase = await createClient();
  await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("application_id", applicationId).neq("sender_id", viewer.user.id).is("read_at", null);
}
