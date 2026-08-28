import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Platform } from "@/lib/types";

export const metadata = { title: "Find campaigns" };

export default async function CreatorCampaignsPage({ searchParams }: { searchParams: Promise<{ platform?: string }> }) {
  await requireRole("creator");
  const { platform } = await searchParams;
  const activePlatform = platform === "instagram" || platform === "tiktok" ? platform as Platform : null;
  const supabase = await createClient();
  let request = supabase.from("campaigns").select("*, brand:profiles!campaigns_brand_id_fkey(display_name)").eq("status", "published").order("created_at", { ascending: false }).limit(50);
  if (activePlatform) request = request.eq("platform", activePlatform);
  const { data, error } = await request;
  const campaigns = (data ?? []) as Campaign[];
  return <div className="stack" style={{ gap: "1.7rem" }}><div><p className="eyebrow">Creator opportunities</p><h1 className="page-title">Find your next brief</h1><p className="muted">Review every requirement first. Apply only when the format, dates, and product fit your work.</p></div><nav className="cluster" aria-label="Filter campaigns by platform"><Link className={`button ${!activePlatform ? "button--primary" : "button--secondary"}`} href="/creator/campaigns">All platforms</Link><Link className={`button ${activePlatform === "instagram" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=instagram">Instagram</Link><Link className={`button ${activePlatform === "tiktok" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=tiktok">TikTok</Link></nav>{error ? <div className="notice notice--error" role="alert">Campaigns could not be loaded. Refresh to try again.</div> : campaigns.length === 0 ? <EmptyState title={activePlatform ? `No ${activePlatform} campaigns right now` : "No live campaigns right now"} message="Try another platform or check back when brands publish new briefs." action={activePlatform ? "Clear filter" : undefined} href={activePlatform ? "/creator/campaigns" : undefined} /> : <><p className="muted" role="status">Showing {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}</p><div className="campaign-grid">{campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} href={`/creator/campaigns/${campaign.id}`} />)}</div></>}</div>;
}
