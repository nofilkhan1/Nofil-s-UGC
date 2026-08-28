"use client";

import { useActionState, useState } from "react";
import { applyToCampaignAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUnsavedChanges } from "@/components/use-unsaved-changes";
import { usePreserveFormOnError } from "@/components/use-preserve-form";

export function ApplicationForm({ campaignId }: { campaignId: string }) {
  const [state, action] = useActionState(applyToCampaignAction, initialActionState);
  const [pitchLength, setPitchLength] = useState(0);
  const { onChange } = useUnsavedChanges();
  const { formRef, onSubmit } = usePreserveFormOnError<HTMLFormElement>(state.status === "error");
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form ref={formRef} action={action} className="stack" noValidate onChange={onChange} onSubmit={onSubmit}>
    <input type="hidden" name="campaignId" value={campaignId} />
    {state.message ? <div className="notice notice--error" role="alert">{state.message}</div> : null}
    <div className="application-quote-grid"><FormField label="Your price per post" name="pricePerPost" type="number" inputMode="decimal" min="0.01" step="0.01" required error={error("pricePerPost")} /><SelectField name="currency" label="Currency" defaultValue="USD" options={["USD", "GBP", "EUR", "PKR"].map((value) => ({ value, label: value }))} required /></div>
    <TextAreaField label="Short note (optional)" name="note" maxLength={500} error={error("note")} hint="Add a concise idea or relevant experience. The quote is the only required application detail." />
    <div className="field">
      <label className="field__label" htmlFor="pitch">Why are you a good fit? (optional)</label>
      <textarea id="pitch" name="pitch" className="textarea resize-none" maxLength={300} rows={4} aria-invalid={error("pitch") ? "true" : undefined} aria-describedby={error("pitch") ? "pitch-error" : "pitch-hint pitch-count"} onChange={(event) => setPitchLength(event.currentTarget.value.length)} />
      {error("pitch") ? <span id="pitch-error" className="field__error" role="alert">{error("pitch")}</span> : <span id="pitch-hint" className="field__hint">Give the brand a short, specific reason you fit this brief.</span>}
      <span id="pitch-count" className="field__hint field__counter" aria-live="polite">{pitchLength}/300</span>
    </div>
    <SubmitButton>Apply with quote</SubmitButton>
  </form>;
}
