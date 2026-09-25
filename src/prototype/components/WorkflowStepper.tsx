import { Stepper } from '@/components/ui/Stepper'
import { selectStepStatus } from '../reducer'
import { STEP_META } from '../steps'
import { STEP_IDS, type StepId } from '../types'
import { usePrototype } from '../usePrototype'

/** The prototype's progress bar, bound to shared state. Locked steps cannot be opened. */
export function WorkflowStepper({ className }: { className?: string }) {
  const { state, actions } = usePrototype()

  const items = STEP_IDS.map((id) => ({
    id,
    label: STEP_META[id].label,
    description: STEP_META[id].description,
    status: selectStepStatus(state, id),
  }))

  return (
    <Stepper
      label="Prototype workflow"
      items={items}
      onSelect={(id) => actions.goToStep(id as StepId)}
      className={className}
    />
  )
}
