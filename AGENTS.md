## Logging & Capture Rules

This repo has automatic prompt/response capture installed via Codex hooks
(`.codex/hooks/hooks.json` + `capture-agent-turn.ps1`). Logging itself is automatic —
you don't need to do anything to make it happen.

However, you MUST follow the behavioral rules in `CAPTURE-RULES.md` at all times:
- Never edit, tidy, summarize, or delete entries in `.agent-logs/`.
- Never add `.agent-logs/` to `.gitignore`.
- Commit `.agent-logs/` entries incrementally, alongside the code changes they
  correspond to — not in one batch at the end.

Read `CAPTURE-RULES.md` in full before making any commits that touch `.agent-logs/`
or `.gitignore`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
