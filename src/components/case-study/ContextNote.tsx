import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Small, quiet provenance note. Visible, but never competes with the page content. */
export function ContextNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 text-caption text-ink-subtle', className)}>
      <Info aria-hidden className="mt-px size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
