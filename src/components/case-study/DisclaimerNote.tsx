import { Callout } from '@/components/ui/Callout'

/**
 * Local reminder that what is shown is a proposal with made-up data.
 * Use next to the prototype, sample metrics, or any invented output.
 */
export function DisclaimerNote({ className }: { className?: string }) {
  return (
    <Callout tone="neutral" title="Proposed concept, illustrative data" className={className}>
      Everything here is a design proposal using illustrative example data. It does not describe any
      company&rsquo;s actual product, architecture or results.
    </Callout>
  )
}
