import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/cn'

type Label = 'Illustrative' | 'Example' | 'Proposed'

const HINT: Record<Label, string> = {
  Illustrative: 'Made-up data shown for demonstration. Not real or measured.',
  Example: 'Example content shown for demonstration.',
  Proposed: 'A proposed design for this case study, not an existing implementation.',
}

/**
 * Required marker for any invented number, data, or behaviour.
 * Dashed border makes it visually distinct from status badges.
 */
export function IllustrativeTag({
  label = 'Illustrative',
  className,
}: {
  label?: Label
  className?: string
}) {
  return (
    <span
      title={HINT[label]}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-dashed border-border-strong bg-surface px-2 py-0.5 text-caption font-medium whitespace-nowrap text-ink-muted',
        className,
      )}
    >
      <FlaskConical aria-hidden className="size-3" />
      {label}
    </span>
  )
}
