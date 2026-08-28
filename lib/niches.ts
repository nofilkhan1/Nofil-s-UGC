export const NICHES = ["Health & Fitness", "Beauty & Fashion", "Food & Drink", "Tech & Gadgets", "Travel", "Home & Family", "Finance", "Education", "Entertainment", "Gaming", "Other"] as const;
export type Niche = (typeof NICHES)[number];
