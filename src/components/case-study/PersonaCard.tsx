import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface PersonaCardProps {
  /** Who this person is, e.g. "Patent Attorney / IP Professional" */
  role: string
  description: string
  avatar: ReactNode
  className?: string
}

/**
 * The primary user as a prominent card. The role is the heading of the card's content,
 * so pair it with a BlockHeading (e.g. "Primary User") above it.
 */
export function PersonaCard({ role, description, avatar, className }: PersonaCardProps) {
  return (
    <Card padding="md" className={cn('flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6', className)}>
      {avatar}
      <div className="min-w-0">
        <p className="font-serif text-h3 text-ink">{role}</p>
        <p className="mt-2 text-small text-ink-muted">{description}</p>
      </div>
    </Card>
  )
}
