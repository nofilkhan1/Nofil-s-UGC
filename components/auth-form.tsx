"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";

type Mode = "sign-in" | "sign-up";

export function AuthForm({ mode, initialRole = "creator", callbackUrl = "/dashboard" }: { mode: Mode; initialRole?: "brand" | "creator"; callbackUrl?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "sign-in") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) { setError("Email or password is incorrect. Check both fields and try again."); return; }
        router.replace(callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard");
        router.refresh();
      } else {
        const parsed = signupSchema.safeParse({ name: form.get("name"), email, password, role: form.get("role") });
        if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check the highlighted information."); return; }
        const { data, error: authError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { data: { display_name: parsed.data.name, role: parsed.data.role } },
        });
        if (authError) { setError(authError.message.includes("registered") ? "An account already uses this email. Sign in instead." : "We could not create the account. Check your details and try again."); return; }
        if (!data.session) { setSuccess("Check your email to confirm your account, then return here to sign in."); return; }
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "CreatorDock could not connect. Check your setup and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="stack" noValidate onSubmit={handleSubmit}>
      {error ? <div className="notice notice--error" role="alert">{error}</div> : null}
      {success ? <div className="notice notice--success" role="status">{success}</div> : null}
      {mode === "sign-up" ? <><FormField label="Name or company name" name="name" autoComplete="name" required hint="Creators can use their public name; brands can use the company name." /><SelectField name="role" label="I am joining as" defaultValue={initialRole} options={[{ value: "creator", label: "Creator — find and apply to campaigns" }, { value: "brand", label: "Brand — publish campaigns and select creators" }]} required /></> : null}
      <FormField label="Email address" name="email" type="email" autoComplete="email" required />
      <div className="field">
        <label className="field__label" htmlFor="password">Password</label>
        <div className="password-wrap">
          <input className="input" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "sign-up" ? "new-password" : "current-password"} required minLength={8} aria-describedby="password-hint" />
          <button className="password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <><EyeOff size={16} aria-hidden="true" /> Hide</> : <><Eye size={16} aria-hidden="true" /> Show</>}</button>
        </div>
        <span id="password-hint" className="field__hint">{mode === "sign-up" ? "Use at least 8 characters." : " "}</span>
      </div>
      <Button type="submit" busy={busy}>{mode === "sign-up" ? "Create account" : "Sign in"}</Button>
      <p className="muted" style={{ textAlign: "center" }}>{mode === "sign-up" ? <>Already have an account? <Link href="/auth/sign-in" style={{ color: "var(--color-primary-dark)", fontWeight: 750 }}>Sign in</Link></> : <>New to CreatorDock? <Link href="/auth/sign-up" style={{ color: "var(--color-primary-dark)", fontWeight: 750 }}>Create an account</Link></>}</p>
    </form>
  );
}
