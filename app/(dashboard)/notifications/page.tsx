import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { markNotificationReadAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notifications" };
type Notification = { id: string; title: string; message: string; href: string | null; read_at: string | null; created_at: string };

export default async function NotificationsPage() {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { data, error } = await supabase.from("notifications").select("*").eq("recipient_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const notifications = (data ?? []) as Notification[];
  return <div className="stack" style={{ gap: "1.7rem", maxWidth: "58rem" }}><div><p className="eyebrow">Inbox</p><h1 className="page-title">Notifications</h1><p className="muted">Application activity and creator decisions appear here.</p></div>{error ? <div className="notice notice--error" role="alert">Notifications could not be loaded. Refresh to try again.</div> : notifications.length === 0 ? <EmptyState title="Nothing new" message="Application and decision updates will appear here when there is something to act on." /> : <div className="stack">{notifications.map((notification) => <article className="panel" key={notification.id} style={{ borderLeft: notification.read_at ? undefined : "4px solid var(--color-primary)" }}><div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><div className="cluster" style={{ alignItems: "flex-start" }}><Bell size={18} color="var(--color-primary)" aria-hidden="true" /><div><h2 style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>{notification.title}</h2><p className="muted" style={{ marginBottom: "0.4rem" }}>{notification.message}</p><small className="muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.created_at))}</small></div></div><div className="cluster">{notification.href ? <Link className="button button--secondary" href={notification.href}>View</Link> : null}{!notification.read_at ? <form action={markNotificationReadAction} noValidate><input type="hidden" name="notificationId" value={notification.id} /><SubmitButton intent="secondary"><Check size={15} aria-hidden="true" /> Mark read</SubmitButton></form> : <span className="badge">Read</span>}</div></div></article>)}</div>}</div>;
}
