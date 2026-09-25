import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface OwnProps {
  variant?: Variant
  size?: Size
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  children?: ReactNode
}

type ButtonAsButton = OwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof OwnProps> & { to?: undefined }
type ButtonAsLink = OwnProps & Omit<LinkProps, keyof OwnProps> & { to: LinkProps['to'] }

/** Renders a <button>, or a router <Link> when `to` is given. */
export type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none transition-colors duration-150 ease-soft aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-ink-inverse hover:bg-ink/85',
  accent: 'bg-accent text-ink-inverse hover:bg-accent-strong',
  secondary: 'border border-border-strong bg-surface text-ink hover:bg-surface-subtle',
  ghost: 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
  danger: 'border border-danger-border bg-danger-soft text-danger hover:bg-danger-soft/60',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-small',
  md: 'h-10 px-4 text-small',
  lg: 'h-12 px-6 text-body',
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  )

  if (rest.to !== undefined) {
    return (
      <Link {...(rest as Omit<ButtonAsLink, keyof OwnProps>)} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" {...(rest as Omit<ButtonAsButton, keyof OwnProps>)} className={classes}>
      {content}
    </button>
  )
}
