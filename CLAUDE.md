# CLAUDE.md

Guidance for working in this repository. **Keep this file current**: update the page status table and any changed conventions every time a page is built.

## 1. Project purpose

An interactive **AI Product Management case study** (a proof of work). It shows how a Technical Product Manager would approach an enterprise AI product for document-heavy professional workflows, specifically patent / IP work.

It should demonstrate: product thinking, customer/problem understanding, LLM/RAG understanding, agentic workflows, AI evaluation, human-in-the-loop validation, enterprise workflow design, technical architecture understanding, prioritisation, and metrics.

**This is a proposed concept, not a real product.** Never present the workflows, architecture, metrics, APIs, data or behaviour as any company's internal implementation. Label invented content (see rules, section 9). The company name is deliberately **not** used anywhere in the UI.

## 2. Product concept

Working title: **Evidence-Grounded IP Assistant** (single constant: `SITE.conceptName` in `src/content/site.ts`).

A professional works with complex patent/IP documents, retrieves relevant information, gets an AI-assisted draft, inspects the supporting evidence, and an expert reviews and approves, edits or rejects the result. Guiding principle:

> AI should assist the professional, not blindly replace expert judgment.

Core story (also `CORE_STORY` in `src/content/site.ts`, shown on Home):

documents → retrieval & understanding → RAG → reasoning / agentic workflow → structured draft → evidence & citations → **expert review** → **approve / edit / reject** → feedback & continuous improvement

High-stakes emphasis: accuracy, grounding, explainability, evidence, human validation, guardrails, evaluation, traceability. Every technical component must have a clear **product reason**. Do not add technical concepts to look complex.

## 3. Pages and routes

Single source of truth: `SECTIONS` in `src/content/site.ts`. Header nav, Home index cards and the prev/next pager are generated from it. To add or reorder a page, edit that array and `src/app/router.tsx`.

| Route | Page | File | Status |
|---|---|---|---|
| `/` | Home: hero, core story, section index | `src/pages/Home.tsx` | Provisional (functional, may be redesigned on request) |
| `/problem` | 01 Understanding the Problem | `src/pages/Problem.tsx` (content: `src/content/problem.ts`) | **Done** |
| `/ai-opportunity` | 02 AI Product Opportunity | `src/pages/AiOpportunity.tsx` (content: `src/content/aiOpportunity.ts`) | **Done** |
| `/prototype` | 03 Interactive AI Product Experience | `src/pages/Prototype.tsx` (content: `src/prototype/content.ts`) | **Done** |
| `/evaluation` | 04 Evaluation & Safety | `src/pages/Evaluation.tsx` (content: `src/content/evaluation.ts`) | **Done** |
| `/tpm-thinking` | 05 TPM Thinking | `src/pages/TpmThinking.tsx` (content: `src/content/tpmThinking.ts`) | **Done** |
| `*` | Not found | `src/pages/NotFound.tsx` | Done |

**All five conceptual pages are now built.** `/tpm-thinking` is the last one - it's the case study's closing page (its `PagePager` correctly shows no "next" card). Don't add a Page 6 or further sections unless explicitly asked.

**Page 1 (`/problem`) decisions worth remembering:** it uses the framing *Primary User -> Current Workflow -> Pain Points paired with AI Opportunities*. The pain points and opportunities are **proposed framing, not research** (each card is tagged `Proposed`), pairs are 1:1 by construction (`PainOpportunityPair`), and one-line descriptions are qualitative with no statistics (a test asserts no `%`/`Nx` figures appear). The reference image's hero photo and its attributed customer quote were **deliberately not reproduced** (no stock imagery; a quote from "Patent Attorney" would read as real customer research). The hero uses a line-art SVG instead.

**Page 2 (`/ai-opportunity`) decisions worth remembering:** framing is *The opportunity (existing → AI-assisted workflow) → AI Capabilities → How the system works → Why this approach → Product principle*. The five workflow-evolution stages, the five capability cards and the mapping index all share one array (`STAGES` in `aiOpportunity.ts`) so hovering or focusing either side highlights its counterpart by shared index — never the only way to see the pairing, since existing/proposed sit in the same column regardless of hover, and each capability's short description already names what it does. Two deliberate departures from the source brief, both because of standing project rules: **only the single burgundy accent is used** (the brief said "burgundy/indigo," but this project has one accent, and no neon purple/blue), and **the footer note says "any company's internal architecture," not a named company** (the company name never appears in the UI - see section 8).

