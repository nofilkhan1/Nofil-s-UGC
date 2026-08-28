import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata = { title: "Admin overview" };

type AdminData = {
  brands: Array<{ id: string; company_name: string; email: string | null; campaign_count: number }>;
  creators: Array<{ id: string; public_name: string; email: string | null; application_count: number }>;
  campaigns: Array<{ id: string; title: string; brand_name: string; status: "draft" | "live" | "closed"; application_count: number }>;
};

export default async function AdminPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_overview");
  const overview = (data ?? { brands: [], creators: [], campaigns: [] }) as AdminData;
  return <div className="stack" style={{ gap: "2rem" }}>
    <div><p className="eyebrow">Platform admin</p><h1 className="page-title">Marketplace visibility</h1><p className="muted">Read-only snapshots of brands, creators, and campaign activity.</p></div>
    {error ? <div className="notice notice--error" role="alert">Admin data could not be loaded. Refresh to retry.</div> : null}
    <section><h2 className="section-title">All brands</h2><div className="data-table-wrap"><table className="data-table"><caption>Brand accounts and campaign totals</caption><thead><tr><th scope="col">Company name</th><th scope="col">Email</th><th scope="col">Campaigns</th></tr></thead><tbody>{overview.brands.map((brand) => <tr key={brand.id}><td><strong>{brand.company_name}</strong></td><td>{brand.email ?? "—"}</td><td>{brand.campaign_count}</td></tr>)}</tbody></table></div></section>
    <section><h2 className="section-title">All creators</h2><div className="data-table-wrap"><table className="data-table"><caption>Creator accounts and application totals</caption><thead><tr><th scope="col">Public name</th><th scope="col">Email</th><th scope="col">Applications</th></tr></thead><tbody>{overview.creators.map((creator) => <tr key={creator.id}><td><strong>{creator.public_name}</strong></td><td>{creator.email ?? "—"}</td><td>{creator.application_count}</td></tr>)}</tbody></table></div></section>
    <section><h2 className="section-title">All campaigns</h2><div className="data-table-wrap"><table className="data-table"><caption>Campaign status and application totals</caption><thead><tr><th scope="col">Title</th><th scope="col">Brand</th><th scope="col">Status</th><th scope="col">Applications</th></tr></thead><tbody>{overview.campaigns.map((campaign) => <tr key={campaign.id}><td><strong>{campaign.title}</strong></td><td>{campaign.brand_name}</td><td><StatusBadge status={campaign.status} /></td><td>{campaign.application_count}</td></tr>)}</tbody></table></div></section>
  </div>;
}
