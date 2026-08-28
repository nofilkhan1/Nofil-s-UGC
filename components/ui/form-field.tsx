import { clsx } from "clsx";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
};

export function FormField({ label, name, hint, error, className, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const descriptionId = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className={clsx("input", className)} aria-invalid={error ? "true" : undefined} aria-describedby={descriptionId} {...props} />
      {error ? <span id={`${name}-error`} className="field__error" role="alert">{error}</span> : <span id={`${name}-hint`} className="field__hint">{hint ?? " "}</span>}
    </div>
  );
}

export function TextAreaField({ label, name, hint, error, className, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const descriptionId = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} className={clsx("textarea resize-none", className)} aria-invalid={error ? "true" : undefined} aria-describedby={descriptionId} {...props} />
      {error ? <span id={`${name}-error`} className="field__error" role="alert">{error}</span> : <span id={`${name}-hint`} className="field__hint">{hint ?? " "}</span>}
    </div>
  );
}
