import type { ApplicationStatus } from "@/lib/types";

export function AppliedBadge({ status }: { status: ApplicationStatus }) {
  const tone = status === "approved" ? "success" : status === "rejected" ? "danger" : "warning";
  return <span className={`badge badge--${tone}`} role="status">Applied · {status}</span>;
}
