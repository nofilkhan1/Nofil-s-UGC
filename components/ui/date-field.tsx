import type { InputHTMLAttributes } from "react";

export function DateField({ name, label, hint, ...props }: { name: string; label: string; hint?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>{label}</label>
      <input className="input" id={name} name={name} type="text" inputMode="numeric" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" aria-describedby={`${name}-hint`} {...props} />
      <span id={`${name}-hint`} className="field__hint">{hint ?? "Use YYYY-MM-DD."}</span>
    </div>
  );
}
