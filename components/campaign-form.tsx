"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { createCampaignAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { DateField } from "@/components/ui/date-field";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUnsavedChanges } from "@/components/use-unsaved-changes";
import { NichePicker } from "@/components/niche-picker";

export function CampaignForm() {
  const [state, action] = useActionState(createCampaignAction, initialActionState);
  const { onChange } = useUnsavedChanges();
  useEffect(() => { if (state.status === "error") document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(); }, [state]);
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form action={action} className="stack" noValidate onChange={onChange}>
    {state.message ? <div className={`notice notice--${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</div> : null}
    <FormField label="Campaign title" name="title" required maxLength={100} error={error("title")} hint="Use a specific working title creators can recognize." />
    <TextAreaField label="Campaign brief" name="description" required maxLength={3000} error={error("description")} hint="Describe the product, content angle, required talking points, and what success looks like." />
    <NichePicker limit={3} error={error("niches")} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1rem" }}>
      <SelectField name="platform" label="Platform" defaultValue="instagram" options={[{ value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" }]} required />
      <FormField label="Content format" name="contentFormat" required maxLength={80} placeholder="Reel, carousel, TikTok video…" error={error("contentFormat")} />
      <FormField label="Number of posts" name="postCount" type="number" inputMode="numeric" min={1} max={100} defaultValue={1} required error={error("postCount")} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1rem" }}><DateField name="startDate" label="Start date" required aria-invalid={error("startDate") ? "true" : undefined} /><DateField name="endDate" label="End date" required aria-invalid={error("endDate") ? "true" : undefined} /></div>
    {error("endDate") ? <p className="field__error" role="alert">{error("endDate")}</p> : null}
    <div className="cluster"><SubmitButton>Publish campaign</SubmitButton><Link href="/brand/campaigns" className="button button--ghost">Cancel</Link></div>
  </form>;
}
