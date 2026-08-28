import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { MessageComposer } from "@/components/message-composer";
import { MessageThread } from "@/components/message-thread";
import { markMessagesRead } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const viewer = await requireViewer();
  const { applicationId } = await params;
  const supabase = await createClient();
  const { data: rawApplication } = await supabase.from("applications").select("id,status,campaign:campaigns!applications_campaign_id_fkey(id,title)").eq("id", applicationId).single();
  const application = rawApplication ? { ...rawApplication, campaign: Array.isArray(rawApplication.campaign) ? rawApplication.campaign[0] : rawApplication.campaign } : null;
  if (!application || application.status !== "approved") return <EmptyState title="Messaging unlocks after approval" message="Only approved applications have a private coordination thread." action="Back to applications" href={viewer.profile.role === "brand" ? "/brand/campaigns" : "/creator/applications"} />;
  await markMessagesRead(applicationId);
  const { data: messages } = await supabase.from("messages").select("id,sender_id,body,created_at,sender:profiles!messages_sender_id_fkey(display_name)").eq("application_id", applicationId).order("created_at", { ascending: true }).order("id", { ascending: true });
  const normalized = (messages ?? []).map((message) => { const sender = Array.isArray(message.sender) ? message.sender[0] : message.sender; return { id: message.id, sender_id: message.sender_id, sender_name: sender?.display_name ?? "Participant", body: message.body, created_at: message.created_at }; });
  return <div className="message-page stack"><Link href={viewer.profile.role === "brand" ? "/brand/campaigns" : "/creator/applications"} className="muted"><ArrowLeft size={15} aria-hidden="true" /> Back</Link><div><p className="eyebrow">Private thread</p><h1 className="page-title"><MessageCircle size={28} aria-hidden="true" /> {application.campaign?.title}</h1><p className="muted">Coordinate the approved campaign here.</p></div><MessageThread messages={normalized} viewerId={viewer.user.id} /><MessageComposer applicationId={applicationId} /></div>;
}
