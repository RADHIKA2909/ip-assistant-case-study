import {
  Blocks,
  FileSearch,
  Gauge,
  Link2,
  MessageSquareWarning,
  PenLine,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Actor } from '@/content/site'

/*
 * Content for /evaluation ("Evaluation & Safety").
 *
 * Section headings, the 4-stage framework, the 7 metrics' labels/values/explanations, the
 * guardrail names/descriptions and the failure-mode/expected-behaviour pairs are the case study
 * author's own wording (from the Page 4 brief), reused close to verbatim. This page's own
 * additions: the "how we'd measure this" methodology line per metric (qualitative, no numbers),
 * and the failure<->guardrail relations (see CLAUDE.md for why these are explicit many-to-many
 * relations rather than a forced 1:1 pairing).
 */

export const EVALUATION_HERO = {
  eyebrow: '04 — Evaluation & Safety',
  titlePrefix: 'Building trust through ',
  titleEmphasis: 'measurable',
  titleSuffix: ' quality.',
  subtitle:
    "In high-stakes professional workflows, the goal isn't simply to generate an answer. The system must retrieve the right evidence, produce a grounded output and give an expert meaningful control.",
  badge: 'Illustrative Evaluation Framework',
} as const

export const PRINCIPLE_STATEMENT = 'AI quality is a product metric, not just a model metric.'

export interface EvalStage {
  id: string
  label: string
  question: string
  actor: Actor
}

export const STAGES_LABEL = 'What does "good" mean?'
export const STAGES_NOTE = 'Failure at any stage can reduce trust in the final output.'

export const STAGES: readonly EvalStage[] = [
  { id: 'retrieve', label: 'Retrieve', question: 'Did we find the right information?', actor: 'ai' },
  { id: 'ground', label: 'Ground', question: 'Is the output supported by evidence?', actor: 'ai' },
  { id: 'generate', label: 'Generate', question: 'Is the response accurate and useful?', actor: 'ai' },
  { id: 'validate', label: 'Validate', question: 'Would an expert accept the output?', actor: 'human' },
]

export interface Metric {
  id: string
  label: string
  value: string
  explanation: string
  /** This page's own addition: a qualitative note on approach, not a number. */
  howWeMeasure: string
}

export const METRICS_LABEL = 'Example quality metrics — illustrative'
export const HOW_WE_MEASURE_LABEL = 'How would we measure this?'

export const METRICS: readonly Metric[] = [
  {
    id: 'retrieval-quality',
    label: 'Retrieval Quality',
    value: '92%',
    explanation: 'Relevant evidence appears in retrieved results.',
    howWeMeasure: 'Sample queries against a set of passages an expert has pre-labelled as relevant, and check how often retrieval finds them.',
  },
  {
    id: 'answer-accuracy',
    label: 'Answer Accuracy',
    value: '88%',
    explanation: 'Expert-reviewed factual correctness.',
    howWeMeasure: 'Have a domain expert score a sample of outputs for factual correctness against the source documents.',
  },
  {
    id: 'groundedness',
    label: 'Groundedness',
    value: '95%',
    explanation: 'Claims supported by retrieved evidence.',
    howWeMeasure: 'Check each claim in a draft against its cited source, and flag any claim with no supporting passage.',
  },
  {
    id: 'expert-acceptance',
    label: 'Expert Acceptance Rate',
    value: '72%',
    explanation: 'Outputs accepted without substantive changes.',
    howWeMeasure: 'Track the share of reviewed drafts approved as-is, versus approved with edits or rejected.',
  },
  {
    id: 'human-override',
    label: 'Human Override Rate',
    value: '18%',
    explanation: 'Outputs requiring expert correction.',
    howWeMeasure: 'Track how often an expert edits a section before approving it - the human-in-the-loop signal at work, not a failure on its own.',
  },
  {
    id: 'latency',
    label: 'Average Latency',
    value: '6.2s',
    explanation: 'Time from request to usable response.',
    howWeMeasure: 'Measure wall-clock time from a request being made to a reviewable draft being ready.',
  },
  {
    id: 'cost',
    label: 'Cost / Query',
    value: '$0.08',
    explanation: 'Average model + retrieval cost per request.',
    howWeMeasure: 'Sum model and retrieval spend over a period and divide by the number of requests served.',
  },
]

export interface LoopNode {
  id: string
  label: string
  caption?: string
  actor: Actor
}

export const HUMAN_LOOP_LABEL = 'Human-in-the-loop'
export const HUMAN_LOOP_HIGHLIGHT = 'Human review is part of the product design — not a fallback.'

