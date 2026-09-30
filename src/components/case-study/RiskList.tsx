import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface RiskItem {
  id: string
  icon: LucideIcon
  risk: string
  mitigation: string
}

interface RiskListProps {
  items: readonly RiskItem[]
  label: string
}

/**
 * Risk -> mitigation, one row each. Both sides are always visible (never hidden behind hover -
 * hover/focus only adds a self-contained tint via `group`, no JS state, no relation to anything
 * else on the page). Risk uses the accent tint, mitigation the success tint - the same
 * risk/positive convention Pages 1 and 4 already use. Desktop: aligned grid rows.
 * Below `lg`: stacked cards.
 */
export function RiskList({ items, label }: RiskListProps) {
  return (
    <ol aria-label={label} className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <li
            key={item.id}
            tabIndex={0}
            className="group grid gap-3 rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-soft hover:border-border-strong hover:bg-surface-subtle focus-visible:border-border-strong focus-visible:bg-surface-subtle sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4"
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent"
              >
                <Icon className="size-4" />
              </span>
              <p className="text-small font-semibold text-accent-strong">{item.risk}</p>
            </div>

            <ArrowRight aria-hidden className="hidden size-4 shrink-0 text-ink-subtle lg:block" />

            <p className="text-small text-success">{item.mitigation}</p>
          </li>
        )
      })}
    </ol>
  )
}
