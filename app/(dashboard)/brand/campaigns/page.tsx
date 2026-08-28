import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Campaigns" };

export default async function BrandCampaignsPage() {
  const viewer = await requireRole("brand");
  const supabase = await createClient();
  const { data, error } = await supabase.from("campaigns").select("*, applications(count)").eq("brand_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const campaigns = (data ?? []) as Array<Campaign & { applications?: Array<{ count: number }> }>;
  return <div className="stack" style={{ gap: "1.7rem" }}><div className="cluster" style={{ justifyContent: "space-between" }}><div><p className="eyebrow">Brand campaigns</p><h1 className="page-title">Your open calls</h1><p className="muted">Publish a brief, then review every creator who raises their hand.</p></div><Link className="button button--primary" href="/brand/campaigns/new"><Plus size={17} aria-hidden="true" /> Publish campaign</Link></div>{error ? <div className="notice notice--error" role="alert">Campaigns could not be loaded. Refresh the page to try again.</div> : campaigns.length === 0 ? <EmptyState title="Publish your first campaign" message="Add a focused Instagram or TikTok brief. Creator applications will appear on its detail page." action="Publish campaign" href="/brand/campaigns/new" /> : <div className="campaign-grid">{campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} href={`/brand/campaigns/${campaign.id}`} meta={`${campaign.applications?.[0]?.count ?? 0} applicants`} />)}</div>}</div>;
}
