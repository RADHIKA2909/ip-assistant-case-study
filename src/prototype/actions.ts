import type { Dispatch } from 'react'
import type { FeedbackKind, PrototypeAction, StepId } from './types'

/**
 * Bound action helpers. They stamp each action with `Date.now()` so the reducer can stay pure.
 * UI code should call these (via usePrototype().actions) rather than dispatching raw actions.
 */
export function createActions(dispatch: Dispatch<PrototypeAction>) {
  return {
    selectDocument: (documentId: string) =>
      dispatch({ type: 'SELECT_DOCUMENT', documentId, at: Date.now() }),
    startPipeline: () => dispatch({ type: 'START_PIPELINE', at: Date.now() }),
    setActiveSource: (sourceId: string | null) =>
      dispatch({ type: 'SET_ACTIVE_SOURCE', sourceId, at: Date.now() }),
    editSection: (sectionId: string, text: string) =>
      dispatch({ type: 'EDIT_DRAFT_SECTION', sectionId, text, at: Date.now() }),
    beginReview: () => dispatch({ type: 'BEGIN_REVIEW', at: Date.now() }),
    approve: () => dispatch({ type: 'SUBMIT_DECISION', decision: 'approve', at: Date.now() }),
    reject: (reason: string) =>
      dispatch({ type: 'SUBMIT_DECISION', decision: 'reject', reason, at: Date.now() }),
    addFeedback: (kind: Exclude<FeedbackKind, 'decision'>, sectionId?: string, value?: string) =>
      dispatch({ type: 'ADD_FEEDBACK', kind, sectionId, value, at: Date.now() }),
    goToStep: (step: StepId) => dispatch({ type: 'GO_TO_STEP', step }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}

export type PrototypeActions = ReturnType<typeof createActions>
