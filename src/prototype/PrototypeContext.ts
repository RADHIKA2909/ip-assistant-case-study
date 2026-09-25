import { createContext, type Dispatch } from 'react'
import type { PrototypeActions } from './actions'
import type { PrototypeAction, PrototypeState } from './types'

export interface PrototypeContextValue {
  state: PrototypeState
  /** Bound, timestamped helpers. Prefer these in UI code. */
  actions: PrototypeActions
  /** Raw dispatch, for tests and rare cases. */
  dispatch: Dispatch<PrototypeAction>
}

export const PrototypeContext = createContext<PrototypeContextValue | null>(null)
