import {
  createInitialState,
  prototypeReducer,
  selectDocStatus,
  selectHasEdits,
  selectSectionText,
  selectStepStatus,
} from './reducer'
import { getMockResult } from './mock/seed'
import type { PrototypeAction, PrototypeState } from './types'

const AT = 1_000
const DOC = 'EX-0001'

/** Apply a list of actions in order. */
function run(actions: PrototypeAction[], from: PrototypeState = createInitialState()) {
  return actions.reduce(prototypeReducer, from)
}

const select: PrototypeAction = { type: 'SELECT_DOCUMENT', documentId: DOC, at: AT }
const start: PrototypeAction = { type: 'START_PIPELINE', at: AT }
const done = (): PrototypeAction => ({ type: 'PIPELINE_DONE', ...getMockResult(DOC), at: AT })
const review: PrototypeAction = { type: 'BEGIN_REVIEW', at: AT }

/** A state with a finished pipeline and a draft, ready for review. */
const withDraft = () => run([select, start, done()])
/** A state where the expert has opened review. */
const inReview = () => run([review], withDraft())

describe('initial state', () => {
  it('starts on the select step with only that step reached', () => {
    const s = createInitialState()
    expect(s.step).toBe('select')
    expect(s.reached).toEqual(['select'])
    expect(selectDocStatus(s)).toBe('not_started')
  })
})

describe('document selection and pipeline', () => {
  it('cannot start the pipeline without a document', () => {
    const s = createInitialState()
    expect(prototypeReducer(s, start)).toBe(s)
  })

  it('selecting a document records it and adds an audit event', () => {
    const s = run([select])
    expect(s.documentId).toBe(DOC)
    expect(s.audit.map((e) => e.type)).toEqual(['document_selected'])
  })

  it('re-selecting the same document is a no-op', () => {
    const s = run([select])
    expect(prototypeReducer(s, select)).toBe(s)
  })

  it('starting the pipeline moves to analyze and marks the document as processing', () => {
    const s = run([select, start])
    expect(s.step).toBe('analyze')
    expect(s.pipeline).toEqual({ status: 'running', stage: 'parsing' })
    expect(selectDocStatus(s)).toBe('ai_processing')
  })

  it('cannot start the pipeline twice', () => {
    const s = run([select, start])
    expect(prototypeReducer(s, start)).toBe(s)
  })

  it('cannot change document while the pipeline is running', () => {
    const s = run([select, start])
    expect(prototypeReducer(s, { type: 'SELECT_DOCUMENT', documentId: 'EX-0002', at: AT })).toBe(s)
  })

  it('advances through stages and ignores stage updates when not running', () => {
    const idle = createInitialState()
    expect(prototypeReducer(idle, { type: 'PIPELINE_STAGE', stage: 'embedding', at: AT })).toBe(idle)

    const s = run([select, start, { type: 'PIPELINE_STAGE', stage: 'embedding', at: AT }])
    expect(s.pipeline.stage).toBe('embedding')
  })

  it('completing the pipeline delivers sources and a draft and unlocks evidence and draft, not review', () => {
    const s = withDraft()
    expect(s.pipeline).toEqual({ status: 'done', stage: null })
    expect(s.sources.length).toBeGreaterThan(0)
    expect(s.draft.sections.length).toBeGreaterThan(0)
    expect(s.reached).toEqual(['select', 'analyze', 'retrieve', 'draft'])
    expect(s.step).toBe('analyze') // unlocked, but not auto-navigated
    expect(selectDocStatus(s)).toBe('draft_ready')
  })

  it('ignores PIPELINE_DONE when the pipeline is not running', () => {
    const s = createInitialState()
    expect(prototypeReducer(s, done())).toBe(s)
  })

  it('selecting a different document afterwards resets everything downstream', () => {
    const s = run([{ type: 'SELECT_DOCUMENT', documentId: 'EX-0002', at: AT }], withDraft())
    expect(s.documentId).toBe('EX-0002')
    expect(s.sources).toEqual([])
    expect(s.draft.sections).toEqual([])
    expect(s.reached).toEqual(['select'])
    expect(s.pipeline.status).toBe('idle')
  })
})

