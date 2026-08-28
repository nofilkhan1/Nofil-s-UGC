import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Platform } from "@/lib/types";
import { NICHES, type Niche } from "@/lib/niches";

export const metadata = { title: "Find campaigns" };

export default async function CreatorCampaignsPage({ searchParams }: { searchParams: Promise<{ platform?: string; niche?: string | string[] }> }) {
  const viewer = await requireRole("creator");
  const { platform } = await searchParams;
  const activePlatform = platform === "instagram" || platform === "tiktok" ? platform as Platform : null;
  const rawNiches = (await searchParams).niche;
  const activeNiches = (Array.isArray(rawNiches) ? rawNiches : rawNiches ? [rawNiches] : []).filter((niche): niche is Niche => (NICHES as readonly string[]).includes(niche));
  const supabase = await createClient();
  let request = supabase.from("campaigns").select("*, brand:profiles!campaigns_brand_id_fkey(display_name)").eq("status", "live").order("created_at", { ascending: false }).limit(50);
  if (activePlatform) request = request.eq("platform", activePlatform);
  if (activeNiches.length) request = request.overlaps("niches", activeNiches);
  const { data, error } = await request;
  const campaigns = (data ?? []) as Campaign[];
  const campaignIds = campaigns.map((campaign) => campaign.id);
  const { data: applications } = campaignIds.length ? await supabase.from("applications").select("campaign_id,status").eq("creator_id", viewer.user.id).in("campaign_id", campaignIds) : { data: [] as Array<{ campaign_id: string; status: string }> };
  const appliedByCampaign = new Map((applications ?? []).map((application) => [application.campaign_id, application.status]));
  campaigns.forEach((campaign) => { (campaign as Campaign & { appliedStatus?: string }).appliedStatus = appliedByCampaign.get(campaign.id); });
  const nicheHref = (niche: Niche) => { const next = activeNiches.includes(niche) ? activeNiches.filter((item) => item !== niche) : [...activeNiches, niche]; const params = new URLSearchParams(activePlatform ? { platform: activePlatform } : {}); next.forEach((item) => params.append("niche", item)); return `/creator/campaigns${params.size ? `?${params}` : ""}`; };
  return <div className="stack" style={{ gap: "1.7rem" }}><div><p className="eyebrow">Creator opportunities</p><h1 className="page-title">Find your next brief</h1><p className="muted">Review every requirement first. Apply only when the format, dates, and product fit your work.</p></div><nav className="cluster" aria-label="Filter campaigns by platform"><Link className={`button ${!activePlatform ? "button--primary" : "button--secondary"}`} href="/creator/campaigns">All platforms</Link><Link className={`button ${activePlatform === "instagram" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=instagram">Instagram</Link><Link className={`button ${activePlatform === "tiktok" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=tiktok">TikTok</Link></nav><nav className="niche-badges" aria-label="Filter campaigns by category">{NICHES.map((niche) => <Link className={`badge ${activeNiches.includes(niche) ? "badge--instagram" : ""}`} href={nicheHref(niche)} key={niche}>{niche}</Link>)}</nav>{error ? <div className="notice notice--error" role="alert">Campaigns could not be loaded. Refresh to try again.</div> : campaigns.length === 0 ? <EmptyState title="No matching campaigns right now" message="Try another category or platform." action="Clear filters" href="/creator/campaigns" /> : <><p className="muted" role="status">Showing {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}</p><div className="campaign-grid">{campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} href={`/creator/campaigns/${campaign.id}`} />)}</div></>}</div>;
}
