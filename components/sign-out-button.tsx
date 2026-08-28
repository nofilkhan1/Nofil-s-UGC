"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return <Button intent="ghost" busy={busy} onClick={async () => { setBusy(true); await createClient().auth.signOut(); router.replace("/"); router.refresh(); }}><LogOut size={16} aria-hidden="true" /> Sign out</Button>;
}
