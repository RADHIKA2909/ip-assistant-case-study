import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StatementBannerProps {
  lines: readonly [ReactNode, ReactNode]
  support: ReactNode
  className?: string
}

/**
 * A large two-line editorial statement on a strong ink-dark block, meant to be one of the visual
 * highlights of a page — heavier than PrincipleCallout's small soft-tinted quote. Reusable
 * wherever a page wants one strong closing statement (e.g. an Evaluation or TPM pull-quote).
 */
export function StatementBanner({ lines, support, className }: StatementBannerProps) {
  return (
    <figure
      className={cn(
        'rounded-2xl bg-ink px-6 py-12 text-center sm:px-12 sm:py-16',
        className,
      )}
    >
      <blockquote className="mx-auto max-w-3xl font-serif text-h1 text-balance text-ink-inverse">
        <span className="block">{lines[0]}</span>
        <span className="block text-accent-soft italic">{lines[1]}</span>
      </blockquote>
      <figcaption className="mx-auto mt-6 max-w-xl text-small text-ink-inverse/70">
        {support}
      </figcaption>
    </figure>
  )
}
