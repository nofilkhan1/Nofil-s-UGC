import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignLifecycleForm } from "@/components/campaign-lifecycle-form";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";
import { getBrandDashboardState } from "@/lib/brand-dashboard";
import { Check, Circle, Users, Send, FileCheck2 } from "lucide-react";

export const metadata = { title: "Campaigns" };

export default async function BrandCampaignsPage() {
  const viewer = await requireRole("brand");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, applications(count)")
    .eq("brand_id", viewer.user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  const campaigns = (data ?? []) as Array<
    Campaign & { applications?: Array<{ count: number }> }
  >;
  const campaignRows = campaigns.map(({ id, title, status, created_at }) => ({ id, title, status, created_at }));
  const campaignIds = campaigns.map((campaign) => campaign.id);
  const { data: applicationRows } = campaignIds.length
    ? await supabase.from("applications").select("campaign_id,status,delivery_status").in("campaign_id", campaignIds)
    : { data: [] };
  const dashboard = getBrandDashboardState(campaignRows, (applicationRows ?? []) as Parameters<typeof getBrandDashboardState>[1]);
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
  return (
    <div className="stack" style={{ gap: "1.7rem" }}>
      <section className="panel brand-dashboard-hero">
        <div className="stack" style={{ gap: "0.55rem" }}>
          <p className="eyebrow">Your creator workspace</p>
          <h1 className="page-title">Run every creator brief from one place.</h1>
          <p className="muted">Post campaigns, review applicants, and coordinate with creators — all in one place.</p>
        </div>
        <div className="cluster brand-dashboard-hero__actions">
          <Link className="button button--primary" href="/brand/campaigns/new"><Plus size={17} aria-hidden="true" /> Create campaign</Link>
          <Link className="button button--secondary" href={dashboard.applicantsHref}><Users size={17} aria-hidden="true" /> View applicants</Link>
        </div>
      </section>
      <section className="brand-dashboard-progress" aria-label="Workspace progress">
        {progress.map(({ label, detail, complete, icon: Icon }) => <div className={`panel progress-step${complete ? " progress-step--complete" : ""}`} key={label}><span className="progress-step__indicator" aria-hidden="true">{complete ? <Check size={16} /> : <Circle size={16} />}</span><Icon size={17} aria-hidden="true" /><div><strong>{label}</strong><p className="muted">{detail}</p></div></div>)}
      </section>
      <section className="panel brand-dashboard-checklist">
        <div className="cluster" style={{ justifyContent: "space-between", alignItems: "end" }}><div><p className="eyebrow">Next steps</p><h2 style={{ margin: 0 }}>Keep your creator engine moving</h2></div><span className="badge badge--info">{dashboard.completedCount} of {checklist.length} completed</span></div>
        <div className="stack" style={{ gap: "0.65rem" }}>{checklist.map((item, index) => <div className="brand-dashboard-checklist__row" key={item.title}><span className="brand-dashboard-checklist__number">{index + 1}</span><div><strong>{item.title}</strong><p className="muted">{item.detail}</p></div>{item.complete ? <span className="badge badge--success"><Check size={14} /> Done</span> : <Link className="button button--secondary" href={item.href}>Start now</Link>}</div>)}</div>
      </section>
      <div className="cluster" style={{ justifyContent: "space-between" }}>
        <div>
          <p className="eyebrow">Brand campaigns</p>
          <h1 className="page-title">Your open calls</h1>
          <p className="muted">
            Publish a brief, then review every creator who raises their hand.
          </p>
        </div>
        <Link className="button button--primary" href="/brand/campaigns/new">
          <Plus size={17} aria-hidden="true" /> Create campaign
        </Link>
      </div>
      {error ? (
        <div className="notice notice--error" role="alert">
          Campaigns could not be loaded. Refresh the page to try again.
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="Create your first campaign"
          message="Start in draft, then publish when your brief is ready for creators."
          action="Create campaign"
          href="/brand/campaigns/new"
        />
      ) : (
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <div className="stack" style={{ gap: "0.75rem" }} key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                href={`/brand/campaigns/${campaign.id}`}
                meta={`${campaign.applications?.[0]?.count ?? 0} applicants · ${campaign.view_count ?? 0} views`}
              />
              {campaign.status === "draft" || campaign.status === "live" ? (
                <CampaignLifecycleForm
                  campaignId={campaign.id}
                  status={campaign.status}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
