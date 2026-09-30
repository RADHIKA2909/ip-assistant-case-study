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
  label: 'Key finding',
  text: 'The examiner has raised an obviousness objection relating to the claimed sensor assembly, citing a reference with a rigid housing and a single motion sensor.',
} as const

export const EVIDENCE_LABEL = 'Relevant evidence'
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
}

/**
 * Static illustrative quality summary. Deliberately separate from the per-item qualitative
 * confidence/relevance badges elsewhere in the workspace (Level: high/medium/low, driven by real
 * mock state) - these are fixed numbers for display only, always shown with IllustrativeTag,
 * never presented as a real measurement.
 */
export const QUALITY_ROWS: readonly QualityRow[] = [
  { id: 'groundedness', label: 'Groundedness', value: '92%' },
  { id: 'coverage', label: 'Source coverage', value: '4 / 5 key claims supported' },
  { id: 'review', label: 'Expert review', value: 'Required' },
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

export const ANALYZE_CTA = 'Analyze this document'
