import Link from "next/link";
import { CampaignBrowseResults } from "@/components/campaign-browse-results";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Platform } from "@/lib/types";
import { NICHES, type Niche } from "@/lib/niches";

export const metadata = { title: "Find campaigns" };

export default async function CreatorCampaignsPage({ searchParams }: { searchParams: Promise<{ platform?: string; niche?: string | string[] }> }) {
  const viewer = await requireRole("creator");
  const params = await searchParams;
  const activePlatform = params.platform === "instagram" || params.platform === "tiktok" ? params.platform as Platform : null;
  const rawNiches = params.niche;
  const activeNiches = (Array.isArray(rawNiches) ? rawNiches : rawNiches ? [rawNiches] : []).filter((niche): niche is Niche => (NICHES as readonly string[]).includes(niche));
  const supabase = await createClient();
  let request = supabase.from("campaigns").select("*, brand:profiles!campaigns_brand_id_fkey(display_name), applications(count)").eq("status", "live").order("created_at", { ascending: false }).limit(50);
  if (activePlatform) request = request.eq("platform", activePlatform);
  if (activeNiches.length) request = request.overlaps("niches", activeNiches);
  const { data, error } = await request;
  const rows = (data ?? []) as Array<Campaign & { applications?: Array<{ count: number }> }>;
  const campaignIds = rows.map((campaign) => campaign.id);
  const { data: applications } = campaignIds.length ? await supabase.from("applications").select("campaign_id,status").eq("creator_id", viewer.user.id).in("campaign_id", campaignIds) : { data: [] as Array<{ campaign_id: string; status: string }> };
  const appliedByCampaign = new Map((applications ?? []).map((application) => [application.campaign_id, application.status]));
  const campaigns = rows.map((campaign) => ({ ...campaign, application_count: campaign.applications?.[0]?.count ?? 0, appliedStatus: appliedByCampaign.get(campaign.id) as "pending" | "approved" | "rejected" | undefined }));
  const nicheHref = (niche: Niche) => { const next = activeNiches.includes(niche) ? activeNiches.filter((item) => item !== niche) : [...activeNiches, niche]; const nextParams = new URLSearchParams(activePlatform ? { platform: activePlatform } : {}); next.forEach((item) => nextParams.append("niche", item)); return `/creator/campaigns${nextParams.size ? `?${nextParams}` : ""}`; };
  return <div className="stack" style={{ gap: "1.7rem" }}><div><p className="eyebrow">Creator opportunities</p><h1 className="page-title">Find your next brief</h1><p className="muted">Review every requirement first. Apply only when the format, dates, and product fit your work.</p></div><nav className="cluster" aria-label="Filter campaigns by platform"><Link className={`button ${!activePlatform ? "button--primary" : "button--secondary"}`} href="/creator/campaigns">All platforms</Link><Link className={`button ${activePlatform === "instagram" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=instagram">Instagram</Link><Link className={`button ${activePlatform === "tiktok" ? "button--primary" : "button--secondary"}`} href="/creator/campaigns?platform=tiktok">TikTok</Link></nav><nav className="niche-badges" aria-label="Filter campaigns by category">{NICHES.map((niche) => <Link className={`badge ${activeNiches.includes(niche) ? "badge--active" : ""}`} href={nicheHref(niche)} key={niche}>{niche}</Link>)}</nav>{error ? <div className="notice notice--error" role="alert">Campaigns could not be loaded. Refresh the page to try again.</div> : <CampaignBrowseResults campaigns={campaigns} />}</div>;
}
