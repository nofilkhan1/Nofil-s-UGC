"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessageAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/ui/submit-button";

export function MessageComposer({ applicationId }: { applicationId: string }) {
  const [state, action] = useActionState(sendMessageAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.status === "success") formRef.current?.reset(); }, [state.status]);
  return <form ref={formRef} action={action} className="message-composer" noValidate><input type="hidden" name="applicationId" value={applicationId} /><textarea name="body" className="textarea" maxLength={2000} rows={3} placeholder="Write a message…" aria-label="Message" required />{state.message ? <p className={state.status === "error" ? "field__error" : "field__hint"} role="status">{state.message}</p> : null}<SubmitButton>Send message</SubmitButton></form>;
}
