import { SITE } from '@/content/site'
import { Container } from './Container'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-subtle">
      <Container className="flex flex-col gap-2 py-8 text-caption text-ink-muted sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="max-w-prose">{SITE.disclaimer}</p>
        <p className="shrink-0 font-medium text-ink">{SITE.conceptName}</p>
      </Container>
    </footer>
  )
}
