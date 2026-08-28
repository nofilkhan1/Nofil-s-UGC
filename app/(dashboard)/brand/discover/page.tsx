import { CreatorDiscover, type DiscoverCreator } from "@/components/creator-discover";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NICHES } from "@/lib/niches";

export const metadata = { title: "Discover creators" };

export default async function BrandDiscoverPage() {
  const viewer = await requireRole("brand");
  const supabase = await createClient();
  const [{ data: profiles }, { data: campaigns }] = await Promise.all([
    supabase.from("profiles").select("id,display_name").eq("role", "creator").order("display_name"),
    supabase.from("campaigns").select("id,title").eq("brand_id", viewer.user.id).eq("status", "live").order("created_at", { ascending: false }),
  ]);
  const creatorIds = (profiles ?? []).map((profile) => profile.id);
  const { data: details } = creatorIds.length ? await supabase.from("creator_profiles").select("user_id,bio,portfolio_url,instagram_handle,tiktok_handle,niches").in("user_id", creatorIds) : { data: [] };
  const detailByCreator = new Map((details ?? []).map((detail) => [detail.user_id, detail]));
  const creators = (profiles ?? []).map((profile) => ({ ...profile, creator_profiles: detailByCreator.has(profile.id) ? [detailByCreator.get(profile.id)!] : [] }) as DiscoverCreator).filter((creator) => Boolean(creator.display_name.trim()) && creator.creator_profiles[0]?.niches?.length);
  return <div className="stack" style={{ gap: "1.7rem" }}><div><p className="eyebrow">Creator discovery</p><h1 className="page-title">Find your next creator</h1><p className="muted">Browse completed creator profiles and invite a strong fit to apply to a live campaign.</p></div><CreatorDiscover creators={creators} campaigns={(campaigns ?? []) as Array<{ id: string; title: string }>} niches={NICHES} /></div>;
}
