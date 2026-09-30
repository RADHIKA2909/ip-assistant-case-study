import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DisclosureProps {
  summary: ReactNode
  children: ReactNode
  /** Starts open */
  defaultOpen?: boolean
  className?: string
}

/**
 * Native <details>/<summary> expandable section: free keyboard support (Enter/Space toggles,
 * it's in the tab order) and screen-reader semantics, no JS state needed.
 */
export function Disclosure({ summary, children, defaultOpen, className }: DisclosureProps) {
  return (
    <details open={defaultOpen} className={cn('group', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-small font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-ink-subtle transition-transform duration-200 ease-soft group-open:rotate-180"
        />
        {summary}
      </summary>
      <div className="mt-3 pl-6">{children}</div>
    </details>
  )
}
