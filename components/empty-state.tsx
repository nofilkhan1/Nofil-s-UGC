import Link from "next/link";
import { Inbox } from "lucide-react";

export function EmptyState({ title, message, action, href }: { title: string; message: string; action?: string; href?: string }) {
  return <div className="panel" style={{ minHeight: "14rem", display: "grid", placeItems: "center", textAlign: "center" }}><div><Inbox size={30} color="var(--color-primary)" aria-hidden="true" /><h2 className="section-title" style={{ marginTop: "0.8rem" }}>{title}</h2><p className="muted" style={{ maxWidth: "32rem" }}>{message}</p>{action && href ? <Link className="button button--primary" href={href}>{action}</Link> : null}</div></div>;
}
