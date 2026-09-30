import { ArrowDown, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

export interface EvolutionStage {
  id: string
  existing: string
  proposed: string
}

interface WorkflowEvolutionProps {
  stages: readonly EvolutionStage[]
  existingLabel: string
  proposedLabel: string
  /** Small marker on each proposed chip, e.g. "AI" — a text label, not color alone. */
  assistedTag: string
  /** Accessible name for the whole diagram */
  label: string
  activeIndex: number | null
  onActiveChange: (index: number | null) => void
  className?: string
}

/**
 * Shows today's workflow evolving into the AI-assisted one: one column per stage, the existing
 * chip on top and its proposed counterpart below, joined by a connector — existing and proposed
 * always sit together, so the pairing never depends on hover or hover-linking alone.
 * Hover or focus on a column highlights it via `activeIndex`/`onActiveChange`, shared with a linked
 * component (e.g. CapabilityGrid) so the two can stay in sync.
 * Desktop (`lg+`): columns side by side. Below `lg`: stacked column groups, no horizontal scroll.
 */
export function WorkflowEvolution({
  stages,
  existingLabel,
  proposedLabel,
  assistedTag,
  label,
  activeIndex,
  onActiveChange,
  className,
}: WorkflowEvolutionProps) {
  const vars = { '--n': stages.length } as CSSProperties

  return (
    <div className={className}>
      <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-small font-medium">
        <span className="flex items-center gap-2 text-ink-muted">
          <span aria-hidden className="size-2.5 rounded-full bg-surface-sunken ring-1 ring-inset ring-border-strong" />
          {existingLabel}
        </span>
        <span className="flex items-center gap-2 text-accent-strong">
          <span aria-hidden className="size-2.5 rounded-full bg-accent" />
          {proposedLabel}
        </span>
      </div>

      <div
        aria-label={label}
        role="group"
        style={vars}
        className="flex flex-col gap-6 lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-x-6 lg:gap-y-0"
      >
        {stages.map((stage, index) => {
          const active = activeIndex === index
          return (
            <div
              key={stage.id}
              tabIndex={0}
              data-active={active}
              onMouseEnter={() => onActiveChange(index)}
              onMouseLeave={() => onActiveChange(null)}
              onFocus={() => onActiveChange(index)}
              onBlur={() => onActiveChange(null)}
              className="flex flex-col items-center gap-2 rounded-lg px-1 py-2 text-center"
            >
              <span
                className={cn(
                  'w-full rounded-lg border border-border-strong bg-surface-subtle px-3 py-2.5 text-small font-medium text-ink-muted transition-colors duration-200',
                  active && 'bg-surface',
                )}
              >
                {stage.existing}
              </span>

              <ArrowDown
                aria-hidden
                className={cn(
                  'size-4 text-ink-subtle transition-colors duration-200',
                  active && 'text-accent',
                )}
              />

              <span
                className={cn(
                  'flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent-border bg-accent-soft px-3 py-2.5 text-small font-semibold text-accent-strong transition-colors duration-200',
                  active && 'border-accent bg-accent text-ink-inverse',
                )}
              >
                {stage.proposed}
                <span
                  aria-hidden
                  className={cn(
                    'inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-accent-strong',
                    active && 'bg-ink-inverse/20 text-ink-inverse',
                  )}
                >
                  <Sparkles className="size-2.5" />
                  {assistedTag}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
