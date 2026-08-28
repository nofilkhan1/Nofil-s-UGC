"use client";

import { useActionState } from "react";
import { updateCampaignAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import type { Campaign } from "@/lib/types";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { DateField } from "@/components/ui/date-field";
import { NichePicker } from "@/components/niche-picker";
import { SubmitButton } from "@/components/ui/submit-button";
import { usePreserveFormOnError } from "@/components/use-preserve-form";

export function CampaignEditForm({ campaign }: { campaign: Campaign }) {
  const [state, action] = useActionState(updateCampaignAction, initialActionState);
  const { formRef, onSubmit } = usePreserveFormOnError<HTMLFormElement>(state.status === "error");
  const fieldError = (name: string) => state.errors?.[name]?.[0];
  return <form ref={formRef} action={action} onSubmit={onSubmit} className="stack" style={{ gap: "1.2rem" }}>
    <input type="hidden" name="campaignId" value={campaign.id} />
    <FormField label="Campaign title" name="title" defaultValue={campaign.title} error={fieldError("title")} />
    <TextAreaField label="Campaign brief" name="description" defaultValue={campaign.description} error={fieldError("description")} />
    <NichePicker selected={campaign.niches ?? []} limit={3} error={fieldError("niches")} />
    <div className="form-grid"><SelectField label="Platform" name="platform" defaultValue={campaign.platform} options={[{ value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" }]} /><FormField label="Content format" name="contentFormat" defaultValue={campaign.content_format} error={fieldError("contentFormat")} /></div>
    <FormField label="Number of posts" name="postCount" type="number" min={1} defaultValue={campaign.post_count} error={fieldError("postCount")} />
    <div className="form-grid"><DateField label="Start date" name="startDate" defaultValue={campaign.start_date} hint={fieldError("startDate")} /><DateField label="End date" name="endDate" defaultValue={campaign.end_date} hint={fieldError("endDate")} /></div>
    {state.message ? <p className="notice notice--error" role="alert">{state.message}</p> : null}
    <SubmitButton>Save changes</SubmitButton>
  </form>;
}
