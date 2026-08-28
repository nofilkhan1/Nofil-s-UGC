import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { MessageComposer } from "@/components/message-composer";
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
  const { data: messages } = await supabase.from("messages").select("id,body,created_at,sender:profiles!messages_sender_id_fkey(display_name)").eq("application_id", applicationId).order("created_at", { ascending: true });
  return <div className="stack" style={{ maxWidth: "48rem", gap: "1.2rem" }}><Link href={viewer.profile.role === "brand" ? "/brand/campaigns" : "/creator/applications"} className="muted"><ArrowLeft size={15} aria-hidden="true" /> Back</Link><div><p className="eyebrow">Private thread</p><h1 className="page-title"><MessageCircle size={28} aria-hidden="true" /> {application.campaign?.title}</h1><p className="muted">Coordinate the approved campaign here.</p></div><section className="panel message-thread" aria-label="Messages">{messages?.length ? messages.map((message) => { const sender = Array.isArray(message.sender) ? message.sender[0] : message.sender; return <article className={`message-bubble ${sender?.display_name === viewer.profile.display_name ? "message-bubble--mine" : ""}`} key={message.id}><strong>{sender?.display_name ?? "Participant"}</strong><p>{message.body}</p><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time></article>; }) : <p className="muted">No messages yet. Start the conversation below.</p>}</section><MessageComposer applicationId={applicationId} /></div>;
}
