import { CreatorProfileForm } from "@/components/creator-profile-form";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CreatorProfile } from "@/lib/types";
import { SocialPlatformIcon } from "@/components/social-platform-icon";

export const metadata = { title: "Creator profile" };

export default async function CreatorProfilePage() {
  const viewer = await requireRole("creator");
  const supabase = await createClient();
  const { data } = await supabase.from("creator_profiles").select("*").eq("user_id", viewer.user.id).single();
  const details = (data ?? { user_id: viewer.user.id, gender: null, age: null, bio: null, portfolio_url: null, instagram_url: null, tiktok_url: null, instagram_handle: null, tiktok_handle: null, niches: [], top_content_links: [] }) as CreatorProfile;
  return <div className="stack" style={{ maxWidth: "52rem", gap: "1.5rem" }}><div><p className="eyebrow">Creator profile</p><h1 className="page-title">Make your work easy to assess</h1><p className="muted">Brands see these details only after you apply to one of their campaigns.</p>{details.instagram_handle || details.tiktok_handle ? <div className="cluster" style={{ marginTop: "0.75rem" }}>{details.instagram_handle ? <a className="button button--secondary" href={`https://instagram.com/${details.instagram_handle}`} target="_blank" rel="noreferrer"><SocialPlatformIcon platform="instagram" /> Instagram @{details.instagram_handle}</a> : null}{details.tiktok_handle ? <a className="button button--secondary" href={`https://tiktok.com/@${details.tiktok_handle}`} target="_blank" rel="noreferrer"><SocialPlatformIcon platform="tiktok" /> TikTok @{details.tiktok_handle}</a> : null}</div> : null}{details.top_content_links?.filter(Boolean).length ? <div className="top-content-links"><p className="field__label">Top content</p><div className="cluster">{details.top_content_links.filter(Boolean).map((url, index) => <a className="button button--secondary" href={url} target="_blank" rel="noreferrer" key={url}>Top video {index + 1}</a>)}</div></div> : null}</div><section className="panel"><CreatorProfileForm profile={viewer.profile} details={details} /></section></div>;
}
