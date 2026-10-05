/*
 * Domain model for the interactive prototype.
 * Everything here is mock/local state. There is no backend.
 */

/**
 * Every invented record must carry `illustrative: true`, and any UI that renders one must show
 * <IllustrativeTag />. This is how the "never present made-up data as real" rule is enforced.
 */
export type Illustrative<T> = T & { readonly illustrative: true }

/** The six screens of the workflow, in order. */
export const STEP_IDS = ['select', 'analyze', 'retrieve', 'draft', 'review', 'feedback'] as const
export type StepId = (typeof STEP_IDS)[number]

/** What the (simulated) AI pipeline does while the user waits on the `analyze` step. */
export const PIPELINE_STAGES = ['parsing', 'embedding', 'retrieving', 'drafting'] as const
export type PipelineStage = (typeof PIPELINE_STAGES)[number]
export type PipelineStatus = 'idle' | 'running' | 'done'

/**
 * Qualitative on purpose. A made-up "94% confident" would be fake precision;
 * real calibration is an evaluation topic (see /evaluation).
 */
export type Level = 'high' | 'medium' | 'low'

export type ReviewDecision = 'pending' | 'approved' | 'edited' | 'rejected'

/** 'edited' means approved with expert edits. */
export type DocStatus =
  | 'not_started'
  | 'ai_processing'
  | 'draft_ready'
  | 'in_review'
  | 'approved'
  | 'edited'
  | 'rejected'

export type PatentDocument = Illustrative<{
  id: string
  title: string
  type: string
  summary: string
  pageCount: number
}>

/** A passage the system retrieved as evidence. */
export type RetrievedSource = Illustrative<{
  id: string
  label: string
  /** What kind of material this is, in plain English, e.g. "Company's claim", "Existing reference" */
  category: string
  /** Short label used in the draft's citation chips, e.g. "Claim 1 — Company's claim" */
  citationLabel: string
  /** Where in the document, e.g. "Claim 1" */
  location: string
  excerpt: string
  relevance: Level
}>

/** One section of the AI draft. `text` is the original AI output and is never overwritten by edits. */
export type DraftSection = Illustrative<{
  id: string
  heading: string
  text: string
  /** Evidence backing this section. Ungrounded sections should not exist. */
  sourceIds: readonly string[]
  confidence: Level
}>

export type FeedbackKind = 'useful' | 'not_useful' | 'comment' | 'decision'

export interface FeedbackEntry {
  id: string
  kind: FeedbackKind
  sectionId: string | null
  value: string | null
  at: number
}

export type AuditType =
  | 'document_selected'
  | 'pipeline_started'
  | 'pipeline_completed'
  | 'source_inspected'
  | 'section_edited'
  | 'review_started'
  | 'decision_submitted'
  | 'feedback_added'

/** Traceability: what happened, in order. */
export interface AuditEvent {
  id: string
  type: AuditType
  detail: string
  at: number
}

export interface PrototypeState {
  step: StepId
  /** Steps the user may navigate to. Later steps unlock as the workflow progresses. */
  reached: readonly StepId[]
  documentId: string | null
  pipeline: { status: PipelineStatus; stage: PipelineStage | null }
  sources: readonly RetrievedSource[]
  activeSourceId: string | null
  draft: {
    sections: readonly DraftSection[]
    /** Expert edits by section id. Absent key = AI text unchanged. */
    edits: Readonly<Record<string, string>>
  }
  review: { decision: ReviewDecision; reason: string | null }
  feedback: readonly FeedbackEntry[]
  audit: readonly AuditEvent[]
}

/**
 * Actions carry their own timestamp (`at`) so the reducer stays pure and testable.
 * Use the bound helpers from usePrototype().actions instead of building these by hand.
 */
export type PrototypeAction =
  | { type: 'SELECT_DOCUMENT'; documentId: string; at: number }
  | { type: 'START_PIPELINE'; at: number }
  | { type: 'PIPELINE_STAGE'; stage: PipelineStage; at: number }
  | {
      type: 'PIPELINE_DONE'
      sources: readonly RetrievedSource[]
      sections: readonly DraftSection[]
      at: number
    }
  | { type: 'SET_ACTIVE_SOURCE'; sourceId: string | null; at: number }
  | { type: 'EDIT_DRAFT_SECTION'; sectionId: string; text: string; at: number }
  | { type: 'BEGIN_REVIEW'; at: number }
  | { type: 'SUBMIT_DECISION'; decision: 'approve' | 'reject'; reason?: string; at: number }
  | {
      type: 'ADD_FEEDBACK'
      kind: Exclude<FeedbackKind, 'decision'>
      sectionId?: string
      value?: string
      at: number
    }
  | { type: 'GO_TO_STEP'; step: StepId }
  | { type: 'RESET' }
