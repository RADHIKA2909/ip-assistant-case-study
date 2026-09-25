import { ArrowRight, CornerDownRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PairedItem {
  icon: LucideIcon
  title: string
  description: string
}

export interface Pair {
  id: string
  left: PairedItem
  right: PairedItem
}

interface Side {
  title: string
  /** accent = burgundy tint (problems), success = sage tint (opportunities) */
  tone: 'accent' | 'success'
  /** Small element at the card's top right, e.g. an <IllustrativeTag label="Proposed" /> */
  tag?: ReactNode
}

interface PairedCardsProps {
  pairs: readonly Pair[]
  left: Side
  right: Side
  /** Prefix for the caption under each right-hand item, e.g. "Addresses" -> "Addresses: <left title>". Shown below `lg` and to screen readers. */
  addressesLabel: string
  className?: string
}

const styles = {
  accent: {
    card: 'border-accent-border bg-accent-soft/50',
    title: 'text-accent-strong',
    rule: 'bg-accent',
    chip: 'border-accent-border bg-accent-soft text-accent',
  },
  success: {
    card: 'border-success-border bg-success-soft/60',
    title: 'text-success',
    rule: 'bg-success',
    chip: 'border-success-border bg-success-soft text-success',
  },
} as const

/**
 * Two tinted cards whose rows correspond one to one (problem -> opportunity).
 * From `lg`, CSS subgrid aligns row i of both cards and an arrow column joins them.
 * Hovering a row highlights its counterpart (`data-active`). This is an enhancement only:
 * the pairing is always conveyed by the connector (desktop) or an "Addresses:" caption (mobile / screen readers).
 */
export function PairedCards({ pairs, left, right, addressesLabel, className }: PairedCardsProps) {
  const [active, setActive] = useState<number | null>(null)
  const leftId = useId()
  const rightId = useId()
  const vars = { '--rows': pairs.length, '--span': pairs.length + 1 } as CSSProperties

  return (
    <div
      style={vars}
      className={cn(
        'grid gap-5 lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] lg:grid-rows-[auto_repeat(var(--rows),auto)] lg:gap-y-0',
        className,
      )}
    >
      <Side
        headingId={leftId}
        side={left}
        column="lg:col-start-1"
        pairs={pairs}
        pick={(pair) => pair.left}
        active={active}
        setActive={setActive}
      />

      {/* Arrow column: decorative, the relationship is stated in text elsewhere */}
      <ul
        aria-hidden
        className="hidden lg:grid lg:col-start-2 lg:grid-rows-subgrid lg:[grid-row:2/span_var(--rows)]"
      >
        {pairs.map((pair, index) => (
          <li key={pair.id} className="grid place-items-center">
            <span
              data-active={active === index}
              className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface text-ink-subtle transition-colors duration-200 data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:text-ink-inverse"
            >
              <ArrowRight className="size-4" />
            </span>
          </li>
        ))}
      </ul>

      <Side
        headingId={rightId}
        side={right}
        column="lg:col-start-3"
        pairs={pairs}
        pick={(pair) => pair.right}
        active={active}
        setActive={setActive}
        addressesLabel={addressesLabel}
        counterpart={(pair) => pair.left.title}
      />
    </div>
  )
}

interface SideProps {
  headingId: string
  side: Side
  column: string
  pairs: readonly Pair[]
  pick: (pair: Pair) => PairedItem
  active: number | null
  setActive: (index: number | null) => void
  /** Right side only: names the item this one responds to */
  addressesLabel?: string
  counterpart?: (pair: Pair) => string
}

function Side({
  headingId,
  side,
  column,
  pairs,
  pick,
  active,
  setActive,
  addressesLabel,
  counterpart,
}: SideProps) {
  const style = styles[side.tone]
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'rounded-2xl border p-5 lg:row-start-1 lg:grid lg:grid-rows-subgrid lg:[grid-row-end:span_var(--span)]',
        style.card,
        column,
      )}
    >
      <div className="flex items-start justify-between gap-3 pb-3">
        <div>
          <h2 id={headingId} className={cn('text-h3', style.title)}>
            {side.title}
          </h2>
          <span aria-hidden className={cn('mt-2 block h-0.5 w-6 rounded-full', style.rule)} />
        </div>
        {side.tag}
      </div>

      <ul className="lg:grid lg:grid-rows-subgrid lg:[grid-row:span_var(--rows)]">
        {pairs.map((pair, index) => {
          const item = pick(pair)
          const Icon = item.icon
          return (
            <li
              key={pair.id}
              data-active={active === index}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className="-mx-3 flex items-center gap-3.5 rounded-lg border-t border-ink/10 px-3 py-2.5 transition-colors duration-200 first:border-t-0 data-[active=true]:bg-surface/80"
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full border',
                  style.chip,
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-small leading-snug font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-caption text-ink-muted">{item.description}</p>
                {counterpart && addressesLabel && (
                  <p className="mt-1.5 flex items-start gap-1 text-caption font-medium text-ink-subtle lg:sr-only">
                    <CornerDownRight aria-hidden className="mt-px size-3.5 shrink-0" />
                    <span>
                      {addressesLabel}: {counterpart(pair)}
                    </span>
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
