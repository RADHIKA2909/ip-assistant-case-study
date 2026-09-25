import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { toneSolid, toneSoft, type Tone } from './tones'

/** Dots need to stay visible on their own tinted background, so neutral and ink get explicit colors. */
const dotColor: Record<Tone, string> = {
  ...toneSolid,
  neutral: 'bg-ink-subtle',
  ink: 'bg-ink-inverse',
}

interface BadgeProps {
  tone?: Tone
  /** Leading status dot */
  dot?: boolean
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', dot, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium whitespace-nowrap',
        toneSoft[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn('size-1.5 rounded-full', dotColor[tone])}
        />
      )}
      {children}
    </span>
  )
}
