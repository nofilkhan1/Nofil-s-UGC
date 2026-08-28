# CreatorDock UX Contract

## Product context

- Audience: Brand teams, UGC creators, and platform administrators.
- Primary jobs: Publish campaigns, apply with a per-post quote, review applicants, communicate decisions, and oversee marketplace activity.
- Target markets: Global English-speaking MVP.
- Active locales: `en`.
- Language/content register and native-review policy: Plain operational English; product owner review before launch.
- Timezone/calendar policy: Campaign start/end are inclusive date-only ISO values; display in the viewer's locale without timezone conversion.
- Accessibility target: WCAG 2.2 AA.

## Business-context sources

| Domain / scope | Authoritative source | Source type | Reviewed date |
|---|---|---|---|
| Permission model | Current product brief in the initiating user request; `supabase/migrations/0001_initial.sql` implements it | Product brief + database policy | 2026-08-28 |
| Data lifecycle | Current product brief; `supabase/migrations/0001_initial.sql` | Product brief + database contract | 2026-08-28 |
| Deletion / retention | Deferred: MVP exposes no deletion UI | Product decision | 2026-08-28 |
| Billing / payment | Out of scope: quotes are proposals only | Product brief | 2026-08-28 |
| Legal / regulatory copy | Deferred; no legal claims beyond ordinary product copy | Product decision | 2026-08-28 |
| Market / content conventions | Current product brief; SideShift public site as inspiration only | Product brief + comparable product | 2026-08-28 |

## Visual contract

- Project `DESIGN.md`: `DESIGN.md`.
- Token ownership model: `DESIGN.md` is the accepted source mirrored into runtime CSS.
- Runtime design-system/token source: `app/globals.css`.
- Mapping/export/adapters: CSS custom properties consumed by `components/ui/*`.
- Token drift gate: DESIGN lint, premium audit, and `scripts/verify-ui.mjs`.
- Supported themes: Light only for MVP; forced-colors remains system-operable.
- Design-context owner/review policy: Update `DESIGN.md` and runtime tokens in the same change.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | `components/ui/select.tsx` (Radix) | DESIGN + this contract | authored | keyboard + open popup browser check |
| Date | `components/ui/date-field.tsx` | this contract | typed ISO date-only | validation + E2E |
| Form | `components/ui/form-field.tsx` + Zod server/client schemas | this contract | create / apply / auth / profile | validation tests + E2E |
| Scrollbar | `app/globals.css` | DESIGN | stable-gutter geometry exception | computed-style browser check |
| Toast | `components/ui/toast.tsx` | this contract | success / info / error | live-region test |
| CRUD | Server actions + owning route | this contract | return / stay | full-flow E2E |

## Component behavior

| Component | Default | Hover | Focus | Active | Disabled | Busy | Error |
|---|---|---|---|---|---|---|---|
| Button | clear label | tonal change | visible 3px ring | 1px translate | non-pointer | stable spinner | persistent nearby |
| Icon button | accessible name | tonal change | visible ring | pressed tone | non-pointer | stable slot | persistent nearby |
| Input | 2px border | darkened border | focus ring | n/a | muted | stable adornment | text + aria link |
| Secret input | masked | as input | as input/toggle | toggle pressed | muted | stable | generic auth banner |
| Search | clear + local URL state | tonal clear action | visible ring | immediate clear | n/a | reserved slot | result region |
| Textarea | resize none | darkened border | visible ring | n/a | muted | stable | text + aria link |
| Table/list | bounded results | row tint | action focus | selected/current label | explained | stable loader | retry panel |

## Dataset navigation

- Admin tables: Render all for MVP because the dataset is intentionally bounded during validation; introduce server pagination before production scale.
- Exploratory lists: Explicit “Load more” is the future large-dataset path; MVP renders the bounded campaign query.
- URL state: Platform and status filters use URL search parameters.
- Page size: MVP query cap 50; production server pagination is the next scaling gate.
- Empty/no-results/error/loading treatment: Distinct empty, no-results, persistent error/retry, and stable spinner states.
- Back/scroll restoration: Route/URL owns list state; browser Back restores it.
- Selection scope: Not applicable; applicant decisions are per record.

## Flow ledger

