import { redirect } from "next/navigation";
import { requireViewer, roleHome } from "@/lib/auth";
export default async function DashboardPage() { const { profile } = await requireViewer(); redirect(roleHome(profile.role)); }
