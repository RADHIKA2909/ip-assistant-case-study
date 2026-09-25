import { Scale } from 'lucide-react'
import { SITE } from '@/content/site'
import { cn } from '@/lib/cn'

/** The product's guiding principle as a quiet, prominent statement. */
export function PrincipleCallout({ className }: { className?: string }) {
  return (
    <figure className={cn('flex gap-4 rounded-xl border border-accent-border bg-accent-soft p-5', className)}>
      <Scale aria-hidden className="mt-1 size-5 shrink-0 text-accent" />
      <div>
        <p className="text-overline text-accent-strong uppercase">Guiding principle</p>
        <blockquote className="mt-1 text-lead font-medium text-ink">{SITE.principle}</blockquote>
      </div>
    </figure>
  )
}
