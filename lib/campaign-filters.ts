import type { Campaign } from "@/lib/types";

export type CampaignWithBrowseMeta = Campaign & { application_count?: number; appliedStatus?: "pending" | "approved" | "rejected" };
export type CampaignSort = "recommended" | "newest" | "popular";

export function filterAndSortCampaigns(campaigns: CampaignWithBrowseMeta[], search: string, sort: CampaignSort) {
  const query = search.trim().toLocaleLowerCase();
  const filtered = campaigns.filter((campaign) => !query || `${campaign.title} ${campaign.description}`.toLocaleLowerCase().includes(query));
  return [...filtered].sort((a, b) => sort === "popular" ? (b.application_count ?? 0) - (a.application_count ?? 0) || b.created_at.localeCompare(a.created_at) : b.created_at.localeCompare(a.created_at));
}
