import type { StepStatus } from '@/components/ui/Stepper'
import {
  PIPELINE_STAGES,
  STEP_IDS,
  type AuditEvent,
  type AuditType,
  type DocStatus,
  type FeedbackEntry,
  type PrototypeAction,
  type PrototypeState,
  type StepId,
} from './types'

/*
 * Pure reducer for the prototype workflow. No timers, no Date.now(), no imports from mock data.
 * Invalid transitions return the SAME state object (a no-op), so callers can dispatch freely
 * and the guards here are the single source of truth for what the workflow allows.
 */

export function createInitialState(): PrototypeState {
  return {
    step: 'select',
    reached: ['select'],
    documentId: null,
    pipeline: { status: 'idle', stage: null },
    sources: [],
    activeSourceId: null,
    draft: { sections: [], edits: {} },
    review: { decision: 'pending', reason: null },
    feedback: [],
    audit: [],
  }
}

function unlock(reached: readonly StepId[], ...steps: StepId[]): StepId[] {
  const set = new Set([...reached, ...steps])
  return STEP_IDS.filter((id) => set.has(id))
}

function withAudit(state: PrototypeState, type: AuditType, detail: string, at: number): AuditEvent[] {
  return [...state.audit, { id: `evt-${state.audit.length + 1}`, type, detail, at }]
}

/**
 * Feedback entries can be replaced (re-rating a section), so length + 1 could collide.
 * Derive the next id from the highest existing one instead. `offset` numbers extra entries added in one step.
 */
function nextFeedbackId(feedback: readonly FeedbackEntry[], offset = 0): string {
  const highest = feedback.reduce((max, f) => Math.max(max, Number(f.id.slice(3))), 0)
  return `fb-${highest + 1 + offset}`
}

