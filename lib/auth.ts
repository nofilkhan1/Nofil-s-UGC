import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

export async function getViewer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile ? { user, profile: profile as Profile } : null;
}

export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/auth/sign-in");
  return viewer;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const viewer = await requireViewer();
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(viewer.profile.role)) redirect("/forbidden");
  return viewer;
}

export function roleHome(role: UserRole) {
  if (role === "brand") return "/brand/campaigns";
  if (role === "creator") return "/creator/campaigns";
  return "/admin";
}
