import Link from "next/link";
import { Check, Circle, FileCheck2, Plus, Send, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getBrandDashboardState } from "@/lib/brand-dashboard";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Brand dashboard" };

export default async function BrandDashboardPage() {
  const viewer = await requireRole("brand");
  const { data, error } = await (await createClient()).from("campaigns").select("id,title,status,created_at").eq("brand_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const campaigns = (data ?? []) as Pick<Campaign, "id" | "title" | "status" | "created_at">[];
  const campaignIds = campaigns.map((campaign) => campaign.id);
  const supabase = await createClient();
  const { data: applicationRows } = campaignIds.length ? await supabase.from("applications").select("campaign_id,status,delivery_status").in("campaign_id", campaignIds) : { data: [] };
  const dashboard = getBrandDashboardState(campaigns, (applicationRows ?? []) as Parameters<typeof getBrandDashboardState>[1]);
  const progress = [
    { label: "Campaign created", detail: "Your first campaign is set up.", complete: dashboard.campaignCreated, icon: Send },
    { label: "Creators engaged", detail: "At least one creator has applied to your campaigns.", complete: dashboard.creatorsEngaged, icon: Users },
    { label: "Deliverable received", detail: "A creator has submitted or confirmed a deliverable.", complete: dashboard.deliverableReceived, icon: FileCheck2 },
  ];
  const checklist = [
    { title: "Create your first campaign", detail: "Set up a brief so creators know what you need.", complete: dashboard.campaignCreated, href: "/brand/campaigns/new" },
    { title: "Review your applicants", detail: "Make a decision on creators who applied.", complete: dashboard.applicantsReviewed, href: dashboard.applicantsHref },
    { title: "Publish a campaign", detail: "Put a ready brief in front of creators.", complete: dashboard.campaignPublished, href: "/brand/campaigns" },
    { title: "Confirm a deliverable", detail: "Close the loop when submitted work is approved.", complete: dashboard.deliverableConfirmed, href: dashboard.applicantsHref },
  ];
  const liveCount = campaigns.filter((campaign) => campaign.status === "live").length;
  const closedCount = campaigns.filter((campaign) => campaign.status === "closed").length;
  const recent = campaigns[0];
  return <div className="stack" style={{ gap: "1.7rem" }}>
    <section className="panel brand-dashboard-hero"><div className="stack" style={{ gap: "0.55rem" }}><p className="eyebrow">Brand control room</p><h1 className="page-title">Keep your creator work moving.</h1><p className="muted">Start a brief, watch responses come in, and keep every decision in one place.</p></div><div className="cluster brand-dashboard-hero__actions"><Link className="button button--primary" href="/brand/campaigns/new"><Plus size={17} aria-hidden="true" /> Create campaign</Link><Link className="button button--secondary" href={dashboard.applicantsHref}><Users size={17} aria-hidden="true" /> View applicants</Link></div></section>
    <section className="brand-dashboard-progress" aria-label="Workspace progress">{progress.map(({ label, detail, complete, icon: Icon }) => <div className={`panel progress-step${complete ? " progress-step--complete" : ""}`} key={label}><span className="progress-step__indicator" aria-hidden="true">{complete ? <Check size={16} /> : <Circle size={16} />}</span><Icon size={17} aria-hidden="true" /><div><strong>{label}</strong><p className="muted">{detail}</p></div></div>)}</section>
    <section className="panel brand-dashboard-checklist"><div className="cluster" style={{ justifyContent: "space-between", alignItems: "end" }}><div><p className="eyebrow">Next steps</p><h2 style={{ margin: 0 }}>Build momentum with creators</h2></div><span className="badge badge--info">{dashboard.completedCount} of {checklist.length} completed</span></div><div className="stack" style={{ gap: "0.65rem" }}>{checklist.map((item, index) => <div className="brand-dashboard-checklist__row" key={item.title}><span className="brand-dashboard-checklist__number">{index + 1}</span><div><strong>{item.title}</strong><p className="muted">{item.detail}</p></div>{item.complete ? <span className="badge badge--success"><Check size={14} /> Done</span> : <Link className="button button--secondary" href={item.href}>Start now</Link>}</div>)}</div></section>
    <section className="panel" aria-labelledby="campaign-overview-title"><div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><div><p className="eyebrow">At a glance</p><h2 id="campaign-overview-title" className="section-title">Your campaign workspace</h2><p className="muted">A quick read on your briefs — open the campaign library for the full list and controls.</p></div><Link className="button button--secondary" href="/brand/campaigns">View all campaigns</Link></div>{error ? <div className="notice notice--error" role="alert">Campaign summary could not be loaded. Refresh to try again.</div> : campaigns.length === 0 ? <EmptyState title="No campaigns yet" message="Create your first brief to start building your creator pipeline." action="Create campaign" href="/brand/campaigns/new" /> : <div className="campaign-summary"><div className="campaign-summary__stats"><div><strong>{liveCount}</strong><span>Live campaigns</span></div><div><strong>{closedCount}</strong><span>Closed campaigns</span></div><div><strong>{campaigns.length}</strong><span>Total campaigns</span></div></div>{recent ? <div className="campaign-summary__recent"><span className="muted">Most recent brief</span><Link href={`/brand/campaigns/${recent.id}`}>{recent.title}</Link><span className={`badge badge--${recent.status}`}>{recent.status}</span></div> : null}</div>}</section>
  </div>;
}
