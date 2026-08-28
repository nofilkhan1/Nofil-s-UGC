import Link from "next/link";
import { ArrowUpRight, CalendarDays, Layers3 } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppliedBadge } from "@/components/ui/applied-badge";
import type { ApplicationStatus } from "@/lib/types";

function displayDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function CampaignCard({ campaign, href, meta, appliedStatus }: { campaign: Campaign; href: string; meta?: string; appliedStatus?: ApplicationStatus }) {
  const platform = campaign.platform === "instagram" ? "Instagram" : "TikTok";
  const resolvedAppliedStatus = appliedStatus ?? (campaign as Campaign & { appliedStatus?: ApplicationStatus }).appliedStatus;
  return (
    <article className="campaign-card" style={{ "--platform-color": campaign.platform === "instagram" ? "var(--color-primary)" : "var(--color-accent)" } as React.CSSProperties}>
      <div className="campaign-card__body">
        <div className="cluster" style={{ justifyContent: "space-between" }}>
          <span className={`badge badge--${campaign.platform}`}>{platform}</span>
          <StatusBadge status={campaign.status} />
        </div>
        <div>
          {campaign.brand?.display_name ? <p className="eyebrow">{campaign.brand.display_name}</p> : null}
          <h2 className="campaign-card__title"><Link href={href}>{campaign.title}</Link></h2>
        </div>
        <p className="campaign-card__description">{campaign.description}</p>
        <div className="niche-badges">{campaign.niches?.map((niche) => <span className="badge" key={niche}>{niche}</span>)}{(campaign as Campaign & { niche_match_count?: number }).niche_match_count ? <span className="badge badge--instagram">{(campaign as Campaign & { niche_match_count: number }).niche_match_count} niche match{(campaign as Campaign & { niche_match_count: number }).niche_match_count === 1 ? "" : "es"}</span> : null}</div>
        <div className="campaign-card__requirements">
          <span className="requirement"><span className="requirement__label"><Layers3 size={12} aria-hidden="true" /> Deliverables</span><span className="requirement__value">{campaign.post_count} × {campaign.content_format}</span></span>
          <span className="requirement"><span className="requirement__label"><CalendarDays size={12} aria-hidden="true" /> Run dates</span><span className="requirement__value">{displayDate(campaign.start_date)} – {displayDate(campaign.end_date)}</span></span>
        </div>
      </div>
      <div className="campaign-card__footer">
        <span className="cluster"><span className="muted">{meta ?? "Open brief"}</span>{resolvedAppliedStatus ? <AppliedBadge status={resolvedAppliedStatus} /> : null}</span>
        <Link href={href} className="button button--ghost" aria-label={`View ${campaign.title}`}>View <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
