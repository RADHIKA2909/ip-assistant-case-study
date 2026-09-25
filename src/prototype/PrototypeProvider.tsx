import { useMemo, useReducer, type ReactNode } from 'react'
import { createActions } from './actions'
import { PrototypeContext } from './PrototypeContext'
import { createInitialState, prototypeReducer } from './reducer'
import { usePipelineRunner } from './usePipelineRunner'

/**
 * Owns the prototype state. Mounted once in AppLayout so state survives navigation between routes
 * (e.g. leaving /prototype to read /evaluation, then coming back).
 * State is in-memory only: a full page refresh starts the workflow over.
 */
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(prototypeReducer, undefined, createInitialState)
  const actions = useMemo(() => createActions(dispatch), [])

  usePipelineRunner(state, dispatch)

  const value = useMemo(() => ({ state, actions, dispatch }), [state, actions])
  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}