**Page 3 (`/prototype`) decisions worth remembering:** this is the first page built on the prototype state architecture (section 7), replacing the initial-setup scaffold. It's one **persistent workspace** whose panels populate progressively from `state.step`/`pipeline.status`/`review.decision`, not a step-wizard switching screens - `WorkflowStepper` and `GO_TO_STEP` are deliberately **not** used here (see section 7 for why). The document viewer, evidence list and citation chips in the draft all set the same `activeSourceId`, so clicking any of the three opens the source drawer scoped to that source - the concrete demonstration of "grounded AI." Three departures from the source brief: **in-app product name** is `${SITE.shortName} Workspace` ("IP Assistant Workspace"), not the brief's "Clair Workspace" (too close to the real company name this project keeps out of the UI); the **illustrative quality panel** ("Groundedness 92%," etc.) uses real numbers precisely because the *original* setup brief allows illustrative numbers when clearly labelled - this doesn't reopen `reducer.ts`'s per-item qualitative `Level` type, which is a separate, real piece of state and stays qualitative; **Save/Export are real buttons with an honest inline acknowledgement** ("Saved (illustrative...)"), since nothing in the reducer models persistence or export and pretending otherwise would be dishonest.

**Page 4 (`/evaluation`) decisions worth remembering:** the failure-mode <-> guardrail "hover the corresponding one" interaction is **explicitly many-to-many, not a forced 1:1 index pairing** like Page 2's `WorkflowEvolution`<->`CapabilityGrid`. Working through the brief's actual content, two failures genuinely share one guardrail (source grounding), one failure has no guardrail at all (it's caught by human review instead - Section 3's topic, not a Section 4 guardrail), and one guardrail (data isolation) matches no listed failure. Each `FailureMode` carries `relatedGuardrailIds: string[]` (possibly empty); the page computes a `Set` of highlighted ids in each direction from one shared `hoveredId` state, rather than assuming symmetry. Every relation is also stated as visible text ("Guardrail: …", or "Caught by expert review…" when empty) - never hover-only. This page also reuses Page 1's accent-for-risk/success-for-validated tint convention (failure text = accent, expected behaviour = success) per the brief's explicit "burgundy for risk/failure, restrained green for positive/validated" instruction, and reuses the `Actor`/`ACTOR_TONE` vocabulary from Home for all three of its `FlowDiagram` usages (the 4-stage framework, the human-in-the-loop flow, the improvement loop). The metric grid's stat values are set in the **sans face** (not the page's serif), per the `dataviz` skill's figure spec - a large standalone numeric value in a display/serif face reads as decoration, not data; load that skill before touching `MetricGrid`.

**Page 5 (`/tpm-thinking`) decisions worth remembering:** it reuses almost entirely existing pieces (`IconList` for the MVP/Later scope checklists and the 4 prioritization criteria, `Badge` for the worked prioritization examples, `FlowDiagram` for the 4-step validation loop, `Callout` for the usage-isn't-value caveat) plus one new component, `RiskList`. Two components that looked reusable at a glance were deliberately **not** reused, for the same reason Pages 2 and 4 each built fresh rather than retrofit a shipped page's component: `PairedCards` needs a true 1:1 row correspondence, and the MVP (7 items) / Later (5 items) lists aren't paired by position at all - two independent `Card`+`IconList` panels instead; `FailureModeList` looked structurally close to risk->mitigation, but its "no relation" fallback text is Page-4-specific wording with nothing to plug in here - `RiskList` is the same visual idiom (accent risk, success mitigation, arrow between) without the relation/highlight machinery. **`RiskList`'s hover/focus tint is pure CSS** (Tailwind `hover:`/`focus-visible:` utilities directly on the row, no `group`, no React state, no `data-active`) - both risk and mitigation are always visible (never hidden behind hover, and hover is unreliable on touch anyway), so there's nothing for a hover interaction to gate; this also means the interaction **cannot be meaningfully unit-tested in jsdom** (no DOM/attribute change to assert, and jsdom doesn't load the compiled Tailwind CSS) - it was verified with a real headless-Chrome `getComputedStyle` check instead of a jsdom test. Section 6's closing statement reuses `StatementBanner`'s **visual idiom** (dark `bg-ink` block, serif, accent-soft italic emphasis) but is composed inline rather than through that component, because the content's rhetorical shape - a de-emphasized discouraged question contrasted with a large emphasized encouraged one - doesn't fit `StatementBanner`'s two-equal-lines contract; `StatementBanner` itself is untouched.

