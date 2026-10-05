import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { SECTIONS } from '@/content/site'
import { STAGE_DURATION_MS } from '@/prototype/usePipelineRunner'
import { PIPELINE_STAGES } from '@/prototype/types'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

const desktopNav = () => screen.getByRole('navigation', { name: 'Case study sections' })

afterEach(() => {
  vi.useRealTimers()
})

describe('routing', () => {
  it('renders the home page', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { level: 1, name: /shows its evidence/i })).toBeInTheDocument()
  })

  // Pages with their own editorial H1 copy (checked exactly in their own test file) don't
  // necessarily contain the nav title verbatim - just assert an h1 renders. Placeholder pages
  // still render `section.title` as their h1, so match it by regex (a page may prefix its own
  // numbering, e.g. "1. Understanding the Problem").
  const CUSTOM_HEADING_SECTIONS: readonly string[] = [
    'problem',
    'ai-opportunity',
    'prototype',
    'evaluation',
    'tpm-thinking',
  ]
  it.each(SECTIONS.map((s) => [s.id, s.path, s.title] as const))('renders %s', async (id, path, title) => {
    renderAt(path)
    if (CUSTOM_HEADING_SECTIONS.includes(id)) {
      expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    } else {
      expect(
        await screen.findByRole('heading', { level: 1, name: new RegExp(title) }),
      ).toBeInTheDocument()
    }
  })

  it('renders a not-found page for unknown paths, inside the app shell', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { level: 1, name: /does not exist/i })).toBeInTheDocument()
    expect(desktopNav()).toBeInTheDocument()
  })

  it('has the accessibility landmarks on every page', async () => {
    renderAt('/problem')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('main')).toBeInTheDocument()
    // dom-testing-library counts every <header> as a banner; browsers do not count the ones inside
    // <main> (HTML-AAM). So assert the site header specifically: the banner that holds the nav.
    const banners = screen.getAllByRole('banner')
    expect(banners.some((banner) => banner.contains(desktopNav()))).toBe(true)
    expect(banners.some((banner) => screen.getByRole('main').contains(banner))).toBe(true) // page header lives in <main>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('links every section from the header, marks the current one, and moves focus to <main> on navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByRole('heading', { level: 1 })

    const nav = desktopNav()
    for (const section of SECTIONS) {
      // Anchored: "Product" is now a substring of "AI Product Opportunity", so an unanchored match is ambiguous.
      expect(within(nav).getByRole('link', { name: new RegExp(`^${section.number}\\s*${section.shortTitle}$`, 'i') })).toHaveAttribute(
        'href',
        section.path,
      )
    }

    await user.click(within(nav).getByRole('link', { name: /evaluation/i }))
    await screen.findByRole('heading', { level: 1, name: /measurable/i })
    expect(within(desktopNav()).getByRole('link', { name: /evaluation/i })).toHaveAttribute('aria-current', 'page')
  })

  it('has an Overview link back to Home, current only on "/" and not on other pages', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    const overview = within(desktopNav()).getByRole('link', { name: 'Overview' })
    expect(overview).toHaveAttribute('href', '/')
    expect(overview).toHaveAttribute('aria-current', 'page')

    // Navigate the same way a real user (and every other test here) does: click a nav link.
    // Calling the router's own .navigate() directly isn't act()-wrapped and leaves NavLink's
    // active-state stuck on a stale render when asserted on synchronously afterward.
    await user.click(within(desktopNav()).getByRole('link', { name: /problem/i }))
    await screen.findByRole('heading', { level: 1, name: /Understanding the Problem/ })
    expect(within(desktopNav()).getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current')
  })

  it('toggles the mobile menu, closes it on Escape, and closes it after choosing a page', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByRole('heading', { level: 1 })

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(within(screen.getByRole('navigation', { name: /mobile/i })).getByRole('link', { name: /problem/i }))
    await screen.findByRole('heading', { level: 1, name: /Understanding the Problem/ })
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument()
  })

  it('offers previous and next links generated from SECTIONS', async () => {
    renderAt('/ai-opportunity')
    await screen.findByRole('heading', { level: 1, name: /information overload/i })
    const pager = screen.getByRole('navigation', { name: 'Case study pages' })
    expect(within(pager).getByRole('link', { name: /Understanding the Problem/ })).toHaveAttribute('href', '/problem')
    expect(within(pager).getByRole('link', { name: /Interactive AI Product Experience/ })).toHaveAttribute(
      'href',
      '/prototype',
    )
  })
})

describe('prototype state is shared across routes', () => {
  it('keeps the analyzed draft after navigating away and back', async () => {
    const user = userEvent.setup()
    renderAt('/prototype')
    await screen.findByRole('heading', { level: 1, name: /expert-validated output/i })

    expect(screen.getByRole('button', { name: /analyze this document/i })).toBeInTheDocument()
    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /analyze this document/i }))
    for (const stage of PIPELINE_STAGES) {
      act(() => {
        vi.advanceTimersByTime(STAGE_DURATION_MS[stage])
      })
    }
    expect(screen.getByRole('heading', { level: 2, name: 'Draft Response' })).toBeInTheDocument()
    vi.useRealTimers()

    await user.click(within(desktopNav()).getByRole('link', { name: /problem/i }))
    await screen.findByRole('heading', { level: 1, name: /Understanding the Problem/ })

    await user.click(within(desktopNav()).getByRole('link', { name: /^03\s*product/i }))
    await screen.findByRole('heading', { level: 1, name: /expert-validated output/i })
    expect(screen.getByRole('heading', { level: 2, name: 'Draft Response' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /analyze this document/i })).not.toBeInTheDocument()
  })

  it('runs the simulated pipeline to completion and reveals the evidence and draft', async () => {
    renderAt('/prototype')
    await screen.findByRole('heading', { level: 1, name: /expert-validated output/i })

    // Before analysis: no evidence, no draft yet.
    expect(screen.queryByText('Relevant evidence')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Draft Response' })).not.toBeInTheDocument()

    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /analyze this document/i }))
    expect(screen.getByText(/AI processing/i)).toBeInTheDocument()

    for (const stage of PIPELINE_STAGES) {
      act(() => {
        vi.advanceTimersByTime(STAGE_DURATION_MS[stage])
      })
    }

    expect(screen.getByText('Relevant evidence')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Draft Response' })).toBeInTheDocument()
    expect(screen.getByText(/3 source documents/i)).toBeInTheDocument()
  })
})
