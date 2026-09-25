import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'

export type StepStatus = 'complete' | 'current' | 'available' | 'locked'

export interface StepperItem {
  id: string
  label: string
  description?: string
  status: StepStatus
}

interface StepperProps {
  items: readonly StepperItem[]
  /** Accessible name for the step list */
  label: string
  /** When set, non-locked steps become buttons */
  onSelect?: (id: string) => void
  className?: string
}

const bar: Record<StepStatus, string> = {
  complete: 'border-accent',
  current: 'border-accent',
  available: 'border-accent-border',
  locked: 'border-border',
}

/**
 * Segmented progress: vertical rail on mobile, horizontal segments from md up.
 * Presentational only. It takes statuses, so it is reusable outside the prototype.
 */
export function Stepper({ items, label, onSelect, className }: StepperProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="grid gap-4 md:grid-flow-col md:auto-cols-fr md:gap-3">
        {items.map((item, index) => {
          const interactive = Boolean(onSelect) && item.status !== 'locked'
          const inner = (
            <>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-full font-mono text-caption',
                    item.status === 'complete' && 'bg-accent text-ink-inverse',
                    item.status === 'current' && 'bg-ink text-ink-inverse',
                    item.status === 'available' && 'bg-accent-soft text-accent-strong',
                    item.status === 'locked' && 'bg-surface-sunken text-ink-subtle',
                  )}
                >
                  {item.status === 'complete' ? (
                    <Check className="size-3" />
                  ) : item.status === 'locked' ? (
                    <Lock className="size-2.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'text-small font-medium',
                    item.status === 'locked' ? 'text-ink-subtle' : 'text-ink',
                  )}
                >
                  {item.label}
                </span>
              </span>
              {item.description && (
                <span className="mt-1 block text-caption text-ink-muted">{item.description}</span>
              )}
            </>
          )

          return (
            <li
              key={item.id}
              className={cn(
                'border-l-2 pl-4 md:border-t-2 md:border-l-0 md:pt-3 md:pl-0',
                bar[item.status],
              )}
            >
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  aria-current={item.status === 'current' ? 'step' : undefined}
                  className="w-full cursor-pointer text-left"
                >
                  {inner}
                </button>
              ) : (
                <div
                  aria-current={item.status === 'current' ? 'step' : undefined}
                  aria-disabled={item.status === 'locked' || undefined}
                >
                  {inner}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
