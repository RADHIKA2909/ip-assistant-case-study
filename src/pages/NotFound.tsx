import { ArrowLeft } from 'lucide-react'
import { pageTitle } from '@/content/site'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <>
      <title>{pageTitle('Page not found')}</title>
      <Container className="py-24 md:py-32">
        <p className="text-overline text-accent uppercase">404</p>
        <h1 className="mt-3 text-h1 text-balance">This page does not exist</h1>
        <p className="mt-4 max-w-prose text-lead text-ink-muted">
          The link may be wrong, or the page may have moved.
        </p>
        <Button to="/" className="mt-8" iconLeft={<ArrowLeft aria-hidden className="size-4" />}>
          Back to the overview
        </Button>
      </Container>
    </>
  )
}