describe('step navigation guards', () => {
  it('cannot jump to a locked step', () => {
    const s = createInitialState()
    expect(prototypeReducer(s, { type: 'GO_TO_STEP', step: 'review' })).toBe(s)
    expect(selectStepStatus(s, 'review')).toBe('locked')
  })

  it('can move between reached steps and reports complete / current / available', () => {
    const s = run([{ type: 'GO_TO_STEP', step: 'retrieve' }], withDraft())
    expect(s.step).toBe('retrieve')
    expect(selectStepStatus(s, 'select')).toBe('complete')
    expect(selectStepStatus(s, 'analyze')).toBe('complete')
    expect(selectStepStatus(s, 'retrieve')).toBe('current')
    expect(selectStepStatus(s, 'draft')).toBe('available')
    expect(selectStepStatus(s, 'review')).toBe('locked')
  })

  it('only the analyze screen is reachable while the pipeline runs', () => {
    const s = run([select, start])
    expect(prototypeReducer(s, { type: 'GO_TO_STEP', step: 'select' })).toBe(s)
  })
})

describe('source inspection', () => {
  it('sets an existing source active and records the inspection', () => {
    const base = withDraft()
    const id = base.sources[0]!.id
    const s = run([{ type: 'SET_ACTIVE_SOURCE', sourceId: id, at: AT }], base)
    expect(s.activeSourceId).toBe(id)
    expect(s.audit.at(-1)?.type).toBe('source_inspected')
  })

  it('ignores unknown sources and allows clearing', () => {
    const base = withDraft()
    expect(prototypeReducer(base, { type: 'SET_ACTIVE_SOURCE', sourceId: 'nope', at: AT })).toBe(base)

    const active = run([{ type: 'SET_ACTIVE_SOURCE', sourceId: base.sources[0]!.id, at: AT }], base)
    const cleared = prototypeReducer(active, { type: 'SET_ACTIVE_SOURCE', sourceId: null, at: AT })
    expect(cleared.activeSourceId).toBeNull()
  })
})

