import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export interface Capability {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** One extra sentence, revealed when the card is hovered, focused or made active. */
  deeper: string
}

interface CapabilityGridProps {
  items: readonly Capability[]
  label: string
  activeIndex: number | null
  onActiveChange: (index: number | null) => void
  className?: string
}

/**
 * Five capability cards. The `deeper` sentence stays in the DOM at all times (so it reaches
 * screen readers and simple text search) but is visually collapsed until the card becomes
 * active — by its own hover/focus, or via `activeIndex` set by a linked component elsewhere
 * on the page (e.g. WorkflowEvolution), so hovering either side highlights both.
 */
export function CapabilityGrid({ items, label, activeIndex, onActiveChange, className }: CapabilityGridProps) {
  return (
    <ul
      aria-label={label}
      className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5', className)}
    >
      {items.map((item, index) => {
        const Icon = item.icon
        const active = activeIndex === index
        return (
          <li key={item.id}>
            <Card
              as="article"
              padding="sm"
              tabIndex={0}
              data-active={active}
              onMouseEnter={() => onActiveChange(index)}
              onMouseLeave={() => onActiveChange(null)}
              onFocus={() => onActiveChange(index)}
              onBlur={() => onActiveChange(null)}
              className={cn(
                'h-full transition-colors duration-200 ease-soft',
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
              <p
                className={cn(
                  'grid text-caption font-medium text-accent-strong transition-[grid-template-rows,opacity,margin-top] duration-200 ease-soft',
                  active
                    ? 'mt-2 grid-rows-[1fr] opacity-100'
                    : 'mt-0 grid-rows-[0fr] opacity-0',
                )}
              >
                <span className="overflow-hidden">{item.deeper}</span>
              </p>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
