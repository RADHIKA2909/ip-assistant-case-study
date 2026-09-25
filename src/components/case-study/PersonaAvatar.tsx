import { useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * Neutral line-art professional avatar. Deliberately abstract (no skin-tone fills, no likeness)
 * so it reads as a role, not as a real person.
 */
export function PersonaAvatar({ className }: { className?: string }) {
  const clip = useId()
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Illustration of a professional in a suit"
      className={cn('size-24 shrink-0', className)}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="48" cy="48" r="48" />
        </clipPath>
      </defs>
      <circle cx="48" cy="48" r="48" className="fill-accent-soft" />
      <g clipPath={`url(#${clip})`}>
        {/* jacket */}
        <path d="M8 100c1-20 15-32 40-32s39 12 40 32Z" className="fill-ink" />
        {/* shirt + collar */}
        <path d="M36 68l12 16 12-16Z" className="fill-surface" />
        {/* neck */}
        <path d="M42 54h12v11a6 6 0 0 1-12 0Z" className="fill-surface stroke-ink" strokeWidth="2" />
        {/* head */}
        <circle cx="48" cy="40" r="15" className="fill-surface stroke-ink" strokeWidth="2" />
        {/* hair */}
        <path
          d="M32.5 42c-1-12 6-19 15.5-19 9 0 16 6 15 17-4-1-9-4-11-9-4 6-11 10-19.5 11Z"
          className="fill-ink"
        />
      </g>
      <circle cx="48" cy="48" r="47" fill="none" className="stroke-accent-border" strokeWidth="2" />
    </svg>
  )
}
