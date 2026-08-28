import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: "primary" | "secondary" | "ghost" | "success" | "danger";
  busy?: boolean;
};

export function Button({ intent = "primary", busy = false, className, children, disabled, ...props }: Props) {
  return (
    <button
      className={clsx("button", `button--${intent}`, className)}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...props}
    >
      {busy ? <span className="button__spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
