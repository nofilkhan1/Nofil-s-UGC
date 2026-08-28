import { describe, expect, it } from "vitest";
import { applicationSchema, campaignSchema, signupSchema } from "@/lib/validation";
import { filterAndSortCampaigns } from "@/lib/campaign-filters";
import { countNicheMatches } from "@/lib/niche-matching";

describe("campaign validation", () => {
  const valid = {
    title: "Summer skincare launch",
    description: "Create an honest product-led short-form video with clear talking points.",
    platform: "instagram" as const,
    contentFormat: "Reel",
    postCount: 2,
    startDate: "2026-09-01",
    endDate: "2026-09-14",
    niches: ["Beauty & Fashion"],
  };

  it("accepts a complete date-only campaign brief", () => {
    expect(campaignSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a campaign that ends before it starts", () => {
    const result = campaignSchema.safeParse({ ...valid, endDate: "2026-08-31" });
    expect(result.success).toBe(false);
  });

  it("rejects unsupported platforms", () => {
    expect(campaignSchema.safeParse({ ...valid, platform: "youtube" }).success).toBe(false);
  });
});

describe("account and application validation", () => {
  it("combines browse search and popular sorting", () => {
    const base = { id: "00000000-0000-0000-0000-000000000001", brand_id: "00000000-0000-0000-0000-000000000002", platform: "instagram" as const, content_format: "Reel", post_count: 1, start_date: "2026-01-01", end_date: "2026-01-02", status: "live" as const, niches: ["Beauty & Fashion"] as ["Beauty & Fashion"] };
    const results = filterAndSortCampaigns([{ ...base, title: "Skincare launch", description: "A beauty brief", created_at: "2026-01-01", application_count: 1 }, { ...base, id: "00000000-0000-0000-0000-000000000003", title: "Gaming setup", description: "Tech products", created_at: "2026-02-01", application_count: 9 }], "beauty", "popular");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Skincare launch");
  });

  it("counts overlapping campaign and creator niches", () => {
    expect(countNicheMatches(["Beauty & Fashion", "Travel"], ["Travel", "Gaming"])).toBe(1);
  });
  it("does not allow admin as a signup role", () => {
    expect(signupSchema.safeParse({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" }).success).toBe(false);
  });

  it("requires a positive per-post quote", () => {
    expect(applicationSchema.safeParse({ campaignId: "8a4eec3b-5f08-491c-aeb0-5ce80362d3ab", pricePerPost: 0, currency: "USD", note: "" }).success).toBe(false);
  });

  it("accepts a concise optional application pitch", () => {
    expect(applicationSchema.safeParse({ campaignId: "8a4eec3b-5f08-491c-aeb0-5ce80362d3ab", pricePerPost: 100, currency: "USD", note: "", pitch: "I make product demos that convert." }).success).toBe(true);
  });
});
