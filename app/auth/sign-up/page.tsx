import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";

export const metadata = { title: "Create account" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole = role === "brand" ? "brand" : "creator";
  return <div className="auth-shell"><aside className="auth-aside"><BrandMark /><div><p className="eyebrow" style={{ color: "#a9a2ff" }}>Start with the simple workflow</p><h1 className="page-title">One brief. Clear quotes. A confident selection.</h1><p>Join as a brand or creator. Admin access is assigned securely by the platform owner.</p></div><Link href="/" className="button button--ghost" style={{ color: "white", justifySelf: "start" }}>← Back home</Link></aside><main className="auth-main"><div className="auth-card"><p className="eyebrow">Create your workspace</p><h1 className="page-title">Join CreatorDock</h1><p className="muted">Choose your side of the marketplace. You can complete creator links after signup.</p><AuthForm mode="sign-up" initialRole={initialRole} /></div></main></div>;
}
