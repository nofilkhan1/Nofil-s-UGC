import { CreatorProfileForm } from "@/components/creator-profile-form";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CreatorProfile } from "@/lib/types";

export const metadata = { title: "Creator profile" };

export default async function CreatorProfilePage() {
  const viewer = await requireRole("creator");
  const supabase = await createClient();
  const { data } = await supabase.from("creator_profiles").select("*").eq("user_id", viewer.user.id).single();
  const details = (data ?? { user_id: viewer.user.id, gender: null, age: null, bio: null, portfolio_url: null, instagram_url: null, tiktok_url: null }) as CreatorProfile;
  return <div className="stack" style={{ maxWidth: "52rem", gap: "1.5rem" }}><div><p className="eyebrow">Creator profile</p><h1 className="page-title">Make your work easy to assess</h1><p className="muted">Brands see these details only after you apply to one of their campaigns.</p></div><section className="panel"><CreatorProfileForm profile={viewer.profile} details={details} /></section></div>;
}
