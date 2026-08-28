import Link from "next/link";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, message, action, href }: { title: string; message: string; action?: ReactNode; href?: string }) {
  return <div className="panel empty-state"><div><Inbox size={30} color="var(--color-primary)" aria-hidden="true" /><h2 className="section-title" style={{ marginTop: "0.8rem" }}>{title}</h2><p className="muted" style={{ maxWidth: "32rem" }}>{message}</p>{action ? href ? <Link className="button button--primary" href={href}>{action}</Link> : action : null}</div></div>;
}
