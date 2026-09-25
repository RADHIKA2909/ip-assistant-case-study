import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface BlockHeadingProps {
  title: ReactNode
  /** Right-aligned supporting sentence (wraps under the title on narrow screens) */
  note?: ReactNode
  as?: 'h2' | 'h3'
  id?: string
  className?: string
}

/**
 * Compact serif heading for a block inside a page (smaller than SectionHeading):
 * title, a short accent rule beneath it, and an optional note on the right.
 */
export function BlockHeading({ title, note, as: Heading = 'h2', id, className }: BlockHeadingProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2', className)}>
      <div>
        <Heading id={id} className="text-h3 text-ink">
          {title}
        </Heading>
        <span aria-hidden className="mt-2 block h-0.5 w-6 rounded-full bg-accent" />
      </div>
      {note && <p className="max-w-xl text-small text-ink-muted sm:text-right">{note}</p>}
    </div>
  )
}
