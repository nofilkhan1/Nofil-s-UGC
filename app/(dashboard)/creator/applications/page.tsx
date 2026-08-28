import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Application, Campaign } from "@/lib/types";

export const metadata = { title: "My applications" };
type CreatorApplication = Application & { campaign: Campaign & { brand: { display_name: string } | null } };

export default async function CreatorApplicationsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const viewer = await requireRole("creator");
  const query = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("applications").select("*, campaign:campaigns!applications_campaign_id_fkey(*, brand:profiles!campaigns_brand_id_fkey(display_name))").eq("creator_id", viewer.user.id).order("created_at", { ascending: false }).limit(50);
  const applications = (data ?? []) as CreatorApplication[];
  return <div className="stack" style={{ gap: "1.7rem" }}><div><p className="eyebrow">Your proposals</p><h1 className="page-title">My applications</h1><p className="muted">Track every quote and brand decision in one place.</p></div>{query.submitted === "1" ? <div className="notice notice--success" role="status">Application sent. The brand can now review your profile and quote.</div> : null}{error ? <div className="notice notice--error" role="alert">Applications could not be loaded. Refresh to try again.</div> : applications.length === 0 ? <EmptyState title="No applications yet" message="Browse live campaigns and apply when the brief fits your work." action="Find campaigns" href="/creator/campaigns" /> : <div className="stack">{applications.map((application) => <article className="panel" key={application.id}><div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-start" }}><div><span className={`badge badge--${application.campaign.platform}`}>{application.campaign.platform}</span><h2 className="section-title" style={{ marginTop: "0.7rem" }}><Link href={`/creator/campaigns/${application.campaign.id}`}>{application.campaign.title}</Link></h2><p className="muted">{application.campaign.brand?.display_name} · {application.campaign.post_count} × {application.campaign.content_format}</p></div><div className="cluster"><StatusBadge status={application.status} />{application.status === "approved" ? <Link className="button button--secondary" href={`/messages/${application.id}`}>Message</Link> : null}</div></div><div className="cluster" style={{ justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}><span><small className="muted">Your quote</small><strong style={{ display: "block", fontVariantNumeric: "tabular-nums" }}>{application.currency} {Number(application.price_per_post).toLocaleString("en")} per post</strong></span><span><small className="muted">Campaign dates</small><strong style={{ display: "block" }}>{application.campaign.start_date} – {application.campaign.end_date}</strong></span></div>{application.status === "approved" ? <div className="notice notice--success" style={{ marginTop: "1rem" }}>You were selected. Review the brief and campaign dates, then fulfill the listed requirements.</div> : null}</article>)}</div>}</div>;
}
