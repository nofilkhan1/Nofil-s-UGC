"use client";

import { useActionState } from "react";
import { decideApplicationAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/ui/submit-button";

export function DecisionForm({ applicationId }: { applicationId: string }) {
  const [state, action] = useActionState(decideApplicationAction, initialActionState);
  return <div className="stack" style={{ gap: "0.5rem" }}>{state.message ? <div className={`notice notice--${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</div> : null}<div className="cluster"><form action={action} noValidate><input type="hidden" name="applicationId" value={applicationId} /><input type="hidden" name="decision" value="approved" /><SubmitButton intent="success">Approve creator</SubmitButton></form><form action={action} noValidate><input type="hidden" name="applicationId" value={applicationId} /><input type="hidden" name="decision" value="rejected" /><SubmitButton intent="danger">Reject application</SubmitButton></form></div></div>;
}
