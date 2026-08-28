export type UserRole = "brand" | "creator" | "admin";
export type Platform = "instagram" | "tiktok";
export type CampaignStatus = "draft" | "published" | "closed";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
};

export type Campaign = {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  platform: Platform;
  content_format: string;
  post_count: number;
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  created_at: string;
  brand?: { display_name: string } | null;
};

export type CreatorProfile = {
  user_id: string;
  gender: string | null;
  age: number | null;
  bio: string | null;
  portfolio_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
};

export type Application = {
  id: string;
  campaign_id: string;
  creator_id: string;
  price_per_post: number;
  currency: string;
  note: string | null;
  status: ApplicationStatus;
  created_at: string;
  decided_at: string | null;
};
