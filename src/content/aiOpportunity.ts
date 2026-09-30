import {
  FilePenLine,
  FileStack,
  ListChecks,
  ScanSearch,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { Tone } from '@/components/ui/tones'

/*
 * Content for /ai-opportunity ("AI Product Opportunity").
 *
 * Section headings, capability descriptions, the three reasons and the closing statement are the
 * case study author's own wording (from the Page 2 brief). The five "deeper" capability sentences
 * and the system-flow captions are this page's own qualitative product-reasoning additions: no
 * invented numbers, adoption figures or accuracy claims. The footnote below deliberately does not
 * name a company (see CLAUDE.md assumptions): the source brief's wording named one, but this
 * project's standing rule is that no company name appears in the UI, so it reads "any company's"
 * here, matching the footer wording already used on Home and Page 1.
 */

export const OPPORTUNITY_HERO = {
  eyebrow: '02 — AI Product Opportunity',
  titlePrefix: 'From information overload to ',
  titleEmphasis: 'expert-validated',
  titleSuffix: ' work.',
  subtitle:
    'AI can reduce the effort involved in finding, understanding and drafting from complex patent information — while keeping the professional in control.',
} as const

/**
 * The five items that run through the workflow-evolution row and the capability grid, in the
 * same order, so hovering either side can highlight the other by index.
 */
export interface OpportunityStage {
  id: string
  icon: LucideIcon
  existing: string
  proposed: string
  capabilityTitle: string
  /** The brief's own capability description, shown by default. */
  description: string
  /** This page's own one-sentence elaboration, revealed on hover/focus. Qualitative, no numbers. */
  deeper: string
}

export const WORKFLOW_EVOLUTION_LABEL = 'The opportunity: from manual steps to an AI-assisted workflow'
export const EXISTING_ROW_LABEL = 'Existing workflow'
export const PROPOSED_ROW_LABEL = 'AI-assisted workflow'
export const AI_ASSISTED_TAG = 'AI'

export const CAPABILITIES_LABEL = 'AI Capabilities'
export const CAPABILITIES_NOTE = 'Hover a capability — or a workflow stage above — to see how they connect.'

export const STAGES: readonly OpportunityStage[] = [
  {
    id: 'retrieve',
    icon: ScanSearch,
    existing: 'Search',
    proposed: 'Retrieve',
    capabilityTitle: 'Intelligent Retrieval',
    description:
      'Find relevant prior art, prosecution history and supporting documents using semantic retrieval rather than keyword-only search.',
    deeper:
      'Retrieval is judged by whether the passages an expert actually needed were surfaced — not by keyword match alone.',
  },
  {
    id: 'understand',
    icon: ListChecks,
    existing: 'Read',
    proposed: 'Understand',
    capabilityTitle: 'Document Understanding',
    description:
      'Extract key claims, entities, arguments, dates and technical concepts from complex documents.',
    deeper:
      'Understanding turns a document into structured facts the rest of the workflow can reason over, instead of raw text.',
  },
  {
    id: 'reason',
    icon: Workflow,
    existing: 'Analyze',
    proposed: 'Reason',
    capabilityTitle: 'AI-Assisted Reasoning',
    description:
      "Combine retrieved evidence with the user's task to generate structured analysis and recommendations.",
    deeper:
      'Each reasoning step stays visible and checkable, so a wrong step can be caught before it ever reaches the draft.',
  },
  {
    id: 'draft',
    icon: FilePenLine,
    existing: 'Draft',
    proposed: 'Draft',
    capabilityTitle: 'Draft Assistance',
    description:
      'Generate structured drafts with supporting evidence and citations while allowing the professional to edit.',
    deeper:
      'A draft is a starting point: every generated statement carries its source, ready to accept, edit or remove.',
  },
  {
    id: 'validate',
    icon: ShieldCheck,
    existing: 'Review',
    proposed: 'Validate',
    capabilityTitle: 'Expert Validation',
    description: 'Keep the expert in control through review, editing, approval and feedback.',
    deeper: 'Nothing is final until a professional signs off — validation is a workflow step, not an afterthought.',
  },
]

export interface SystemFlowStage {
  id: string
  label: string
  caption?: string
  tone: Tone
}

export const SYSTEM_FLOW_LABEL = 'How the AI system works'
export const SYSTEM_FLOW_NOTE = 'A lightweight view of the pipeline — not a full architecture.'

export const SYSTEM_FLOW: readonly SystemFlowStage[] = [
  { id: 'documents', label: 'Documents', tone: 'neutral' },
  { id: 'retrieval', label: 'Retrieval', caption: 'Embeddings + semantic search', tone: 'accent' },
  { id: 'context', label: 'Context', caption: 'Relevant evidence + metadata', tone: 'neutral' },
  { id: 'reasoning', label: 'LLM / AI reasoning', caption: 'LLM / agentic workflow', tone: 'accent' },
  { id: 'output', label: 'Structured output', caption: 'Draft + citations + confidence', tone: 'accent' },
  { id: 'review', label: 'Expert review', caption: 'Approve / Edit / Reject', tone: 'ink' },
]

export interface ReasonItem {
  icon: LucideIcon
  label: string
  reason: string
}

export const REASONS_LABEL = 'Why this approach?'

export const REASONS: readonly ReasonItem[] = [
  {
    icon: FileStack,
    label: 'RAG',
    reason: "Ground responses in the organisation's trusted IP knowledge and documents.",
  },
  {
    icon: Workflow,
    label: 'Agentic workflow',
    reason: 'Useful when the task requires multiple steps such as search → compare → analyse → draft.',
  },
  {
    icon: ShieldCheck,
    label: 'Human-in-the-loop',
    reason: 'Critical when the output contributes to high-stakes professional/legal work.',
  },
]

export const STATEMENT = {
  lineOne: 'AI accelerates the work.',
  lineTwo: 'The expert owns the decision.',
  support:
    'Every AI-generated output should be traceable to evidence, reviewable by an expert, and measurable for quality.',
} as const

export const OPPORTUNITY_NOTE =
  "Proposed product approach based on public product/domain understanding — not any company's internal architecture."
