import { Bell } from "lucide-react";
import { openNotificationAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notifications" };
type Notification = { id: string; title: string; message: string; href: string | null; related_application_id: string | null; is_read: boolean; created_at: string };

function relativeTime(timestamp: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const units = [["day", 86400], ["hour", 3600], ["minute", 60]] as const;
  for (const [unit, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
  }
  return "Just now";
}

export default async function NotificationsPage() {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { data, error } = await supabase.from("notifications").select("*").eq("recipient_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const notifications = (data ?? []) as Notification[];
  return <div className="stack" style={{ gap: "1.7rem", maxWidth: "58rem" }}><div><p className="eyebrow">Creator inbox</p><h1 className="page-title">Notifications</h1><p className="muted">Selections and application updates, newest first.</p></div>{error ? <div className="notice notice--error" role="alert">Notifications could not be loaded. Refresh to try again.</div> : notifications.length === 0 ? <EmptyState title="Nothing new" message="Application decisions will appear here when there is something to review." /> : <div className="stack">{notifications.map((notification) => <form action={openNotificationAction} key={notification.id} noValidate><input type="hidden" name="notificationId" value={notification.id} /><input type="hidden" name="href" value={notification.related_application_id ? "/creator/applications" : ""} /><button className={`notification-card ${notification.is_read ? "" : "notification-card--unread"}`} type="submit"><Bell size={18} color="var(--color-primary)" aria-hidden="true" /><span className="notification-card__copy"><span className="notification-card__top"><strong>{notification.title}</strong>{!notification.is_read ? <span className="notification-dot"><span className="sr-only">Unread</span></span> : null}</span><span>{notification.message}</span><small>{relativeTime(notification.created_at)}</small></span></button></form>)}</div>}</div>;
}
