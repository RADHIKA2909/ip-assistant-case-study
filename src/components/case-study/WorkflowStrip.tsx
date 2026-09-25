import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export interface WorkflowStep {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** Information-heavy step. Heavy steps must be contiguous; they are bracketed together. */
  heavy?: boolean
}

interface WorkflowStripProps {
  steps: readonly WorkflowStep[]
  /** Accessible name for the list */
  label: string
  /** Text on the bracket under the heavy steps (desktop) and on each heavy step's chip (smaller screens) */
  heavyLabel?: string
}

/**
 * A user's journey as numbered steps with icon badges and arrows.
 * From `lg`: one row of columns (CSS subgrid keeps titles and descriptions aligned across steps),
 * arrows between them, and a bracket under the heavy steps. The badge sits above the title at `lg`
 * and beside it from `xl`. Below `lg`: a vertical rail with a chip on each heavy step.
 */
export function WorkflowStrip({ steps, label, heavyLabel = 'Information-heavy' }: WorkflowStripProps) {
  const first = steps.findIndex((step) => step.heavy)
  const last = steps.findLastIndex((step) => step.heavy)
  const columns = { '--n': steps.length } as CSSProperties

  return (
    <div>
      <ol
        aria-label={label}
        style={columns}
        className="flex flex-col gap-6 lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:grid-rows-[auto_auto_auto] lg:gap-x-8 lg:gap-y-0 xl:grid-rows-[auto_auto] xl:gap-x-10"
      >
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <li
              key={step.id}
              className="group relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 after:absolute after:top-[3.75rem] after:-bottom-6 after:left-7 after:w-px after:bg-border-strong last:after:hidden lg:grid-cols-1 lg:grid-rows-subgrid lg:[grid-row:span_3] lg:after:hidden xl:grid-cols-[auto_1fr] xl:[grid-row:span_2]"
            >
              <span
                aria-hidden
                className="grid size-14 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent transition-colors duration-200 ease-soft group-hover:border-accent group-hover:bg-accent group-hover:text-ink-inverse"
              >
                <Icon className="size-6" />
              </span>

              <div className="self-center">
                <p className="font-mono text-caption text-ink-subtle">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="text-small leading-snug font-semibold text-ink">{step.title}</p>
              </div>

              <div className="col-start-2 lg:col-span-1 lg:col-start-1 xl:col-span-2">
                <p className="text-small text-ink-muted">{step.description}</p>
                {step.heavy && (
                  <span className="mt-2 inline-block lg:sr-only">
                    <Badge tone="accent">{heavyLabel}</Badge>
                  </span>
                )}
              </div>

              {!isLast && (
                <ArrowRight
                  aria-hidden
                  className="absolute top-[1.125rem] -right-[1.625rem] hidden size-5 text-ink-subtle lg:block xl:-right-[1.875rem]"
                />
              )}
            </li>
          )
        })}
      </ol>

      {first !== -1 && (
        <div
          aria-hidden
          style={columns}
          className="mt-4 hidden lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-x-8 xl:gap-x-10"
        >
          <div style={{ gridColumn: `${first + 1} / ${last + 2}` }}>
            <div className="h-2.5 rounded-b-md border-x border-b border-accent-border" />
            <p className="mt-2 text-center text-caption font-medium text-accent-strong">
              {heavyLabel}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
