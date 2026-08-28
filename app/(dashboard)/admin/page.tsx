import { Activity, BriefcaseBusiness, ClipboardList, UsersRound } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Campaign, Profile } from "@/lib/types";

export const metadata = { title: "Admin overview" };

export default async function AdminPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const [profilesResult, campaignsResult, applicationsResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("campaigns").select("*, brand:profiles!campaigns_brand_id_fkey(display_name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("applications").select("id,status", { count: "exact" }).limit(50),
  ]);
  const profiles = (profilesResult.data ?? []) as Profile[];
  const campaigns = (campaignsResult.data ?? []) as Campaign[];
  const brands = profiles.filter((profile) => profile.role === "brand");
  const creators = profiles.filter((profile) => profile.role === "creator");
  const applications = applicationsResult.data ?? [];
  const hasError = profilesResult.error || campaignsResult.error || applicationsResult.error;
  const stats = [
    { label: "Brands", value: brands.length, icon: BriefcaseBusiness },
    { label: "Creators", value: creators.length, icon: UsersRound },
    { label: "Campaigns", value: campaigns.length, icon: ClipboardList },
    { label: "Applications", value: applicationsResult.count ?? applications.length, icon: Activity },
  ];
  return <div className="stack" style={{ gap: "2rem" }}><div><p className="eyebrow">Platform admin</p><h1 className="page-title">Marketplace overview</h1><p className="muted">See brands, creators, campaigns, and application activity. Role enforcement remains in Supabase RLS.</p></div>{hasError ? <div className="notice notice--error" role="alert">Some admin data could not be loaded. Refresh to retry.</div> : null}<section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem" }} aria-label="Marketplace totals">{stats.map(({ label, value, icon: Icon }) => <article className="panel" key={label}><Icon size={20} color="var(--color-primary)" aria-hidden="true" /><strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "2rem", marginTop: "0.7rem", fontVariantNumeric: "tabular-nums" }}>{value}</strong><span className="muted">{label}</span></article>)}</section><section><h2 className="section-title">People</h2><div className="data-table-wrap"><table className="data-table"><caption>Newest marketplace accounts (up to 50)</caption><thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Joined</th></tr></thead><tbody>{profiles.map((profile) => <tr key={profile.id}><td><strong>{profile.display_name}</strong></td><td><span className="badge">{profile.role}</span></td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(profile.created_at))}</td></tr>)}</tbody></table></div></section><section><h2 className="section-title">Campaigns</h2><div className="data-table-wrap"><table className="data-table"><caption>Recent campaigns (up to 50)</caption><thead><tr><th scope="col">Campaign</th><th scope="col">Brand</th><th scope="col">Platform</th><th scope="col">Status</th><th scope="col">Dates</th></tr></thead><tbody>{campaigns.map((campaign) => <tr key={campaign.id}><td><strong>{campaign.title}</strong></td><td>{campaign.brand?.display_name ?? "—"}</td><td>{campaign.platform}</td><td><StatusBadge status={campaign.status} /></td><td>{campaign.start_date} – {campaign.end_date}</td></tr>)}</tbody></table></div></section></div>;
}
