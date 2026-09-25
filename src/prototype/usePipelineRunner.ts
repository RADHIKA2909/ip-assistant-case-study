import { useEffect, type Dispatch } from 'react'
import { getMockResult } from './mock/seed'
import { PIPELINE_STAGES, type PipelineStage, type PrototypeAction, type PrototypeState } from './types'

/** How long each simulated stage takes. Long enough to read, short enough not to bore. */
export const STAGE_DURATION_MS: Record<PipelineStage, number> = {
  parsing: 900,
  embedding: 900,
  retrieving: 900,
  drafting: 1200,
}

/**
 * Drives the fake AI pipeline. While `pipeline.status === 'running'` it schedules the next stage;
 * after the last stage it delivers the mock result. Timers are cleared on every change and on unmount.
 *
 * This is the seam for a real backend: replace `getMockResult` with an API call and dispatch
 * PIPELINE_DONE with its response. The reducer and UI stay the same.
 */
export function usePipelineRunner(state: PrototypeState, dispatch: Dispatch<PrototypeAction>) {
  const { status, stage } = state.pipeline
  const { documentId } = state

  useEffect(() => {
    if (status !== 'running' || stage === null || documentId === null) return

    const timer = setTimeout(() => {
      const next = PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage) + 1]
      if (next) {
        dispatch({ type: 'PIPELINE_STAGE', stage: next, at: Date.now() })
      } else {
        const { sources, sections } = getMockResult(documentId)
        dispatch({ type: 'PIPELINE_DONE', sources, sections, at: Date.now() })
      }
    }, STAGE_DURATION_MS[stage])

    return () => clearTimeout(timer)
  }, [status, stage, documentId, dispatch])
}
