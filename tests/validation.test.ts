import { describe, expect, it } from "vitest";
import { applicationSchema, campaignSchema, signupSchema } from "@/lib/validation";

describe("campaign validation", () => {
  const valid = {
    title: "Summer skincare launch",
    description: "Create an honest product-led short-form video with clear talking points.",
    platform: "instagram" as const,
    contentFormat: "Reel",
    postCount: 2,
    startDate: "2026-09-01",
    endDate: "2026-09-14",
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
  it("does not allow admin as a signup role", () => {
    expect(signupSchema.safeParse({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" }).success).toBe(false);
  });

  it("requires a positive per-post quote", () => {
    expect(applicationSchema.safeParse({ campaignId: "8a4eec3b-5f08-491c-aeb0-5ce80362d3ab", pricePerPost: 0, currency: "USD", note: "" }).success).toBe(false);
  });
});
