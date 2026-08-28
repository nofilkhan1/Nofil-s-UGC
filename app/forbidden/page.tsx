import Link from "next/link";
export const metadata = { title: "Access denied" };
export default function ForbiddenPage() { return <main className="page-frame" style={{ paddingBlock: "6rem" }}><p className="eyebrow">403</p><h1 className="page-title">This workspace is not available to your role.</h1><p className="muted">Use your dashboard to return to the campaigns and tools available to you.</p><Link className="button button--primary" href="/dashboard">Go to dashboard</Link></main>; }
