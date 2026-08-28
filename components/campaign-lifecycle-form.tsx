"use client";
import { useActionState } from "react";
import { updateCampaignStatusAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/ui/submit-button";
export function CampaignLifecycleForm({ campaignId, status }: { campaignId: string; status: "draft" | "live" }) { const [state, action] = useActionState(updateCampaignStatusAction, initialActionState); const next = status === "draft" ? "live" : "closed"; return <form action={action} className="cluster" noValidate><input type="hidden" name="campaignId" value={campaignId} /><input type="hidden" name="status" value={next} />{state.message ? <span className={`notice notice--${state.status}`} role="status">{state.message}</span> : null}<SubmitButton intent={next === "live" ? "success" : "danger"}>{next === "live" ? "Publish" : "Close"}</SubmitButton></form>; }