Placeholders render `PlaceholderPage` (title, core question, the 7 product questions, pager). Replace a placeholder by building the real page and no longer using `PlaceholderPage` for it.

## 4. Design system

Tokens live in **one place**: the `@theme` block in `src/styles/index.css`. Components use them through Tailwind utilities (`bg-canvas`, `text-ink-muted`, `border-border`, `text-h2`, `shadow-card`, `max-w-page`, `ease-soft`). **Never hardcode hex values or arbitrary px in components.**

- **Feel:** premium, modern, enterprise AI, minimal, clean. Whitespace, hairline borders, cards, diagrams. Avoid generic SaaS dashboards, gradients, heavy animation, walls of text, stock imagery, robot visuals.
- **Theme:** light, warm ivory. `canvas` (page) → `surface` (cards) → `surface-subtle` / `surface-sunken`. Dark theme is stubbed in a comment, not active. (Retuned when Page 1 landed, to match the editorial reference: ivory canvas, deep-navy ink, muted-burgundy accent. It is one shared look; do not scope colors to a single page.)
- **Color:** ink (`ink`, `ink-muted`, `ink-subtle`, deep navy) + **one accent** (`accent`, `accent-strong`, `accent-soft`, `accent-border`, muted burgundy). All text pairs were checked at ≥ 4.5:1 (WCAG AA); re-check if you change a token. `danger` is deliberately red-orange so a Reject/error red is never confused with the burgundy accent. Semantic tones (`success`, `warning`, `danger`, `info`, each with `-soft` and `-border`) are reserved for status and review outcomes. Do not decorate with them. One deliberate exception: on Page 1 the *problem* card uses the accent tint and the *opportunity* card uses the `success` tint (sage), to say "problem -> solution".
- **Type:** Source Serif 4 Variable for headings (`font-serif`; applied automatically to `h1`-`h3`, add `font-serif` explicitly on a non-heading element styled as a heading), Inter Variable for UI and body, JetBrains Mono Variable (`font-mono`: ids, citations, numbering). **Editorial emphasis:** wrap one word of a heading in `<em>` and it renders as an accent-colored italic (e.g. `1. Understanding the <em>Problem</em>`). Use it once per page title at most. Scale utilities: `text-display`, `text-h1` (up to 52px), `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small`, `text-caption`, `text-overline` (use with `uppercase`). Headline sizes are fluid.
- **Shape/elevation:** radii `sm`-`2xl` (cards use `rounded-xl`); `shadow-card` for resting, `shadow-raised` for hover. Hairlines are the main structure device.
- **Layout:** `Container` (`max-w-page` = 72rem, 20px/32px gutters), `Section` (vertical rhythm `py-12 md:py-20`, optional `tone="subtle"` band). Breakpoints are Tailwind defaults; header switches to a menu below `lg`; the current page is marked with a 2px accent underline (desktop) or a soft accent fill (mobile menu).
- **Motion:** CSS transitions only, subtle (150-200ms, `ease-soft`). Entrance: `animate-rise` (fade + 8px rise, 500ms) with an inline `animationDelay` to stagger blocks top to bottom (`PageHeader` already applies it). Reduced-motion zeroes duration and delay. `prefers-reduced-motion` is honoured globally. No animation library.
- **Focus:** one global `:focus-visible` ring. Keep it.
- **Class merging:** use `cn()` from `src/lib/cn.ts`. It is configured for our custom token names; **if you add a token to `@theme` (font size, shadow, container), add it to the lists in `cn.ts`** or `tailwind-merge` will silently drop classes. `cn.test.ts` guards this.

## 5. Technical architecture

Vite + React 19 + TypeScript (strict) + Tailwind v4 + React Router 7 (data router) + lucide-react icons. Static SPA, no backend, no external AI API. Linting is **oxlint** (from the Vite template), tests are **Vitest + Testing Library**.

