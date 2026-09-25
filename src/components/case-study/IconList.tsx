import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface IconListProps {
  items: readonly { icon: LucideIcon; text: string }[]
  /** 2 = two columns from `sm` up */
  columns?: 1 | 2
  className?: string
}

/** Short statements, each with an icon in a soft accent circle. For goals, benefits, principles. */
export function IconList({ items, columns = 1, className }: IconListProps) {
  return (
    <ul className={cn('grid gap-x-8 gap-y-4', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-3.5">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent"
          >
            <Icon className="size-[18px]" />
          </span>
          <span className="text-small leading-snug font-medium text-ink">{text}</span>
        </li>
      ))}
    </ul>
  )
}
