import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";

export const metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <div className="auth-shell"><aside className="auth-aside"><BrandMark /><div><p className="eyebrow" style={{ color: "#a9a2ff" }}>Back to the casting desk</p><h1 className="page-title">Your campaigns and decisions are waiting.</h1><p>Sign in to pick up exactly where you left off.</p></div><Link href="/" className="button button--ghost" style={{ color: "white", justifySelf: "start" }}>← Back home</Link></aside><main className="auth-main"><div className="auth-card"><p className="eyebrow">Welcome back</p><h1 className="page-title">Sign in to CreatorDock</h1><p className="muted">Use the email and password connected to your workspace.</p><AuthForm mode="sign-in" callbackUrl={callbackUrl} /></div></main></div>;
}