```
src/
  main.tsx                 entry (StrictMode + RouterProvider)
  app/                     router.tsx (route table), AppLayout.tsx (shell), RouteFallback.tsx
  pages/                   one file per route; RouteError.tsx (error boundary)
  content/                 site.ts (SITE, SECTIONS, CORE_STORY, PRODUCT_QUESTIONS); problem.ts (Page 1); aiOpportunity.ts (Page 2); evaluation.ts (Page 4); tpmThinking.ts (Page 5). Each page's content goes in its own file here, typed, with lucide icons referenced from the data
  components/
    ui/                    primitives (below)
    layout/                page structure (below)
    case-study/            case-study-specific pieces (below)
  prototype/               all prototype logic, state and mock data (section 7)
  lib/cn.ts                class merging
  styles/index.css         design tokens + base styles
  test/setup.ts            Vitest setup
```

- Path alias `@/` → `src/`.
- Routes are code-split with route-level `lazy` (the pathless child route holds the `ErrorBoundary`, so nav/footer survive errors). Home is eager.
- `AppLayout` provides the skip link, `<main id="main" tabIndex={-1}>`, focus-to-main after client-side navigation, `ScrollRestoration`, and mounts `PrototypeProvider`.
- Document titles use React 19's `<title>` in components; build them with `pageTitle()`.
- **Deployment:** Vercel, configured in `vercel.json` (Vite preset, `dist` output, and a catch-all rewrite to `index.html` so deep links like `/problem` survive a refresh). `package.json` pins `engines.node` to `22.x` (Vite 8 needs Node 20.19+ / 22.12+). Any other static host needs the same SPA rewrite.
- Commands: `npm run dev`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## 6. Reusable components

**`components/ui/`**: `Button` (variants `primary|accent|secondary|ghost|danger`, sizes, renders a router `<Link>` when given `to`), `Badge` (tones, optional dot), `IllustrativeTag` (required marker for invented data), `Card` / `CardHeader` (`interactive` for hover lift; `as` for element), `Callout`, `Tabs` (accessible, controlled or not), `Disclosure` (native `<details>/<summary>`, free keyboard/screen-reader support - use for any expandable "show more" section), `Stepper` (presentational; takes statuses), `Spinner` / `Skeleton`, `tones.ts` (shared tone vocabulary).

**`components/layout/`**: `Container`, `Section` / `SectionHeading`, `BlockHeading` (compact serif block title + accent rule + optional right-hand note, for blocks inside a page), `PageHeader` (owns the page `h1`; props `aside` = right-hand visual from `md` up, `compact` = tighter padding), `SiteHeader`, `SiteFooter`, `PagePager`, `PlaceholderPage`. Tighten `Section` spacing per page with a className, e.g. `py-6 md:py-8` (`cn` resolves the override).

**`components/case-study/`**: `FlowDiagram` (abstract pipeline nodes; `vertical` rail for any length, `horizontal` for about 5-6, each node takes an optional `caption` rendered in mono under its description - used for short technical labels like "Embeddings + semantic search"), `WorkflowStrip` (a *user's journey*: numbered icon badges, arrows, an "information-heavy" bracket over contiguous `heavy` steps; CSS-subgrid-aligned columns from `lg`, badge above title until `xl`, vertical rail with chips below `lg`), `WorkflowEvolution` (today's step above its AI-assisted counterpart, one column per stage, controlled `activeIndex`/`onActiveChange` so it can highlight in sync with a linked component), `CapabilityGrid` (cards whose extra "deeper" sentence stays in the DOM but is visually collapsed until hovered/focused/`active`; also takes `activeIndex`/`onActiveChange` - pair it with `WorkflowEvolution` via one page-level `useState<number|null>` to link the two, as Page 2 does), `PairedCards` (two tinted cards whose rows correspond 1:1; subgrid-aligned with an arrow column from `lg`, hover highlights the counterpart via `data-active`, an "Addresses: …" caption covers touch/mobile/screen readers), `StatementBanner` (a large two-line statement on a strong ink-dark block - heavier than `PrincipleCallout`, for a page's one big closing statement), `PersonaCard` + `PersonaAvatar` (neutral line-art, no skin tone), `IconList` (icon-in-soft-circle statements), `MetricGrid` (a restrained stat-tile grid - value in the sans face per the `dataviz` skill, always-visible label + one-line explanation + `IllustrativeTag`, a `Disclosure` for an optional deeper note; no color-coding of values as good/bad), `GuardrailGrid` (icon+title+description cards, simpler than `CapabilityGrid` - no per-card expand; takes `highlightedIds: ReadonlySet<string>` + `onHover`), `FailureModeList` (failure + expected-behaviour together in one row/card, unlike `PairedCards`' two-full-cards shape; also takes `highlightedIds`/`onHover`, many-to-many capable - see Page 4's notes above), `RiskList` (risk + arrow + mitigation, the same row idiom as `FailureModeList` but with no relation/highlight props - both sides are always visible, hover/focus is pure CSS with no React state - see Page 5's notes above), `ContextNote` (quiet provenance line), `DocumentStackIllustration` (token-colored SVG hero art), `PrincipleCallout`, `DisclaimerNote`, `actors.ts` (actor → tone map). Use `WorkflowStrip` for a single step-by-step journey, `WorkflowEvolution` when showing that journey evolving into an AI-assisted one, and `FlowDiagram` for system/pipeline diagrams.

