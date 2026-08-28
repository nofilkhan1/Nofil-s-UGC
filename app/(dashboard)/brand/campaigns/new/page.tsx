import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Publish campaign" };

export default async function NewCampaignPage() {
  await requireRole("brand");
  return <div className="stack" style={{ maxWidth: "52rem", gap: "1.5rem" }}><div><Link href="/brand/campaigns" className="muted">← Campaigns</Link><p className="eyebrow" style={{ marginTop: "1rem" }}>New open call</p><h1 className="page-title">Publish a campaign</h1><p className="muted">Keep the brief specific. Creators will see every requirement before they quote.</p></div><section className="panel"><CampaignForm /></section></div>;
}
