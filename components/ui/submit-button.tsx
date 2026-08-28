"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children, intent = "primary" }: { children: React.ReactNode; intent?: "primary" | "secondary" | "success" | "danger" }) {
  const { pending } = useFormStatus();
  return <Button type="submit" busy={pending} intent={intent}>{children}</Button>;
}
