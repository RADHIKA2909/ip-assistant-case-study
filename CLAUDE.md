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
| `/ai-opportunity` | 02 AI Product Opportunity | `src/pages/AiOpportunity.tsx` | Placeholder |
| `/prototype` | 03 Interactive AI Product Experience | `src/pages/Prototype.tsx` | Placeholder + scaffold harness (proves shared state) |
| `/evaluation` | 04 Evaluation & Safety | `src/pages/Evaluation.tsx` | Placeholder |
| `/tpm-thinking` | 05 TPM Thinking | `src/pages/TpmThinking.tsx` | Placeholder |
| `*` | Not found | `src/pages/NotFound.tsx` | Done |

**Page 1 (`/problem`) decisions worth remembering:** it uses the framing *Primary User -> Current Workflow -> Pain Points paired with AI Opportunities*. The pain points and opportunities are **proposed framing, not research** (each card is tagged `Proposed`), pairs are 1:1 by construction (`PainOpportunityPair`), and one-line descriptions are qualitative with no statistics (a test asserts no `%`/`Nx` figures appear). The reference image's hero photo and its attributed customer quote were **deliberately not reproduced** (no stock imagery; a quote from "Patent Attorney" would read as real customer research). The hero uses a line-art SVG instead.

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
  content/                 site.ts (SITE, SECTIONS, CORE_STORY, PRODUCT_QUESTIONS); problem.ts (Page 1). Each page's content goes in its own file here, typed, with lucide icons referenced from the data
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

**`components/ui/`**: `Button` (variants `primary|accent|secondary|ghost|danger`, sizes, renders a router `<Link>` when given `to`), `Badge` (tones, optional dot), `IllustrativeTag` (required marker for invented data), `Card` / `CardHeader` (`interactive` for hover lift; `as` for element), `Callout`, `Tabs` (accessible, controlled or not), `Stepper` (presentational; takes statuses), `Spinner` / `Skeleton`, `tones.ts` (shared tone vocabulary).

**`components/layout/`**: `Container`, `Section` / `SectionHeading`, `BlockHeading` (compact serif block title + accent rule + optional right-hand note, for blocks inside a page), `PageHeader` (owns the page `h1`; props `aside` = right-hand visual from `md` up, `compact` = tighter padding), `SiteHeader`, `SiteFooter`, `PagePager`, `PlaceholderPage`. Tighten `Section` spacing per page with a className, e.g. `py-6 md:py-8` (`cn` resolves the override).

**`components/case-study/`**: `FlowDiagram` (abstract pipeline nodes; `vertical` rail for any length, `horizontal` for about 5), `WorkflowStrip` (a *user's journey*: numbered icon badges, arrows, an "information-heavy" bracket over contiguous `heavy` steps; CSS-subgrid-aligned columns from `lg`, badge above title until `xl`, vertical rail with chips below `lg`), `PairedCards` (two tinted cards whose rows correspond 1:1; subgrid-aligned with an arrow column from `lg`, hover highlights the counterpart via `data-active`, an "Addresses: …" caption covers touch/mobile/screen readers), `PersonaCard` + `PersonaAvatar` (neutral line-art, no skin tone), `IconList` (icon-in-soft-circle statements), `ContextNote` (quiet provenance line), `DocumentStackIllustration` (token-colored SVG hero art), `PrincipleCallout`, `DisclaimerNote`, `actors.ts` (actor → tone map). Use `WorkflowStrip` for people's steps and `FlowDiagram` for system pipelines.

When a page needs a new pattern used more than once, add it here instead of inlining it. Prefer composing existing components.

## 7. Prototype state and interaction model

One realistic end-to-end workflow, all local mock state.

**Steps (in order):** `select → analyze → retrieve → draft → review → feedback` (`STEP_IDS`, labels in `src/prototype/steps.ts`).

**Files (`src/prototype/`):**
- `types.ts`: domain types and the action union. `Illustrative<T>` marks any invented record with `illustrative: true`.
- `reducer.ts`: **pure** reducer, initial state, and selectors (`selectStepStatus`, `selectDocStatus`, `selectCanStartPipeline`, `selectHasDraft`, `selectHasEdits`, `selectSectionText`). Invalid transitions return the *same state object* (no-op), so the guards in the reducer are the single source of truth.
- `actions.ts`: `createActions(dispatch)`. Bound helpers that stamp `Date.now()` so the reducer stays pure.
- `PrototypeContext.ts`, `PrototypeProvider.tsx`, `usePrototype.ts`: context, provider (mounted in `AppLayout`, so **state survives route changes**), hook returning `{ state, actions, dispatch }`.
- `usePipelineRunner.ts`: timer-driven fake AI stages (`parsing → embedding → retrieving → drafting`) that dispatch actions. This is the **seam for a real backend**: replace the `getMockResult` call and the reducer/UI don't change.
- `mock/seed.ts`: tiny fictional seed data. Replace when the prototype page is designed.
- `steps.ts`: display copy for steps, stages and document statuses.
- `components/WorkflowStepper.tsx`: stepper bound to state.

**State shape:** `step`, `reached` (gates navigation; later steps unlock as the workflow progresses), `documentId`, `pipeline {status, stage}`, `sources`, `activeSourceId`, `draft {sections, edits}`, `review {decision, reason}`, `feedback[]`, `audit[]`.

**Rules baked into the reducer:**
- Only reached steps can be opened; while the pipeline runs only `analyze` is reachable.
- `PIPELINE_DONE` unlocks `retrieve` and `draft` but does **not** auto-navigate, and does **not** unlock `review`. The expert opts in via `BEGIN_REVIEW`.
- Expert edits are stored separately in `draft.edits`. The original AI `text` is never overwritten (traceability, and edits are an evaluation signal).
- Approve with edits → decision `edited` ("Approved with edits"); without → `approved`. **Reject requires a reason.**
- A decision is final: no second decision, no further edits. `RESET` returns to the start.
- Ratings are one per section (a new rating replaces the old); comments need text. `audit` records what happened, in order.
- Document status is **derived** (`selectDocStatus`), never stored.
- Confidence and relevance are qualitative (`high|medium|low`), not percentages, to avoid fake precision.

State is in-memory only; a page refresh restarts the workflow.

## 8. Important assumptions

- The concept name, seed document, sources and draft are placeholders. IDs like `EX-0001` / `EX-P-0007` are intentionally fake; never use real patent numbers or parties.
- No customer research, adoption, revenue or accuracy numbers exist or should be invented.
- No backend and no real LLM calls unless explicitly requested.
- Home is provisional. Any page can be replaced when its design prompt arrives.
- Desktop first, but every page must work at about 390px wide.

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
11. **Verify after every page:** `npm run typecheck && npm run lint && npm test && npm run build`, then actually load the page (dev server) and check 390px, 768px, 1024px and 1440px. Notes: headless Chrome's `--window-size` cannot go below about 500px wide, so use CDP device-metrics emulation for phone widths; and capture screenshots by resizing the viewport to the full page height (not `captureBeyondViewport`, which can drop elements that have an entrance animation). In tests, match page headings by regex, because a page may number its own title ("1. Understanding the Problem") while the nav says "Understanding the Problem".
12. **Update this file:** flip the page's status in section 3, and document any new components, tokens or state.
