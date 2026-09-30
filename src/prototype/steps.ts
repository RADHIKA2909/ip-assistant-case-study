import type { Tone } from '@/components/ui/tones'
import type { DocStatus, Level, PipelineStage, StepId } from './types'

/** Display copy for the workflow steps. Placeholder wording; the prototype page prompt will refine it. */
export const STEP_META: Record<StepId, { label: string; description: string }> = {
  select: { label: 'Select document', description: 'Choose what the AI works on.' },
  analyze: { label: 'AI analysis', description: 'The system reads and indexes the document.' },
  retrieve: { label: 'Evidence', description: 'Passages retrieved to ground the draft.' },
  draft: { label: 'Draft', description: 'A structured draft with citations.' },
  review: { label: 'Expert review', description: 'Inspect evidence. Approve, edit or reject.' },
  feedback: { label: 'Feedback', description: 'Decisions become improvement signals.' },
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  parsing: 'Parsing the document',
  embedding: 'Indexing passages',
  retrieving: 'Retrieving relevant evidence',
  drafting: 'Drafting with citations',
}

/** Display tone for a qualitative confidence/relevance level. Matches the semantic meaning of each tone. */
export const CONFIDENCE_TONE: Record<Level, Tone> = {
  high: 'success',
  medium: 'warning',
  low: 'danger',
}

export const DOC_STATUS_META: Record<DocStatus, { label: string; tone: Tone }> = {
  not_started: { label: 'Not started', tone: 'neutral' },
  ai_processing: { label: 'AI processing', tone: 'accent' },
  draft_ready: { label: 'Draft ready', tone: 'accent' },
  in_review: { label: 'In expert review', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  edited: { label: 'Approved with edits', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
}
