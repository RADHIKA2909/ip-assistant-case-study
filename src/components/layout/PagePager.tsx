import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SECTIONS, type SectionId } from '@/content/site'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/Card'

/** Previous / next links, generated from SECTIONS. The first page links back to the overview. */
export function PagePager({ sectionId }: { sectionId: SectionId }) {
  const index = SECTIONS.findIndex((section) => section.id === sectionId)
  const previous = index > 0 ? SECTIONS[index - 1] : undefined
  const next = SECTIONS[index + 1]

  const prevLink = previous
    ? { to: previous.path, eyebrow: `${previous.number} · Previous`, title: previous.title }
    : { to: '/', eyebrow: 'Overview', title: 'Back to the start' }

  return (
    <nav aria-label="Case study pages" className="grid gap-4 sm:grid-cols-2">
      <PagerLink {...prevLink} direction="previous" />
      {next ? (
        <PagerLink
          to={next.path}
          eyebrow={`${next.number} · Next`}
          title={next.title}
          direction="next"
        />
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
    </nav>
  )
}

function PagerLink({
  to,
  eyebrow,
  title,
  direction,
}: {
  to: string
  eyebrow: string
  title: string
  direction: 'previous' | 'next'
}) {
  const next = direction === 'next'
  return (
    <Card interactive padding="none">
      <Link
        to={to}
        className={cn(
          'flex h-full items-center gap-4 rounded-xl p-5',
          next && 'justify-end text-right',
        )}
      >
        {!next && <ArrowLeft aria-hidden className="size-4 shrink-0 text-ink-subtle" />}
        <span>
          <span className="block text-overline text-ink-subtle uppercase">{eyebrow}</span>
          <span className="mt-1 block text-body font-semibold text-ink">{title}</span>
        </span>
        {next && <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-subtle" />}
      </Link>
    </Card>
  )
}
