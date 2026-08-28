import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/application-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppliedBadge } from "@/components/ui/applied-badge";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Campaign brief" };

export default async function CreatorCampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireRole("creator");
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("campaigns").select("*, brand:profiles!campaigns_brand_id_fkey(display_name)").eq("id", id).single();
  if (!data) notFound();
  const campaign = data as Campaign;
  if (campaign.status !== "live") return <div className="stack" style={{ maxWidth: "44rem", gap: "1rem" }}><Link href="/creator/campaigns" className="muted">← Find campaigns</Link><div className="panel"><StatusBadge status={campaign.status} /><h1 className="page-title" style={{ marginTop: "0.75rem" }}>{campaign.title}</h1><p className="notice notice--warning" role="status">This campaign is no longer accepting applications.</p></div></div>;
  const { data: existing } = await supabase.from("applications").select("id,status,price_per_post,currency").eq("campaign_id", id).eq("creator_id", viewer.user.id).maybeSingle();
  return <div className="stack" style={{ maxWidth: "68rem", gap: "1.5rem" }}><div><Link href="/creator/campaigns" className="muted">← Find campaigns</Link><div className="cluster" style={{ justifyContent: "space-between", marginTop: "1rem" }}><div><div className="cluster"><span className={`badge badge--${campaign.platform}`}>{campaign.platform}</span><StatusBadge status={campaign.status} /></div><p className="eyebrow" style={{ marginTop: "1rem" }}>{campaign.brand?.display_name}</p><h1 className="page-title">{campaign.title}</h1></div></div></div><div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(18rem, 0.6fr)", gap: "1rem", alignItems: "start" }}><section className="panel"><h2 className="section-title">The brief</h2><p style={{ whiteSpace: "pre-wrap" }}>{campaign.description}</p><div className="campaign-card__requirements"><span className="requirement"><span className="requirement__label">Platform</span><span className="requirement__value">{campaign.platform}</span></span><span className="requirement"><span className="requirement__label">Deliverables</span><span className="requirement__value">{campaign.post_count} × {campaign.content_format}</span></span><span className="requirement"><span className="requirement__label">Starts</span><span className="requirement__value">{campaign.start_date}</span></span><span className="requirement"><span className="requirement__label">Ends</span><span className="requirement__value">{campaign.end_date}</span></span></div></section><aside className="panel">{existing ? <><p className="eyebrow">Application sent</p><h2 className="section-title">Your quote is on the roster</h2><p><strong>{existing.currency} {Number(existing.price_per_post).toLocaleString("en")}</strong> per post</p><AppliedBadge status={existing.status as "pending" | "approved" | "rejected"} /><p className="muted" style={{ marginTop: "1rem" }}>This campaign already has your application. You cannot apply twice; your status will update here after the brand decides.</p><Link className="button button--secondary" href="/creator/applications">View applications</Link></> : <><p className="eyebrow">Your proposal</p><h2 className="section-title">Apply to this campaign</h2><p className="muted">The brand will see your creator profile and this per-post quote.</p><ApplicationForm campaignId={campaign.id} /></>}</aside></div></div>;
}
