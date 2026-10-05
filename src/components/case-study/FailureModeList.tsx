import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { RELATED_GUARDRAIL_LABEL, type FailureMode, type Guardrail } from '@/content/evaluation'

interface FailureModeListProps {
  items: readonly FailureMode[]
  guardrails: readonly Guardrail[]
  label: string
  highlightedIds: ReadonlySet<string>
  onHover: (id: string | null) => void
}

/**
 * Failure -> expected behaviour, one row each (not two separate cards like PairedCards - the
 * failure and its behaviour belong together in a single row/card here). Failure side uses the
 * accent tint (this page's brief asks for burgundy on risk/failure concepts, echoing Page 1's
 * accent-for-problem convention); expected behaviour uses the success tint. The related-guardrail
 * caption is always visible text, not hover-only - hover/focus is only an added cross-highlight
 * with GuardrailGrid via `highlightedIds` (computed by the page, not always 1:1 - see CLAUDE.md).
 * Desktop: one shared column track on the list, inherited by each row via subgrid, so the arrows
 * line up vertically whatever the length of each failure title. Below `lg`: stacked cards.
 */
export function FailureModeList({ items, guardrails, label, highlightedIds, onHover }: FailureModeListProps) {
  return (
    <ol aria-label={label} className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:gap-x-4">
      {items.map((item) => {
        const Icon = item.icon
        const active = highlightedIds.has(item.id)
        const relatedTitles = item.relatedGuardrailIds
          .map((id) => guardrails.find((g) => g.id === id)?.title)
          .filter((title): title is string => Boolean(title))

        return (
          <li
            key={item.id}
            tabIndex={0}
            data-active={active}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(item.id)}
            onBlur={() => onHover(null)}
            className={cn(
              'grid gap-3 rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-soft sm:p-5 lg:col-span-full lg:grid-cols-subgrid lg:items-center lg:gap-x-4',
              active && 'border-border-strong bg-surface-subtle',
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent"
              >
                <Icon className="size-4" />
              </span>
              <p className="text-small font-semibold text-accent-strong">{item.failure}</p>
            </div>

            <ArrowRight aria-hidden className="hidden size-4 shrink-0 text-ink-subtle lg:block" />

            <p className="text-small text-success">{item.expectedBehaviour}</p>

            <div className="lg:text-right">
              {relatedTitles.length > 0 ? (
                <p className="text-caption text-ink-subtle">
                  {RELATED_GUARDRAIL_LABEL}: {relatedTitles.join(', ')}
                </p>
              ) : (
                <p className="text-caption text-ink-subtle">Caught by expert review, not an automated guardrail.</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