export const HUMAN_LOOP: readonly LoopNode[] = [
  { id: 'generate', label: 'AI generates output', actor: 'ai' },
  { id: 'evidence', label: 'Evidence + confidence shown', actor: 'ai' },
  { id: 'reviews', label: 'Patent professional reviews', actor: 'human' },
  { id: 'decision', label: 'Approve / Edit / Reject', actor: 'human' },
  { id: 'feedback', label: 'Feedback captured', actor: 'human' },
  { id: 'dataset', label: 'Evaluation dataset updated', actor: 'loop' },
]

export interface Guardrail {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export const GUARDRAILS_LABEL = 'Guardrails for high-stakes AI'

export const GUARDRAILS: readonly Guardrail[] = [
  {
    id: 'source-grounding',
    icon: Link2,
    title: 'Source Grounding',
    description: 'Prefer answers supported by retrieved evidence.',
  },
  {
    id: 'citation-traceability',
    icon: FileSearch,
    title: 'Citation / Traceability',
    description: 'Make supporting sources visible and inspectable.',
  },
  {
    id: 'domain-validation',
    icon: ShieldCheck,
    title: 'Domain Validation',
    description: 'Use expert-reviewed datasets and test cases.',
  },
  {
    id: 'confidence-escalation',
    icon: Gauge,
    title: 'Confidence / Escalation',
    description: 'Low-confidence or unsupported outputs should trigger review.',
  },
  {
    id: 'data-isolation',
    icon: Blocks,
    title: 'Data Isolation',
    description: 'Protect enterprise/customer data across tenants.',
  },
]

export interface FailureMode {
  id: string
  icon: LucideIcon
  failure: string
  expectedBehaviour: string
  /** Ids into GUARDRAILS. Deliberately not always 1:1 - see CLAUDE.md. */
  relatedGuardrailIds: readonly string[]
}

export const FAILURE_MODES_LABEL = 'Acceptable failure modes'
export const FAILURE_MODES_NOTE =
  "Good AI products don't eliminate every failure. They make failures visible, bounded and recoverable."

export const FAILURE_MODES: readonly FailureMode[] = [
  {
    id: 'unsupported-answer',
    icon: MessageSquareWarning,
    failure: 'Unsupported answer',
    expectedBehaviour: 'Ask for clarification / refuse to answer.',
    relatedGuardrailIds: ['source-grounding'],
  },
  {
    id: 'weak-retrieval',
    icon: ScanSearch,
    failure: 'Weak retrieval',
    expectedBehaviour: 'Show limited confidence + surface alternative sources.',
    relatedGuardrailIds: ['citation-traceability', 'domain-validation'],
  },
  {
    id: 'missing-evidence',
    icon: ShieldAlert,
    failure: 'Missing evidence',
    expectedBehaviour: 'Do not present unsupported claims as facts.',
    relatedGuardrailIds: ['source-grounding'],
  },
  {
    id: 'low-confidence',
    icon: Gauge,
    failure: 'Low confidence',
    expectedBehaviour: 'Escalate to expert review.',
    relatedGuardrailIds: ['confidence-escalation'],
  },
  {
    id: 'incorrect-draft',
    icon: PenLine,
    failure: 'Incorrect draft',
    expectedBehaviour: 'Allow expert edit/reject + capture feedback.',
    // No guardrail here by design: this is caught by human review (Section 3), not an
    // automated guardrail - the row's own text says so instead of pointing nowhere.
    relatedGuardrailIds: [],
  },
]

export const IMPROVEMENT_LABEL = 'Continuous improvement'
export const IMPROVEMENT_CAPTION = 'Measure → Learn → Improve'

export const IMPROVEMENT_LOOP: readonly LoopNode[] = [
  { id: 'production', label: 'Production usage', actor: 'input' },
  { id: 'errors', label: 'Errors / feedback', actor: 'human' },
  { id: 'dataset', label: 'Evaluation dataset', actor: 'loop' },
  { id: 'improvement', label: 'Model / retrieval improvement', actor: 'ai' },
  { id: 're-evaluation', label: 'Re-evaluation', actor: 'loop' },
  { id: 'production-2', label: 'Production', actor: 'input' },
]

export const EVALUATION_NOTE =
  "Proposed evaluation framework based on public product/domain understanding — not any company's internal metrics, datasets or safety policies."

export const RELATED_GUARDRAIL_LABEL = 'Guardrail'
