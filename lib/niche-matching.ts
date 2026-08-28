import type { Niche } from "@/lib/niches";

export function countNicheMatches(campaignNiches: readonly Niche[] = [], creatorNiches: readonly Niche[] = []) {
  return creatorNiches.filter((niche) => campaignNiches.includes(niche)).length;
}
