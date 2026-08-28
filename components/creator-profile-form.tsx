"use client";

import { useActionState } from "react";
import { updateCreatorProfileAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CreatorProfile, Profile } from "@/lib/types";

export function CreatorProfileForm({ profile, details }: { profile: Profile; details: CreatorProfile }) {
  const [state, action] = useActionState(updateCreatorProfileAction, initialActionState);
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form action={action} className="stack" noValidate>
    {state.message ? <div className={`notice notice--${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</div> : null}
    <FormField label="Public name" name="displayName" defaultValue={profile.display_name} required error={error("displayName")} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1rem" }}>
      <SelectField name="gender" label="Gender (optional)" defaultValue={details.gender ?? "prefer_not_to_say"} options={[{ value: "woman", label: "Woman" }, { value: "man", label: "Man" }, { value: "non_binary", label: "Non-binary" }, { value: "prefer_not_to_say", label: "Prefer not to say" }]} />
      <FormField label="Age (optional)" name="age" type="number" inputMode="numeric" min={18} max={100} defaultValue={details.age ?? ""} error={error("age")} />
    </div>
    <TextAreaField label="About your work" name="bio" maxLength={600} defaultValue={details.bio ?? ""} error={error("bio")} hint="Mention the niches, formats, or product categories that fit your style." />
    <FormField label="Portfolio URL" name="portfolioUrl" type="url" inputMode="url" defaultValue={details.portfolio_url ?? ""} error={error("portfolioUrl")} placeholder="https://…" />
    <FormField label="Instagram profile URL" name="instagramUrl" type="url" inputMode="url" defaultValue={details.instagram_url ?? ""} error={error("instagramUrl")} placeholder="https://instagram.com/…" />
    <FormField label="TikTok profile URL" name="tiktokUrl" type="url" inputMode="url" defaultValue={details.tiktok_url ?? ""} error={error("tiktokUrl")} placeholder="https://tiktok.com/@…" />
    <SubmitButton>Save profile</SubmitButton>
  </form>;
}
