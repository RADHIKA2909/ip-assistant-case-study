import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardElement = 'div' | 'section' | 'article' | 'aside' | 'li'

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  as?: CardElement
  /** default: white surface + hairline + soft shadow. subtle: tinted, flat. */
  variant?: 'default' | 'subtle'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Adds hover/focus-within lift. Use when the whole card is a link or button. */
  interactive?: boolean
}

const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' } as const

export function Card({
  as = 'div',
  variant = 'default',
  padding = 'md',
  interactive,
  className,
  ...rest
}: CardProps) {
  const Tag = as as ElementType
  return (
    <Tag
      className={cn(
        'rounded-xl border border-border',
        variant === 'default' ? 'bg-surface shadow-card' : 'bg-surface-subtle',
        paddings[padding],
        interactive &&
          'transition duration-200 ease-soft hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised focus-within:border-border-strong',
        className,
      )}
      {...rest}
    />
  )
}

interface CardHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Right-aligned slot, e.g. a badge or button */
  action?: ReactNode
  headingLevel?: 'h2' | 'h3' | 'h4'
  className?: string
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
  headingLevel: Heading = 'h3',
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-overline text-ink-subtle uppercase">{eyebrow}</p>}
        <Heading className="text-h3 text-ink">{title}</Heading>
        {description && <p className="mt-1 text-small text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
