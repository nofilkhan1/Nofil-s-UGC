"use client";

import { useActionState } from "react";
import { submitDeliverableAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/ui/submit-button";

export function DeliverableForm({ applicationId }: { applicationId: string }) {
  const [state, action] = useActionState(submitDeliverableAction, initialActionState);
  return <form action={action} className="stack" noValidate><input type="hidden" name="applicationId" value={applicationId} /><label className="field"><span className="field__label">Link to your posted content (Instagram/TikTok post URL)</span><input className="input" name="deliverableUrl" type="url" placeholder="https://…" required />{state.errors?.deliverableUrl?.[0] ? <span className="field__error" role="alert">{state.errors.deliverableUrl[0]}</span> : null}</label>{state.message ? <p className={state.status === "error" ? "field__error" : "field__hint"} role="status">{state.message}</p> : null}<SubmitButton>Submit deliverable</SubmitButton></form>;
}
