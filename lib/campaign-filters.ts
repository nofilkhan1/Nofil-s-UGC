import type { Campaign } from "@/lib/types";
import { countNicheMatches } from "@/lib/niche-matching";
import type { Niche } from "@/lib/niches";

export type CampaignWithBrowseMeta = Campaign & { application_count?: number; appliedStatus?: "pending" | "approved" | "rejected"; niche_match_count?: number };
export type CampaignSort = "recommended" | "newest" | "popular";

export function filterAndSortCampaigns(campaigns: CampaignWithBrowseMeta[], search: string, sort: CampaignSort, creatorNiches: readonly Niche[] = []) {
  const query = search.trim().toLocaleLowerCase();
  const filtered = campaigns.filter((campaign) => !query || `${campaign.title} ${campaign.description}`.toLocaleLowerCase().includes(query));
  return [...filtered].sort((a, b) => {
    if (sort === "popular") return (b.application_count ?? 0) - (a.application_count ?? 0) || b.created_at.localeCompare(a.created_at);
    if (sort === "recommended" && creatorNiches.length > 0) return countNicheMatches(b.niches, creatorNiches) - countNicheMatches(a.niches, creatorNiches) || b.created_at.localeCompare(a.created_at);
    return b.created_at.localeCompare(a.created_at);
  });
}
