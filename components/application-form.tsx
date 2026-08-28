"use client";

import { useActionState } from "react";
import { applyToCampaignAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUnsavedChanges } from "@/components/use-unsaved-changes";

export function ApplicationForm({ campaignId }: { campaignId: string }) {
  const [state, action] = useActionState(applyToCampaignAction, initialActionState);
  const { onChange } = useUnsavedChanges();
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form action={action} className="stack" noValidate onChange={onChange}>
    <input type="hidden" name="campaignId" value={campaignId} />
    {state.message ? <div className="notice notice--error" role="alert">{state.message}</div> : null}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}><FormField label="Your price per post" name="pricePerPost" type="number" inputMode="decimal" min="0.01" step="0.01" required error={error("pricePerPost")} /><SelectField name="currency" label="Currency" defaultValue="USD" options={["USD", "GBP", "EUR", "PKR"].map((value) => ({ value, label: value }))} required /></div>
    <TextAreaField label="Short note (optional)" name="note" maxLength={500} error={error("note")} hint="Add a concise idea or relevant experience. The quote is the only required application detail." />
    <SubmitButton>Apply with quote</SubmitButton>
  </form>;
}
