import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/0001_initial.sql", "utf8");

describe("database workflow contract", () => {
  it("forces public signup roles to brand or creator", () => {
    expect(migration).toContain("Admin is never accepted from signup metadata");
    expect(migration).toContain("when new.raw_user_meta_data ->> 'role' = 'brand'");
  });

  it("uses a server-side decision function and notification trigger", () => {
    expect(migration).toContain("function public.decide_application");
    expect(migration).toContain("applications_notify_decision");
    expect(migration).not.toContain("Creator approved and notified");
    expect(migration).toContain("You were selected");
  });

  it("prevents duplicate creator applications", () => {
    expect(migration).toContain("unique (campaign_id, creator_id)");
  });
});
