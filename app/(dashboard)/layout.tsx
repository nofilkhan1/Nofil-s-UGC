import { AppShell } from "@/components/app-shell";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("recipient_id", viewer.user.id).is("read_at", null);
  return <AppShell profile={viewer.profile} unread={count ?? 0}>{children}</AppShell>;
}
