import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/0001_initial.sql", "utf8");
const notificationMigration = readFileSync("supabase/migrations/0002_application_decision_notifications.sql", "utf8");
const lifecycleMigration = readFileSync("supabase/migrations/0004_campaign_lifecycle.sql", "utf8");
const profileAndPitchMigration = readFileSync("supabase/migrations/0006_creator_handles_and_application_pitch.sql", "utf8");

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

  it("records decision notifications with their application and unread state", () => {
    expect(notificationMigration).toContain("related_application_id uuid references public.applications(id)");
    expect(notificationMigration).toContain("is_read boolean not null default false");
    expect(notificationMigration).toContain("'application_approved'");
    expect(notificationMigration).toContain("'application_rejected'");
    expect(notificationMigration).toContain("was approved!");
    expect(notificationMigration).toContain("was not selected this time.");
  });

  it("enforces draft, live, and closed campaign lifecycle rules in the database", () => {
    expect(lifecycleMigration).toContain("rename value 'published' to 'live'");
    expect(lifecycleMigration).toContain("alter column status set default 'draft'");
    expect(lifecycleMigration).toContain("status = 'live'");
    expect(lifecycleMigration).toContain("Creators apply to live campaigns");
  });

  it("stores optional social handles and a short application pitch", () => {
    expect(profileAndPitchMigration).toContain("add column instagram_handle text");
    expect(profileAndPitchMigration).toContain("add column tiktok_handle text");
    expect(profileAndPitchMigration).toContain("add column pitch text");
    expect(profileAndPitchMigration).toContain("char_length(pitch) <= 300");
  });
});