describe('expert review', () => {
  it('cannot begin review without a draft', () => {
    const s = createInitialState()
    expect(prototypeReducer(s, review)).toBe(s)
  })

  it('beginning review unlocks review and marks the document in review', () => {
    const s = inReview()
    expect(s.step).toBe('review')
    expect(s.reached).toContain('review')
    expect(selectDocStatus(s)).toBe('in_review')
  })

  it('editing a section keeps the original AI text and shows the edit', () => {
    const base = inReview()
    const section = base.draft.sections[0]!
    const s = run([{ type: 'EDIT_DRAFT_SECTION', sectionId: section.id, text: 'Expert wording.', at: AT }], base)
    expect(selectSectionText(s, section.id)).toBe('Expert wording.')
    expect(s.draft.sections[0]!.text).toBe(section.text) // original preserved
    expect(selectHasEdits(s)).toBe(true)
  })

  it('reverting an edit to the AI text removes it', () => {
    const base = inReview()
    const section = base.draft.sections[0]!
    const edited = run([{ type: 'EDIT_DRAFT_SECTION', sectionId: section.id, text: 'Changed', at: AT }], base)
    const reverted = prototypeReducer(edited, {
      type: 'EDIT_DRAFT_SECTION',
      sectionId: section.id,
      text: section.text,
      at: AT,
    })
    expect(selectHasEdits(reverted)).toBe(false)
  })

  it('ignores edits to unknown sections', () => {
    const base = inReview()
    expect(prototypeReducer(base, { type: 'EDIT_DRAFT_SECTION', sectionId: 'nope', text: 'x', at: AT })).toBe(base)
  })

  it('approving without edits is "approved" and moves to feedback', () => {
    const s = run([{ type: 'SUBMIT_DECISION', decision: 'approve', at: AT }], inReview())
    expect(s.review.decision).toBe('approved')
    expect(s.step).toBe('feedback')
    expect(selectDocStatus(s)).toBe('approved')
    expect(s.feedback.map((f) => f.kind)).toEqual(['decision'])
  })

  it('approving after edits is "edited" (approved with edits)', () => {
    const base = inReview()
    const id = base.draft.sections[0]!.id
    const s = run(
      [
        { type: 'EDIT_DRAFT_SECTION', sectionId: id, text: 'Expert wording.', at: AT },
        { type: 'SUBMIT_DECISION', decision: 'approve', at: AT },
      ],
      base,
    )
    expect(s.review.decision).toBe('edited')
    expect(selectDocStatus(s)).toBe('edited')
  })

  it('rejecting requires a reason', () => {
    const base = inReview()
    expect(prototypeReducer(base, { type: 'SUBMIT_DECISION', decision: 'reject', at: AT })).toBe(base)
    expect(prototypeReducer(base, { type: 'SUBMIT_DECISION', decision: 'reject', reason: '   ', at: AT })).toBe(base)
  })

  it('rejecting with a reason records the decision and the reason as feedback', () => {
    const s = run([{ type: 'SUBMIT_DECISION', decision: 'reject', reason: ' Missed a citation ', at: AT }], inReview())
    expect(s.review).toEqual({ decision: 'rejected', reason: 'Missed a citation' })
    expect(s.feedback.map((f) => f.kind)).toEqual(['decision', 'comment'])
    expect(new Set(s.feedback.map((f) => f.id)).size).toBe(2)
  })

  it('a decision is final: no second decision and no further edits', () => {
    const decided = run([{ type: 'SUBMIT_DECISION', decision: 'approve', at: AT }], inReview())
    expect(prototypeReducer(decided, { type: 'SUBMIT_DECISION', decision: 'reject', reason: 'x', at: AT })).toBe(decided)
    const id = decided.draft.sections[0]!.id
    expect(prototypeReducer(decided, { type: 'EDIT_DRAFT_SECTION', sectionId: id, text: 'late', at: AT })).toBe(decided)
  })

  it('cannot decide before review has begun', () => {
    const base = withDraft()
    expect(prototypeReducer(base, { type: 'SUBMIT_DECISION', decision: 'approve', at: AT })).toBe(base)
  })
})

describe('feedback', () => {
  it('needs a draft to attach feedback to', () => {
    const s = createInitialState()
    expect(prototypeReducer(s, { type: 'ADD_FEEDBACK', kind: 'comment', value: 'hi', at: AT })).toBe(s)
  })

  it('a new rating for a section replaces the previous one, and ids never collide', () => {
    const base = inReview()
    const id = base.draft.sections[0]!.id
    const s = run(
      [
        { type: 'ADD_FEEDBACK', kind: 'useful', sectionId: id, at: AT },
        { type: 'ADD_FEEDBACK', kind: 'not_useful', sectionId: id, at: AT },
        { type: 'ADD_FEEDBACK', kind: 'comment', value: 'Needs a citation', at: AT },
      ],
      base,
    )
    expect(s.feedback.map((f) => f.kind)).toEqual(['not_useful', 'comment'])
    expect(new Set(s.feedback.map((f) => f.id)).size).toBe(s.feedback.length)
  })

  it('ratings need a real section and comments need text', () => {
    const base = inReview()
    expect(prototypeReducer(base, { type: 'ADD_FEEDBACK', kind: 'useful', sectionId: 'nope', at: AT })).toBe(base)
    expect(prototypeReducer(base, { type: 'ADD_FEEDBACK', kind: 'useful', at: AT })).toBe(base)
    expect(prototypeReducer(base, { type: 'ADD_FEEDBACK', kind: 'comment', value: '  ', at: AT })).toBe(base)
  })
})

describe('reset', () => {
  it('returns to the initial state from anywhere', () => {
    const s = run([{ type: 'RESET' }], inReview())
    expect(s).toEqual(createInitialState())
  })
})
