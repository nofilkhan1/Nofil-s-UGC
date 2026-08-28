"use client";

import { useMemo, useState } from "react";
import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/empty-state";
import { filterAndSortCampaigns, type CampaignSort, type CampaignWithBrowseMeta } from "@/lib/campaign-filters";
import type { Niche } from "@/lib/niches";

export function CampaignBrowseResults({ campaigns, creatorNiches = [] }: { campaigns: CampaignWithBrowseMeta[]; creatorNiches?: readonly Niche[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recommended" | "newest" | "popular">("recommended");
  const visible = useMemo(() => filterAndSortCampaigns(campaigns, search, sort, creatorNiches), [campaigns, creatorNiches, search, sort]);
  return <>
    <div className="cluster" style={{ alignItems: "end", justifyContent: "space-between" }}>
      <div className="field" style={{ flex: "1 1 20rem" }}><label className="field__label" htmlFor="campaign-search">Search campaigns</label><input id="campaign-search" className="input" type="search" value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Search title or description" /></div>
      <div className="field" style={{ flex: "0 1 13rem" }}><label className="field__label" htmlFor="campaign-sort">Sort by</label><select id="campaign-sort" className="input" value={sort} onChange={(event) => setSort(event.currentTarget.value as CampaignSort)}><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="popular">Highest pay · popular</option></select></div>
    </div>
    {visible.length === 0 ? <EmptyState title={search ? "No campaigns match your search" : "No matching campaigns right now"} message={search ? "Try a different title or description." : "Try another category or platform."} action={search ? <button className="button button--secondary" type="button" onClick={() => setSearch("")}>Clear search</button> : undefined} /> : <><p className="muted" role="status">Showing {visible.length} campaign{visible.length === 1 ? "" : "s"}</p><div className="campaign-grid">{visible.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} href={`/creator/campaigns/${campaign.id}`} />)}</div></>}
  </>;
}