| Operation | Trigger | Pending | Success destination | Success feedback | Failure recovery | Focus outcome | Source ref |
|---|---|---|---|---|---|---|---|
| Create campaign | Publish campaign | stable busy button | brand campaign detail | “Campaign published” toast/status | preserve values + summary/inline errors | detail heading | Product brief |
| Update profile | Save profile | stable busy button | stay on profile | “Profile saved” | preserve values + summary/inline errors | page heading | Product brief |
| Apply | Apply with quote | stable busy button | creator applications | “Application sent” | preserve quote + inline error | applications heading | Product brief |
| Approve/reject | Approve / Reject | row action busy | stay on campaign | decision toast + updated status | row error + retry | updated applicant card | Product brief |
| Search/filter | Platform/status control | stable list loading | same URL route | result count | clear/reset filter | filter control | Product brief |
| Cancel/back | Cancel / Back | none | owning list/detail | none | unsaved browser warning where applicable | origin context | Premium default |

## Navigation and responsive behavior

- Route document title policy: `{Page} — CreatorDock`; titles contain no sensitive information.
- Route error / 403 page behavior: Dedicated app-owned 403, 404, and route error screens with a link to an allowed dashboard.
- Breadcrumb/tab/route-state policy: Routes are independently meaningful; use links, not tabs.
- Sidebar/drawer/bottom-sheet transformation: Desktop side navigation becomes a top horizontal navigation strip on narrow screens.
- Responsive table strategy: Horizontal scroll for admin comparison tables; creator/brand operational records use stacked cards.
- Truncation/full-value access: Primary values wrap; portfolio URLs are linked and may visually truncate while retaining accessible full href.
- Focus restoration and sticky-obstruction policy: `scroll-margin-top` on headings/fields; sticky bars never cover focused controls.

## Overlays and feedback

- Dialog primitive: Deferred until a destructive or modal workflow is introduced.
- Destructive confirmation levels: No deletion in MVP. Application rejection is a business decision, not record deletion, and is committed directly with explicit label.
- Toast placement/duration/deduplication: Shared top-right viewport; 5 seconds; identical messages deduplicate.
- Alert/banner scope and persistence: Form errors persist until correction; infrastructure/setup issues use page banners.
- Tooltip delay/dismissal: Only supplemental icon help; keyboard focus and Escape supported when introduced.
- Unsaved-changes behavior: Browser `beforeunload` on dirty create/profile/application forms; in-app navigation guard is deferred until Next exposes a stable blocker.
- Layer/z-index contract: navigation 20, authored select 40, toast 60.

## Async and resilience

- Mutation default: Pessimistic. UI changes only after Supabase confirmation.
- Idempotency and duplicate-submit policy: Disable/busy per action; database uniqueness prevents duplicate applications.
- Auto-save/draft recovery: None for MVP.
- Offline/read-stale/write behavior: Preserve entered form state, show actionable failure, allow retry.
- Retry/backoff/timeout behavior: User-triggered retry; no automatic mutation retry.
- Version conflict and multi-tab behavior: Database constraints and row status preconditions prevent duplicate decisions; refresh after mutation.
- Session expiry/re-authentication: Redirect to sign-in with callback URL; safe non-sensitive drafts remain only in the current page memory.
- Long-running progress and return path: Not applicable.
- Stale-request cancellation/invalidation and pending-state ownership: Server actions own mutation pending; URL navigation replaces list requests.
- Dialog/form preservation and retry after mutation failure: Forms remain mounted with values and inline/server summary.

## Validation

- Schema/validation layer: Zod schemas shared by server actions and client forms where needed.
- Trigger timing: Submit first, then correction on change for invalid fields.
- Error summary/inline policy: Short forms use inline plus form banner for server failures; first invalid field receives focus.
- Server error mapping: Known constraint/validation errors map to fields; unknown errors become safe form messages.
- Sensitive-value handling: Passwords are never logged or returned; password field is masked with accessible reveal.
- All product forms use `noValidate`, block duplicate submits, preserve safe values after failure, and focus the first invalid field.

## Permission and clipboard

- Permission UI strategy: Irrelevant role navigation is hidden; forbidden direct navigation receives 403; server/RLS is authoritative.
- Clipboard copy policy: Not applicable to MVP.
- Disabled-state explanation: Controls disabled by record status include visible explanatory text.

## Verification

- Required static commands: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run verify:premium`, premium strict audit.
- Browser/device/locale/theme matrix: Chromium desktop and 390px mobile; English/light; reduced motion.
- Accessibility checks: semantic/unit tests plus keyboard browser pass.
- Native-language/domain review and target-user evidence: Product owner review before launch.
- Component-state/visual regression coverage: Key forms, campaign card, empty state, status badge.
- Canonical sibling flow used for comparison: Brand create and creator apply share form behavior; campaign/applications lists share state treatment.
- CRUD full-flow evidence: `tests/workflows.test.ts` and browser pass when Supabase credentials are supplied.
- Failure-path evidence: validation/auth tests and form server-error rendering.
