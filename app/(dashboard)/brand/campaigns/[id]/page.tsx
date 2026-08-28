import Link from "next/link";
import {
  Camera as Instagram,
  ExternalLink,
  Music2,
  UsersRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { DecisionForm } from "@/components/decision-form";
import { confirmDeliverableAction } from "@/app/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type {
  Application,
  Campaign,
  CreatorProfile,
  Profile,
} from "@/lib/types";
import { countNicheMatches } from "@/lib/niche-matching";

export const metadata = { title: "Campaign applicants" };
type Applicant = Application & {
  creator: Profile & { creator_profiles: CreatorProfile[] };
};

export default async function BrandCampaignDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const viewer = await requireRole("brand");
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("brand_id", viewer.user.id)
    .single();
  if (!campaign) notFound();
  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      "*, creator:profiles!applications_creator_id_fkey(*, creator_profiles(*))",
    )
    .eq("campaign_id", id)
    .order("created_at", { ascending: false });
  const typedCampaign = campaign as Campaign;
  const applicants = (applications ?? []) as Applicant[];
  const unreadRows = applicants.length ? await supabase.from("messages").select("application_id").in("application_id", applicants.map((application) => application.id)).is("read_at", null).neq("sender_id", viewer.user.id) : { data: [] };
  const unreadApplicationIds = new Set((unreadRows.data ?? []).map((message) => message.application_id));
  return (
    <div className="stack" style={{ gap: "1.7rem" }}>
      <div>
        <Link href="/brand/campaigns" className="muted">
          ← Campaigns
        </Link>
        {query.created === "1" ? (
          <div
            className="notice notice--success"
            role="status"
            style={{ marginTop: "1rem" }}
          >
            Campaign saved as a draft. Publish it when the brief is ready for
            creators.
          </div>
        ) : null}
        <div
          className="cluster"
          style={{ justifyContent: "space-between", marginTop: "1rem" }}
        >
          <div>
            <span className={`badge badge--${typedCampaign.platform}`}>
              {typedCampaign.platform}
            </span>
            <h1 className="page-title" style={{ marginTop: "0.7rem" }}>
              {typedCampaign.title}
            </h1>
            <p className="muted">
              {typedCampaign.post_count} × {typedCampaign.content_format} ·{" "}
              {typedCampaign.start_date} to {typedCampaign.end_date} · {typedCampaign.view_count ?? 0} views
            </p>
          </div>
          <StatusBadge status={typedCampaign.status} />
        </div>
        <div className="panel">
          <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
            {typedCampaign.description}
          </p>
        </div>
      </div>
      <section className="stack">
        <div className="cluster">
          <UsersRound aria-hidden="true" />
          <div>
            <h2 className="section-title">Applicants</h2>
            <p className="muted" style={{ margin: 0 }}>
              {applicants.length} creator{applicants.length === 1 ? "" : "s"}{" "}
              applied
            </p>
          </div>
        </div>
        {error ? (
          <div className="notice notice--error" role="alert">
            Applicants could not be loaded. Refresh to try again.
          </div>
        ) : applicants.length === 0 ? (
          <EmptyState
            title="No applications yet"
            message={
              typedCampaign.status === "live"
                ? "This campaign is live. Creator profiles and quotes will appear here as applications arrive."
                : "Applications can arrive after this campaign is published."
            }
          />
        ) : (
          <div className="stack">
            {applicants.map((application) => {
              const details = application.creator.creator_profiles?.[0];
              const nicheMatches = countNicheMatches(
                typedCampaign.niches ?? [],
                details?.niches ?? [],
              );
              return (
                <article className="panel" key={application.id}>
                  <div
                    className="cluster"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div className="mini-profile">
                      <span className="avatar" aria-hidden="true">
                        {application.creator.display_name
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span>
                        <h3 style={{ marginBottom: "0.1rem" }}>
                          {application.creator.display_name}{" "}
                          {nicheMatches > 0 ? (
                            <span
                              className="badge badge--instagram"
                              style={{
                                marginLeft: "0.35rem",
                                verticalAlign: "middle",
                              }}
                            >
                              {nicheMatches} niche match
                              {nicheMatches === 1 ? "" : "es"}
                            </span>
                          ) : null}
                        </h3>
                        <span className="muted">
                          {details?.age
                            ? `Age ${details.age}`
                            : "Age not shared"}
                          {details?.gender
                            ? ` · ${details.gender.replaceAll("_", " ")}`
                            : ""}
                        </span>
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong
                        style={{
                          fontSize: "1.25rem",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {application.currency}{" "}
                        {Number(application.price_per_post).toLocaleString(
                          "en",
                        )}
                      </strong>
                      <small className="muted" style={{ display: "block" }}>
                        per post
                      </small>
                    </div>
                  </div>
                  {details?.bio ? (
                    <p style={{ marginTop: "1rem" }}>{details.bio}</p>
                  ) : null}
                  {application.pitch ? (
                    <div className="notice" style={{ marginTop: "1rem" }}>
                      <strong>Why they are a good fit</strong>
                      <p
                        style={{ margin: "0.3rem 0 0", whiteSpace: "pre-wrap" }}
                      >
                        {application.pitch}
                      </p>
                    </div>
                  ) : null}
                  <div className="cluster" style={{ marginTop: "1rem" }}>
                    {details?.portfolio_url ? (
                      <a
                        className="button button--secondary"
                        href={details.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Portfolio <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    ) : null}
                    {details?.instagram_handle ? (
                      <a
                        className="button button--ghost"
                        href={`https://instagram.com/${details.instagram_handle}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Instagram size={15} aria-hidden="true" /> @
                        {details.instagram_handle}
                      </a>
                    ) : null}
                    {details?.tiktok_handle ? (
                      <a
                        className="button button--ghost"
                        href={`https://tiktok.com/@${details.tiktok_handle}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Music2 size={15} aria-hidden="true" /> @
                        {details.tiktok_handle}
                      </a>
                    ) : null}
                  </div>
                  {application.status === "approved" && details?.top_content_links?.filter(Boolean).length ? <div className="cluster top-content-links">{details.top_content_links.filter(Boolean).map((url, index) => <a className="button button--ghost" href={url} target="_blank" rel="noreferrer" key={url}>Top video {index + 1}</a>)}</div> : null}
                  {application.status === "approved" ? application.delivery_status === "submitted" || application.delivery_status === "confirmed" ? <div className="notice" style={{ marginTop: "1rem" }}><strong>{application.delivery_status === "confirmed" ? "Delivered ✓" : "Deliverable submitted"}</strong>{application.deliverable_url ? <p style={{ margin: "0.3rem 0 0" }}><a href={application.deliverable_url} target="_blank" rel="noreferrer">View submitted content</a></p> : null}{application.delivery_status === "submitted" ? <form action={async (formData) => { await confirmDeliverableAction({ status: "idle" }, formData); }} style={{ marginTop: "0.75rem" }}><input type="hidden" name="applicationId" value={application.id} /><SubmitButton intent="success">Confirm delivery</SubmitButton></form> : null}</div> : <p className="muted" style={{ marginTop: "1rem" }}>Awaiting deliverable</p> : null}
                  {application.note ? (
                    <div className="notice" style={{ marginTop: "1rem" }}>
                      <strong>Creator note</strong>
                      <p style={{ margin: "0.3rem 0 0" }}>{application.note}</p>
                    </div>
                  ) : null}
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    {application.status === "pending" ? (
                      <DecisionForm applicationId={application.id} />
                    ) : (
                      <div className="cluster">
                        <StatusBadge status={application.status} />
                        {application.status === "approved" ? (
                          <Link
                            className="button button--secondary"
                            href={`/messages/${application.id}`}
                          >
                            Message{unreadApplicationIds.has(application.id) ? <span className="message-unread-dot" aria-label="Unread messages" /> : null}
                          </Link>
                        ) : null}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
