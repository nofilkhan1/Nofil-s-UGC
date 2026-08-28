import type { ApplicationStatus, CampaignStatus } from "@/lib/types";

export type DashboardCampaign = { id: string; title: string; status: CampaignStatus; created_at: string };
export type DashboardApplication = {
  campaign_id: string;
  status: ApplicationStatus;
  delivery_status?: "not_submitted" | "submitted" | "confirmed" | null;
};

export function getBrandDashboardState(campaigns: DashboardCampaign[], applications: DashboardApplication[]) {
  const campaignCreated = campaigns.length > 0;
  const creatorsEngaged = applications.some((application) => application.status === "pending" || application.status === "approved");
  const deliverableReceived = applications.some((application) => application.delivery_status === "submitted" || application.delivery_status === "confirmed");
  const applicantsReviewed = applications.some((application) => application.status === "approved" || application.status === "rejected");
  const campaignPublished = campaigns.some((campaign) => campaign.status === "live");
  const deliverableConfirmed = applications.some((application) => application.delivery_status === "confirmed");
  const latestCampaign = [...campaigns].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const pendingCampaignId = applications
    .filter((application) => application.status === "pending")
    .map((application) => campaigns.find((campaign) => campaign.id === application.campaign_id))
    .filter((campaign): campaign is DashboardCampaign => Boolean(campaign))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.id;
  const applicantsCampaignId = pendingCampaignId ?? applications
    .map((application) => campaigns.find((campaign) => campaign.id === application.campaign_id))
    .filter((campaign): campaign is DashboardCampaign => Boolean(campaign))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.id;
  return {
    campaignCreated,
    creatorsEngaged,
    deliverableReceived,
    applicantsReviewed,
    campaignPublished,
    deliverableConfirmed,
    completedCount: [campaignCreated, creatorsEngaged, deliverableReceived, deliverableConfirmed].filter(Boolean).length,
    applicantsHref: applicantsCampaignId ? `/brand/campaigns/${applicantsCampaignId}` : latestCampaign ? `/brand/campaigns/${latestCampaign.id}` : "/brand/campaigns",
  };
}
