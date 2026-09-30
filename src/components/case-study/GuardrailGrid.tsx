import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { Guardrail } from '@/content/evaluation'

interface GuardrailGridProps {
  items: readonly Guardrail[]
  label: string
  highlightedIds: ReadonlySet<string>
  onHover: (id: string | null) => void
}

/**
 * Five guardrail cards. `highlightedIds` is computed by the page (it can include zero, one, or
 * several ids - see CLAUDE.md on why the failure<->guardrail relation isn't a forced 1:1 pairing),
 * not just "the one item this component itself is hovering".
 */
export function GuardrailGrid({ items, label, highlightedIds, onHover }: GuardrailGridProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon
        const active = highlightedIds.has(item.id)
        return (
          <li key={item.id}>
            <Card
              as="article"
              padding="sm"
              tabIndex={0}
              data-active={active}
              onMouseEnter={() => onHover(item.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(item.id)}
              onBlur={() => onHover(null)}
              className={cn(
                'h-full outline-none transition-colors duration-200 ease-soft',
                active && 'border-accent-border bg-accent-soft/40',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-10 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent transition-colors duration-200',
                  active && 'border-accent bg-accent text-ink-inverse',
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <p className="mt-3 text-small font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-caption text-ink-muted">{item.description}</p>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
