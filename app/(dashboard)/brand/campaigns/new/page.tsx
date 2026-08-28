import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Create campaign" };

export default async function NewCampaignPage() {
  await requireRole("brand");
  return <div className="stack" style={{ maxWidth: "52rem", gap: "1.5rem" }}><div><Link href="/brand/campaigns" className="muted">← Campaigns</Link><p className="eyebrow" style={{ marginTop: "1rem" }}>New open call</p><h1 className="page-title">Create a campaign</h1><p className="muted">Save the brief as a draft, then publish it when it is ready for creators.</p></div><section className="panel"><CampaignForm /></section></div>;
}
