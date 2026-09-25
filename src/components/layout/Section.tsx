import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** subtle: tinted full-bleed band, useful for separating page regions */
  tone?: 'plain' | 'subtle'
}

/** Full-width page region with consistent vertical rhythm. Content is constrained by Container. */
export function Section({ tone = 'plain', className, children, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        'py-12 md:py-20',
        tone === 'subtle' && 'border-y border-border bg-surface-subtle',
        className,
      )}
      {...rest}
    >
      <Container>{children}</Container>
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  as?: 'h2' | 'h3'
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 max-w-3xl md:mb-10', className)}>
      {eyebrow && <p className="mb-3 text-overline text-accent uppercase">{eyebrow}</p>}
      <Heading id={id} className={Heading === 'h2' ? 'text-h2 text-balance' : 'text-h3'}>
        {title}
      </Heading>
      {description && <p className="mt-3 max-w-prose text-lead text-ink-muted">{description}</p>}
    </div>
  )
}
