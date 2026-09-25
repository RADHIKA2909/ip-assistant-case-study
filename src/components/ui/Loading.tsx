import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Indeterminate spinner for AI processing states. Announces itself to screen readers. */
export function Spinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span role="status" className="inline-flex items-center">
      <LoaderCircle aria-hidden className={cn('size-4 animate-spin text-accent', className)} />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Placeholder block while content is being generated. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-surface-sunken', className)} />
}