**The hover/focus-link pattern** has two variants, both built the same way (lift state in the page, pass it plus a callback to both sides, read a boolean on each item for styling, `tabIndex={0}` so it works by keyboard not just mouse, and always state the association as visible text too - hover/focus is an enhancement, never the only way to see a pairing):
- **Index-based 1:1** (`WorkflowEvolution` ↔ `CapabilityGrid`, also stand-alone inside `PairedCards`): use when the two lists are the same length and genuinely correspond position-for-position. One `activeIndex`/`setActiveIndex`; each side calls `onActiveChange(index)`/`onActiveChange(null)`; reads `data-active={activeIndex === index}`.
- **Id-based many-to-many** (`GuardrailGrid` ↔ `FailureModeList`, Page 4): use when the correspondence isn't 1:1 - some items relate to several on the other side, some to none. One `hoveredId`/`setHoveredId` in the page; each side calls `onHover(id)`/`onHover(null)`; the page computes a `Set<string>` of highlighted ids per side (from an explicit `relatedIds` relation in the content, not position) and passes it down as `highlightedIds`; each item reads `data-active={highlightedIds.has(item.id)}`. Don't reach for the index-based variant just because two lists happen to have matching lengths - check whether the relationship is actually 1:1 first.

When a page needs a new pattern used more than once, add it here instead of inlining it. Prefer composing existing components.

## 7. Prototype state and interaction model

One realistic end-to-end workflow, all local mock state, now with a real UI built on `/prototype`.

**Steps (in order):** `select → analyze → retrieve → draft → review → feedback` (`STEP_IDS`, labels in `src/prototype/steps.ts`). **These are reducer bookkeeping, not separate screens** - Page 3 shows one continuous workspace whose panels populate progressively as `state` changes (see below), rather than switching full screens via `GO_TO_STEP`. `WorkflowStepper` (a step-wizard UI) still exists and is still tested, for a future page that wants that pattern; `/prototype` doesn't use it.

