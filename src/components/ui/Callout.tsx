import { CircleCheck, Info, OctagonAlert, Sparkles, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { toneSoft, type Tone } from './tones'

const defaultIcons: Record<Tone, LucideIcon> = {
  neutral: Info,
  accent: Sparkles,
  ink: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: OctagonAlert,
  info: Info,
}

interface CalloutProps {
  tone?: Tone
  icon?: LucideIcon
  title?: ReactNode
  className?: string
  children?: ReactNode
}

export function Callout({ tone = 'info', icon, title, className, children }: CalloutProps) {
  const Icon = icon ?? defaultIcons[tone]
  return (
    <div
      role="note"
      className={cn('flex gap-3 rounded-lg border p-4 text-small', toneSoft[tone], className)}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-1', 'opacity-90')}>{children}</div>}
      </div>
    </div>
  )
}
