import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

interface PageHeaderProps {
  /** Small label above the title, e.g. "AI Product Case Study" */
  eyebrow: ReactNode
  /** Wrap one word in <em> for the accent-colored italic emphasis, e.g. <>Understanding the <em>Problem</em></> */
  title: ReactNode
  lead?: ReactNode
  /** Slot below the lead: badges, actions, meta */
  children?: ReactNode
  /** Right-hand visual. Two columns from md up; hidden on phones so the title stays first. */
  aside?: ReactNode
  /** Tighter vertical padding, for pages that want the first content block above the fold */
  compact?: boolean
}

/** Standard page opener. Every case-study page starts with exactly one of these (it owns the h1). */
export function PageHeader({ eyebrow, title, lead, children, aside, compact }: PageHeaderProps) {
  return (
    <header className="border-b border-border">
      <Container
        className={cn(
          compact ? 'py-8 md:py-10' : 'py-12 md:py-16',
          aside &&
            'grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16',
        )}
      >
        <div className="animate-rise">
          <p className="text-overline text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-h1 text-balance">{title}</h1>
          {lead && <p className="mt-4 max-w-prose text-lead text-ink-muted">{lead}</p>}
          {children}
        </div>
        {aside && (
          <div className="hidden animate-rise md:block" style={{ animationDelay: '120ms' }}>
            {aside}
          </div>
        )}
      </Container>
    </header>
  )
}