**Files (`src/prototype/`):**
- `types.ts`: domain types and the action union. `Illustrative<T>` marks any invented record with `illustrative: true`. `RetrievedSource` has a `category` field (e.g. "Patent Claim", "Prior Art Document", "Prosecution History").
- `reducer.ts`: **pure** reducer, initial state, and selectors (`selectStepStatus`, `selectDocStatus`, `selectCanStartPipeline`, `selectHasDraft`, `selectHasEdits`, `selectSectionText`). Invalid transitions return the *same state object* (no-op), so the guards in the reducer are the single source of truth.
- `actions.ts`: `createActions(dispatch)`. Bound helpers that stamp `Date.now()` so the reducer stays pure.
- `PrototypeContext.ts`, `PrototypeProvider.tsx`, `usePrototype.ts`: context, provider (mounted in `AppLayout`, so **state survives route changes**), hook returning `{ state, actions, dispatch }`. `Prototype.tsx` is the only place that calls `usePrototype()` directly - every component below it takes plain props, so each is independently testable.
- `usePipelineRunner.ts`: timer-driven fake AI stages (`parsing → embedding → retrieving → drafting`) that dispatch actions. This is the **seam for a real backend**: replace the `getMockResult` call and the reducer/UI don't change.
- `mock/seed.ts`: the fictional scenario - an Office Action rejecting a wearable-sensor-patch claim as obvious over a cited reference, with 3 sources and a 2-section response draft. `OFFICE_ACTION_TEXT.paragraphs` embeds `{{src-1}}`/`{{src-2}}` markers that `DocumentPanel` renders as clickable evidence highlights.
- `content.ts`: Page 3's workspace copy (sidebar nav, top-bar labels, reject reasons, the illustrative quality-panel rows, the "How this works" flow nodes). Same "content separate from presentation" rule as `src/content/<page>.ts`.
- `steps.ts`: reducer-value → display mappings: `STEP_META`, `STAGE_LABEL`, `DOC_STATUS_META`, and `CONFIDENCE_TONE` (`Level` → `Tone`: high/medium/low → success/warning/danger).
- `components/WorkflowStepper.tsx`: step-wizard stepper bound to state (not used on `/prototype`; kept for a future step-wizard page).
- `components/ProductShell.tsx`, `DocumentPanel.tsx`, `AiAnalysisPanel.tsx`, `SourceDrawer.tsx`, `DraftPanel.tsx`, `RejectFeedbackPanel.tsx`, `QualityPanel.tsx`: the actual workspace UI, described below.

**State shape:** `step`, `reached` (gates navigation; later steps unlock as the workflow progresses), `documentId`, `pipeline {status, stage}`, `sources`, `activeSourceId`, `draft {sections, edits}`, `review {decision, reason}`, `feedback[]`, `audit[]`.

**Rules baked into the reducer:**
- Only reached steps can be opened; while the pipeline runs only `analyze` is reachable.
- `PIPELINE_DONE` unlocks `retrieve` and `draft` but does **not** auto-navigate, and does **not** unlock `review`. The expert opts in via `BEGIN_REVIEW`.
- Expert edits are stored separately in `draft.edits`. The original AI `text` is never overwritten (traceability, and edits are an evaluation signal).
- Approve with edits → decision `edited` ("Approved with edits"); without → `approved`. **Reject requires a reason.**
- A decision is final: no second decision, no further edits. `RESET` returns to the start.
- Ratings are one per section (a new rating replaces the old); comments need text. `audit` records what happened, in order.
- Document status is **derived** (`selectDocStatus`), never stored.
- Confidence and relevance are qualitative (`high|medium|low`), not percentages, to avoid fake precision. This is unrelated to (and doesn't conflict with) `QualityPanel`'s static illustrative numbers - see Page 3's decisions above.

State is in-memory only; a page refresh restarts the workflow.

**The `/prototype` workspace UI**, top to bottom: a compact `PageHeader`, `DisclaimerNote`, a collapsed `Disclosure` "How this works" (reuses `FlowDiagram` horizontal mode), then `ProductShell` - a white, bordered, denser frame inside the ivory page (sidebar nav + top bar), containing:
- An empty state ("Analyze this document") until a document is selected; one click dispatches `selectDocument` then `startPipeline` in the same handler (two `dispatch` calls in one handler compose correctly against the reducer in order - this is standard `useReducer` behaviour, not a race).
- While `pipeline.status === 'running'`: `DocumentPanel` (visible immediately) plus a stage-label + `Spinner` in place of the analysis/draft panels.
- Once the draft exists: `DocumentPanel` + `AiAnalysisPanel` (left), `DraftPanel` + `QualityPanel` (right), stacking to one column below `xl`.
- A `useEffect` in `Prototype.tsx` calls `actions.beginReview()` as soon as the draft exists (idempotent per the reducer), so Approve/Reject work without a separate "begin review" step - the status badge reads "In expert review" essentially as soon as the draft appears, not the more transient `draft_ready`.
- `SourceDrawer` is a sibling overlay (right panel at `lg+`, bottom sheet below `lg`), opened by a page-local `sourcesOpen` boolean; every source reference (document highlight, evidence-list row, draft citation chip, drawer item) calls the same `setActiveSource`, which is how grounding is demonstrated - clicking any of them opens the same drawer scoped to the same source.
- `DraftPanel`'s Edit toggles a **local** `isEditing` boolean (not reducer state) that swaps each section's text for a `<textarea>` bound to `selectSectionText`/`editSection` - edits autosave on every change, no explicit save action needed.
- Rejecting opens `RejectFeedbackPanel` inline (also local state, uncommitted) with the 5 reasons + "Other"; only Submit dispatches `actions.reject(reason)`.

## 8. Important assumptions

- The concept name, seed document, sources and draft are placeholders. IDs like `EX-0001` / `EX-P-0007` are intentionally fake; never use real patent numbers or parties.
- **No company name in the UI, ever - including in a source prompt's own wording.** A page prompt may hand you exact copy that names a company (Page 2's brief did, in its footnote); swap it for the generic phrasing already used elsewhere ("any company's...", "not internal company data") and say so, rather than reproducing it or silently dropping the sentence.
- No customer research, adoption, revenue or accuracy numbers exist or should be invented.
- No backend and no real LLM calls unless explicitly requested.
- Home is provisional. Any page can be replaced when its design prompt arrives.
- Desktop first, but every page must work at about 390px wide.
- `src/test/setup.ts` stubs a couple of DOM APIs jsdom doesn't implement (`window.scrollTo`, `Element.prototype.scrollIntoView`) - components are free to use real scrolling behaviour; add a stub here if a future component hits another missing jsdom API rather than avoiding the API.
- An `AGENTS.md` may appear at the repo root as a stale auto-generated mirror of an earlier `CLAUDE.md` snapshot. It is not maintained - `CLAUDE.md` is the source of truth. Don't read it for current guidance, and don't update it in place of `CLAUDE.md`.

