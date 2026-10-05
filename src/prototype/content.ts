import { BookOpenText, FileSearch, Gavel, LayoutGrid, PenLine } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SITE } from '@/content/site'
import type { FlowNode } from '@/components/case-study/FlowDiagram'

/*
 * Copy and static illustrative content for the /prototype workspace UI. Reducer-value → display
 * mappings (tones for DocStatus / Level) live in prototype/steps.ts; this file is page content,
 * following the same "content separate from presentation" rule as src/content/<page>.ts.
 *
 * Naming note: the source brief called the in-app product "Clair Workspace." That's close enough
 * to the real company name this project deliberately keeps out of the UI, so it reuses the case
 * study's own working title instead - one consistent product identity throughout.
 */
export const WORKSPACE_NAME = `${SITE.shortName} Workspace`

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

/** Decorative for this prototype's scope (not separately routed) - deliberately simple per the brief. */
export const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { id: 'workspace', label: 'Workspace', icon: LayoutGrid },
  { id: 'document-analysis', label: 'Document Analysis', icon: FileSearch },
  { id: 'prior-art-search', label: 'Prior Art Search', icon: BookOpenText },
  { id: 'draft-response', label: 'Draft Response', icon: PenLine },
  { id: 'review', label: 'Review', icon: Gavel },
]

export const CURRENT_SIDEBAR_ITEM = 'draft-response'

export const TOP_BAR = {
  title: 'Office Action Response',
  metaSources: '3 source documents',
} as const

export const KEY_FINDING = {
  label: 'AI Key Finding',
  text: 'The existing reference measures how much water remains in the bottle. Claim 1 focuses on tracking how much water the user actually drinks. The AI identifies this as the key difference.',
} as const

export const EVIDENCE_LABEL = 'Relevant Evidence'

/** The "Why this answer?" explanation, shown above the list of sources behind the response. */
export const WHY_THIS_ANSWER_TEXT =
  'The AI compared the company’s claim with the cited prior-art reference and identified the difference between measuring water remaining and tracking water consumed.'
export const VIEW_SOURCES_LABEL = 'View Sources'
export const OPEN_SOURCE_LABEL = 'Open source'
export const WHY_THIS_ANSWER_LABEL = 'Why this answer?'

export const DRAFT_DISCLAIMER =
  'AI-generated draft — requires expert review. This is a starting point, not a final filing.'

export interface RejectReason {
  id: string
  label: string
}

export const REJECT_REASONS: readonly RejectReason[] = [
  { id: 'incorrect-reasoning', label: 'Incorrect reasoning' },
  { id: 'missing-evidence', label: 'Missing evidence' },
  { id: 'wrong-citation', label: 'Wrong citation' },
  { id: 'needs-more-detail', label: 'Needs more detail' },
  { id: 'other', label: 'Other' },
]

export const REJECT_PANEL_LABEL = 'What needs improvement?'
export const FEEDBACK_CAPTURED_MESSAGE = 'Feedback captured — thank you.'

export interface QualityRow {
  id: string
  label: string
  value: string
  /** Plain-English explanation of what the number means. */
  help: string
}

/**
 * Static illustrative quality summary. Deliberately separate from the per-item qualitative
 * confidence/relevance badges elsewhere in the workspace (Level: high/medium/low, driven by real
 * mock state) - these are fixed numbers for display only, always shown with IllustrativeTag,
 * never presented as a real measurement.
 */
export const QUALITY_ROWS: readonly QualityRow[] = [
  {
    id: 'groundedness',
    label: 'Groundedness',
    value: '92%',
    help: 'How much of the AI response is supported by the available source documents.',
  },
  {
    id: 'coverage',
    label: 'Source coverage',
    value: '4 / 5 key claims supported',
    help: 'How many important statements in the AI response have supporting evidence.',
  },
  {
    id: 'review',
    label: 'Expert review',
    value: 'Required',
    help: 'The patent professional must review the AI output before it is used.',
  },
]

export const HOW_IT_WORKS_LABEL = 'How this works'
export const HOW_IT_WORKS_NODES: readonly FlowNode[] = [
  { id: 'document', label: 'Document', tone: 'neutral' },
  { id: 'retrieval', label: 'Retrieval', caption: 'Semantic retrieval', tone: 'accent' },
  { id: 'context', label: 'Relevant context', caption: 'Context grounding', tone: 'neutral' },
  { id: 'reasoning', label: 'LLM / Agent', caption: 'AI reasoning', tone: 'accent' },
  { id: 'draft', label: 'Draft + evidence', tone: 'accent' },
  { id: 'review', label: 'Expert review', caption: 'Human validation', tone: 'ink' },
]

export const PRODUCT_PRINCIPLE = 'AI assists. Evidence grounds. Expert decides.'

/** Save/Export are real buttons but nothing in this prototype models persistence or export. */
export const SAVE_CONFIRMATION = 'Saved (illustrative — this prototype keeps no data)'
export const EXPORT_NOTE = 'Export is illustrative and not implemented in this prototype.'

/** Footer note - same "proposed, illustrative" pattern used on every other page's footer. */
export const PROTOTYPE_NOTE =
  "Proposed interactive prototype using illustrative, fictional data — not any company's actual product, architecture or results."

export const ANALYZE_CTA = 'Analyze this document'
