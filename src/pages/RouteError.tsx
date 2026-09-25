import { isRouteErrorResponse, useRouteError } from 'react-router'
import { pageTitle } from '@/content/site'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

/** Route-level error boundary. Renders inside AppLayout so navigation stays usable. */
export function RouteError() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <>
      <title>{pageTitle('Something went wrong')}</title>
      <Container className="py-24 md:py-32">
        <p className="text-overline text-danger uppercase">Error</p>
        <h1 className="mt-3 text-h1 text-balance">Something went wrong loading this page</h1>
        <p className="mt-4 max-w-prose font-mono text-small text-ink-muted">{detail}</p>
        <Button className="mt-8" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Container>
    </>
  )
}
