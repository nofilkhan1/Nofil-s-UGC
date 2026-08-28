export function ListLoading({ label = "Loading list" }: { label?: string }) {
  return <div className="panel" style={{ minHeight: "14rem", display: "grid", placeItems: "center" }} role="status" aria-live="polite"><span className="button__spinner" aria-hidden="true" /><span className="sr-only">{label}</span></div>;
}
