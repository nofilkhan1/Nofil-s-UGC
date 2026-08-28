import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignLifecycleForm } from "@/components/campaign-lifecycle-form";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Campaigns" };

export default async function BrandCampaignsPage() {
  const viewer = await requireRole("brand");
  const { data, error } = await (await createClient()).from("campaigns").select("*, applications(count)").eq("brand_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const campaigns = (data ?? []) as Array<Campaign & { applications?: Array<{ count: number }> }>;
  return <div className="stack" style={{ gap: "1.7rem" }}>
    <div className="cluster" style={{ justifyContent: "space-between" }}><div><p className="eyebrow">Campaign library</p><h1 className="page-title">Manage your briefs</h1><p className="muted">Edit details, publish ready campaigns, and review creator applications from one focused list.</p></div><Link className="button button--primary" href="/brand/campaigns/new"><Plus size={17} aria-hidden="true" /> Create campaign</Link></div>
    {error ? <div className="notice notice--error" role="alert">Campaigns could not be loaded. Refresh the page to try again.</div> : campaigns.length === 0 ? <EmptyState title="No campaigns yet" message="Create a campaign brief to start inviting creators." action="Create your first campaign" href="/brand/campaigns/new" /> : <div className="campaign-grid">{campaigns.map((campaign) => <div className="stack" style={{ gap: "0.75rem" }} key={campaign.id}><CampaignCard campaign={campaign} href={`/brand/campaigns/${campaign.id}`} meta={`${campaign.applications?.[0]?.count ?? 0} applicants · ${campaign.view_count ?? 0} views`} />{campaign.status === "draft" || campaign.status === "live" ? <div className="cluster"><Link className="button button--ghost" href={`/brand/campaigns/${campaign.id}/edit`}>Edit campaign</Link><CampaignLifecycleForm campaignId={campaign.id} status={campaign.status} /></div> : null}</div>)}</div>}
  </div>;
}
