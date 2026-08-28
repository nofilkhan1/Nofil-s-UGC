import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignEditForm } from "@/components/campaign-edit-form";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Edit campaign" };

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireRole("brand");
  const { id } = await params;
  const { data } = await (await createClient()).from("campaigns").select("*").eq("id", id).eq("brand_id", viewer.user.id).single();
  if (!data) notFound();
  return <div className="stack" style={{ maxWidth: "52rem", gap: "1.5rem" }}><div><Link href={`/brand/campaigns/${id}`} className="muted">← Campaign detail</Link><p className="eyebrow" style={{ marginTop: "1rem" }}>Campaign brief</p><h1 className="page-title">Edit campaign</h1><p className="muted">Update the brief details without changing its current lifecycle status.</p></div><section className="panel"><CampaignEditForm campaign={data as Campaign} /></section></div>;
}