export function prototypeReducer(state: PrototypeState, action: PrototypeAction): PrototypeState {
  switch (action.type) {
    case 'SELECT_DOCUMENT': {
      if (state.pipeline.status === 'running') return state
      if (state.documentId === action.documentId) return state
      const fresh = createInitialState()
      return {
        ...fresh,
        documentId: action.documentId,
        audit: withAudit(fresh, 'document_selected', action.documentId, action.at),
      }
    }

    case 'START_PIPELINE': {
      if (state.documentId === null || state.pipeline.status !== 'idle') return state
      return {
        ...state,
        step: 'analyze',
        reached: unlock(state.reached, 'analyze'),
        pipeline: { status: 'running', stage: PIPELINE_STAGES[0] },
        audit: withAudit(state, 'pipeline_started', state.documentId, action.at),
      }
    }

    case 'PIPELINE_STAGE': {
      if (state.pipeline.status !== 'running') return state
      return { ...state, pipeline: { status: 'running', stage: action.stage } }
    }

    case 'PIPELINE_DONE': {
      if (state.pipeline.status !== 'running') return state
      return {
        ...state,
        // Unlock, but do not auto-navigate: the user decides when to move on from the analysis screen.
        reached: unlock(state.reached, 'retrieve', 'draft'),
        pipeline: { status: 'done', stage: null },
        sources: action.sources,
        activeSourceId: null,
        draft: { sections: action.sections, edits: {} },
        audit: withAudit(
          state,
          'pipeline_completed',
          `${action.sources.length} sources, ${action.sections.length} draft sections`,
          action.at,
        ),
      }
    }

    case 'SET_ACTIVE_SOURCE': {
      if (action.sourceId === state.activeSourceId) return state
      if (action.sourceId !== null && !state.sources.some((s) => s.id === action.sourceId)) {
        return state
      }
      return {
        ...state,
        activeSourceId: action.sourceId,
        audit:
          action.sourceId === null
            ? state.audit
            : withAudit(state, 'source_inspected', action.sourceId, action.at),
      }
    }

    case 'EDIT_DRAFT_SECTION': {
      if (state.review.decision !== 'pending') return state
      const section = state.draft.sections.find((s) => s.id === action.sectionId)
      if (!section) return state
      const edits = { ...state.draft.edits }
      const reverted = action.text === section.text
      if (reverted) {
        delete edits[section.id]
      } else {
        edits[section.id] = action.text
      }
      return {
        ...state,
        draft: { ...state.draft, edits },
        audit: withAudit(
          state,
          'section_edited',
          `${section.id}${reverted ? ' (reverted to AI text)' : ''}`,
          action.at,
        ),
      }
    }

    case 'BEGIN_REVIEW': {
      if (state.draft.sections.length === 0 || state.review.decision !== 'pending') return state
      if (state.step === 'review') return state
      const firstTime = !state.reached.includes('review')
      return {
        ...state,
        step: 'review',
        reached: unlock(state.reached, 'review'),
        audit: firstTime ? withAudit(state, 'review_started', 'expert review opened', action.at) : state.audit,
      }
    }

    case 'SUBMIT_DECISION': {
      if (!state.reached.includes('review') || state.review.decision !== 'pending') return state
      const reason = action.reason?.trim() || null
      // Rejecting without saying why throws away the most useful feedback signal.
      if (action.decision === 'reject' && reason === null) return state

      const decision =
        action.decision === 'reject'
          ? 'rejected'
          : Object.keys(state.draft.edits).length > 0
            ? 'edited'
            : 'approved'

      const entries: FeedbackEntry[] = [
        { id: nextFeedbackId(state.feedback), kind: 'decision', sectionId: null, value: decision, at: action.at },
      ]
      if (reason) {
        entries.push({
          id: nextFeedbackId(state.feedback, 1),
          kind: 'comment',
          sectionId: null,
          value: reason,
          at: action.at,
        })
      }

      return {
        ...state,
        step: 'feedback',
        reached: unlock(state.reached, 'feedback'),
        review: { decision, reason },
        feedback: [...state.feedback, ...entries],
        audit: withAudit(state, 'decision_submitted', decision, action.at),
      }
    }

    case 'ADD_FEEDBACK': {
      if (state.draft.sections.length === 0) return state
      const value = action.value?.trim() || null

      if (action.kind === 'comment') {
        if (value === null) return state
      } else {
        // useful / not_useful rate a specific section
        if (!action.sectionId || !state.draft.sections.some((s) => s.id === action.sectionId)) {
          return state
        }
      }

      const sectionId = action.sectionId ?? null
      // One rating per section: a new rating replaces the previous one.
      const kept =
        action.kind === 'comment'
          ? state.feedback
          : state.feedback.filter(
              (f) => !(f.sectionId === sectionId && (f.kind === 'useful' || f.kind === 'not_useful')),
            )

      return {
        ...state,
        feedback: [
          ...kept,
          { id: nextFeedbackId(state.feedback), kind: action.kind, sectionId, value, at: action.at },
        ],
        audit: withAudit(state, 'feedback_added', `${action.kind}${sectionId ? ` on ${sectionId}` : ''}`, action.at),
      }
    }

    case 'GO_TO_STEP': {
      if (action.step === state.step) return state
      if (!state.reached.includes(action.step)) return state
      // While the pipeline runs, the analysis screen is the only place that makes sense.
      if (state.pipeline.status === 'running' && action.step !== 'analyze') return state
      return { ...state, step: action.step }
    }

    case 'RESET':
      return createInitialState()
  }
}

/* ---------- Selectors (derived state: never store what you can compute) ---------- */

/** Uses the Stepper's status type (type-only import) so the two can never drift apart. */
export function selectStepStatus(state: PrototypeState, step: StepId): StepStatus {
  if (step === state.step) return 'current'
  if (!state.reached.includes(step)) return 'locked'
  return STEP_IDS.indexOf(step) < STEP_IDS.indexOf(state.step) ? 'complete' : 'available'
}

export function selectDocStatus(state: PrototypeState): DocStatus {
  if (state.review.decision !== 'pending') return state.review.decision
  if (state.reached.includes('review')) return 'in_review'
  if (state.pipeline.status === 'running') return 'ai_processing'
  if (state.pipeline.status === 'done') return 'draft_ready'
  return 'not_started'
}

export const selectCanStartPipeline = (state: PrototypeState) =>
  state.documentId !== null && state.pipeline.status === 'idle'

export const selectHasDraft = (state: PrototypeState) => state.draft.sections.length > 0

export const selectHasEdits = (state: PrototypeState) => Object.keys(state.draft.edits).length > 0

/** The text the expert currently sees: their edit if any, otherwise the original AI text. */
export function selectSectionText(state: PrototypeState, sectionId: string): string {
  return state.draft.edits[sectionId] ?? state.draft.sections.find((s) => s.id === sectionId)?.text ?? ''
}