## 9. Rules for implementing future pages

Work happens **one page per prompt**, sometimes with a reference image.

1. **Reference images are layout/visual direction, not content.** Adapt them to this design system. Do not copy unrelated content, colors or fonts from an image.
2. **Reuse before inventing.** Use existing components and tokens. If a pattern will repeat, add it to `components/`. Never hardcode colors/spacing; if a token is missing, add it to `@theme` (and to `cn.ts` if it is a font size, shadow or container).
3. **Content is separate from presentation.** Put page copy and data in `src/content/<page>.ts` and feed components; do not bury copy in JSX.
4. **Every page starts with `PageHeader`** (one `h1`; the eyebrow text is per page, e.g. Page 1 uses "AI Product Case Study"), sets `<title>` via `pageTitle()`, and ends with `PagePager` (in a `tone="subtle"` `Section`).
5. **Answer the seven questions** for every feature: what user problem, why AI helps, why this workflow, how we know the output is good, where human judgment stays necessary, what could go wrong, how we measure success. Show product reasoning, not only UI.
6. **Never invent evidence.** No made-up research, adoption, revenue or accuracy figures. If an illustrative number is needed, mark it with `IllustrativeTag` ("Illustrative" / "Example" / "Proposed"). Mock records must carry `illustrative: true`.
7. **Keep interactions functional**, backed by the prototype state/reducer. Do not fake state with local `useState` when it belongs in the shared model (extend the reducer and add tests instead).
8. **Accessibility:** semantic landmarks and headings, real `<button>` / `<a>`, visible focus, keyboard support, `aria-current` / `aria-live` where relevant, sufficient contrast, reduced-motion respected.
9. **Responsive:** must work at 390px, 768px and 1440px with no horizontal page scroll. Wide content (tables, diagrams, code) scrolls inside its own container.
10. **Do not redesign completed pages** unless explicitly asked.
11. **Verify after every page:** `npm run typecheck && npm run lint && npm test && npm run build`, then actually load the page (dev server) and check 390px, 768px, 1024px and 1440px. Notes: headless Chrome's `--window-size` cannot go below about 500px wide, so use CDP device-metrics emulation for phone widths; and capture screenshots by resizing the viewport to the full page height (not `captureBeyondViewport`, which can drop elements that have an entrance animation). In tests, match page headings by regex, because a page may number its own title ("1. Understanding the Problem") while the nav says "Understanding the Problem". Once a page has fully editorial H1 copy unrelated to its nav title (e.g. Page 2's "From information overload to expert-validated work."), add its id to `CUSTOM_HEADING_SECTIONS` in `router.test.tsx`'s generic per-route test (it then just asserts an h1 exists there) and cover the exact wording in that page's own test file instead.
12. **Update this file:** flip the page's status in section 3, and document any new components, tokens or state.
