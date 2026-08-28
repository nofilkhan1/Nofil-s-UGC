import { z } from "zod";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const campaignSchema = z
  .object({
    title: z.string().trim().min(3, "Use at least 3 characters.").max(100),
    description: z.string().trim().min(20, "Add at least 20 characters so creators can judge the fit.").max(3000),
    platform: z.enum(["instagram", "tiktok"]),
    contentFormat: z.string().trim().min(2, "Describe the format, such as Reel or TikTok video.").max(80),
    postCount: z.coerce.number().int().min(1, "Request at least one post.").max(100),
    startDate: z.string().regex(isoDate, "Use YYYY-MM-DD."),
    endDate: z.string().regex(isoDate, "Use YYYY-MM-DD."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "End date must be on or after the start date.",
  });

export const applicationSchema = z.object({
  campaignId: z.string().uuid(),
  pricePerPost: z.coerce.number().positive("Enter a price greater than zero.").max(1_000_000),
  currency: z.enum(["USD", "GBP", "EUR", "PKR"]),
  note: z.string().trim().max(500).optional(),
});

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("Enter a complete URL beginning with https://"),
]);

export const creatorProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter your name.").max(80),
  gender: z.enum(["woman", "man", "non_binary", "prefer_not_to_say", ""]),
  age: z.union([z.literal(""), z.coerce.number().int().min(18).max(100)]),
  bio: z.string().trim().max(600),
  portfolioUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  role: z.enum(["brand", "creator"]),
});
