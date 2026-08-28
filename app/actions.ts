"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema, campaignSchema, creatorProfileSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function validationState(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): ActionState {
  return { status: "error", message: "Check the fields marked below.", errors: error.flatten().fieldErrors };
}

export async function createCampaignAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("brand");
  const parsed = campaignSchema.safeParse({
    title: formData.get("title"), description: formData.get("description"), platform: formData.get("platform"),
    contentFormat: formData.get("contentFormat"), postCount: formData.get("postCount"), startDate: formData.get("startDate"), endDate: formData.get("endDate"),
  });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { data, error } = await supabase.from("campaigns").insert({
    brand_id: viewer.user.id, title: parsed.data.title, description: parsed.data.description,
    platform: parsed.data.platform, content_format: parsed.data.contentFormat, post_count: parsed.data.postCount,
    start_date: parsed.data.startDate, end_date: parsed.data.endDate, status: "published",
  }).select("id").single();
  if (error || !data) return { status: "error", message: "The campaign was not published. Your entries are still here—try again." };
  revalidatePath("/brand/campaigns");
  redirect(`/brand/campaigns/${data.id}?published=1`);
}

export async function applyToCampaignAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireRole("creator");
  const parsed = applicationSchema.safeParse({ campaignId: formData.get("campaignId"), pricePerPost: formData.get("pricePerPost"), currency: formData.get("currency"), note: formData.get("note") });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert({
    campaign_id: parsed.data.campaignId, creator_id: viewer.user.id, price_per_post: parsed.data.pricePerPost,
    currency: parsed.data.currency, note: parsed.data.note || null,
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
  });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const profileResult = await supabase.from("profiles").update({ display_name: parsed.data.displayName }).eq("id", viewer.user.id);
  const detailResult = await supabase.from("creator_profiles").update({
    gender: parsed.data.gender || null, age: parsed.data.age === "" ? null : parsed.data.age, bio: parsed.data.bio || null,
    portfolio_url: parsed.data.portfolioUrl || null, instagram_url: parsed.data.instagramUrl || null, tiktok_url: parsed.data.tiktokUrl || null,
  }).eq("user_id", viewer.user.id);
  if (profileResult.error || detailResult.error) return { status: "error", message: "Your profile was not saved. Your entries are still here—try again." };
  revalidatePath("/creator/profile");
  return { status: "success", message: "Profile saved." };
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
  return { status: "success", message: decision === "approved" ? "Creator approved and notified." : "Application rejected and creator notified." };
}

export async function markNotificationReadAction(formData: FormData) {
  const viewer = await requireViewer();
  const id = String(formData.get("notificationId") ?? "");
  const supabase = await createClient();
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id).eq("recipient_id", viewer.user.id);
  revalidatePath("/notifications");
}
