import { Circle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "approved" || status === "live" ? "success" : status === "rejected" || status === "closed" ? "danger" : "warning";
  return <span className={`badge badge--${tone}`}><Circle size={8} fill="currentColor" aria-hidden="true" />{status.replaceAll("_", " ")}</span>;
}
