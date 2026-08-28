# Agent Capture Rules (8x Assignment)

This file is a standing reference for how prompt/response logging must work in this
repo. It summarizes the setup already installed via `.codex/hooks/hooks.json` and
`.codex/hooks/capture-agent-turn.ps1`. It does not need to be re-read by a human each
time — it's here so the logging behavior and its rationale are documented alongside
the code, and so anyone (including a future agent session) can see what's expected.

## What's already automatic

The hook is installed and trusted. It fires on:
- `UserPromptSubmit` — every prompt you send
- `Stop` — every time the agent finishes a turn

It writes each prompt and its final response to one new exchange file:
`.agent-logs/<timestamp>_exchange_<session-id>.md`. The prompt is written when it
is submitted; its final response is appended to the same file. A later prompt always
gets a new file. **You do not need to manually copy/paste prompts or responses
anywhere — the hook does this.**

## What must NOT happen

- `.agent-logs/` must never be added to `.gitignore`.
- Log entries must never be edited, tidied, summarized, or deleted after the fact.
- Logs must be committed incrementally, interleaved with the commits they correspond
  to — not batched at the end.

## Format (already produced by the hook)

Each exchange file has YAML frontmatter (`event_type`, `session_id`, `date`,
`author`, `model`, `tool`, `project`, `total_entries`, and `first_prompt_time`),
followed by a `[LOG_ENTRY type=PROMPT ...]` block and its matching
`[LOG_ENTRY type=RESPONSE ...]` block, each with a timestamp and model name.

## Verification already done

- Canary test run across two sessions, both landed in `.agent-logs/`.
- `CAPTURE-TEST.md` documents the setup, mechanism, config file changed, log path,
  and both raw canary entries.

## Source

Full original instructions: https://8x-internal.com/p/8x-agent-capture-setup
