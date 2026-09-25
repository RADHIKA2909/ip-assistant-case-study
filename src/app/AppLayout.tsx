import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PrototypeProvider } from '@/prototype/PrototypeProvider'

/**
 * App shell shared by every route. Owns:
 *  - the skip link and the <main> landmark
 *  - moving keyboard/screen-reader focus to <main> after client-side navigation
 *  - PrototypeProvider, so prototype state survives navigation between pages
 */
export function AppLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(pathname)

  useEffect(() => {
    // Skip the initial load (and StrictMode's double effect); only react to real navigations.
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <PrototypeProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-small font-medium text-ink-inverse focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <ScrollRestoration />
    </PrototypeProvider>
  )
}
