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

  // Match by regex: a page may prefix its own numbering, e.g. "1. Understanding the Problem".
  it.each(SECTIONS.map((s) => [s.path, s.title] as const))('renders %s', async (path, title) => {
    renderAt(path)
    expect(
      await screen.findByRole('heading', { level: 1, name: new RegExp(title) }),
    ).toBeInTheDocument()
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
      expect(within(nav).getByRole('link', { name: new RegExp(section.shortTitle, 'i') })).toHaveAttribute(
        'href',
        section.path,
      )
    }

    await user.click(within(nav).getByRole('link', { name: /evaluation/i }))
    await screen.findByRole('heading', { level: 1, name: /Evaluation & Safety/ })
    expect(within(desktopNav()).getByRole('link', { name: /evaluation/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('main')).toHaveFocus()
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
    await screen.findByRole('heading', { level: 1, name: /AI Product Opportunity/ })
    const pager = screen.getByRole('navigation', { name: 'Case study pages' })
    expect(within(pager).getByRole('link', { name: /Understanding the Problem/ })).toHaveAttribute('href', '/problem')
    expect(within(pager).getByRole('link', { name: /Interactive AI Product Experience/ })).toHaveAttribute(
      'href',
      '/prototype',
    )
  })
})

describe('prototype state is shared across routes', () => {
  it('keeps the selected document after navigating away and back', async () => {
    const user = userEvent.setup()
    renderAt('/prototype')
    await screen.findByRole('heading', { level: 1, name: /Interactive AI Product Experience/ })

    expect(screen.getByText('None selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /select example document/i }))
    expect(screen.getByText(/Adaptive wearable sensor patch/)).toBeInTheDocument()

    await user.click(within(desktopNav()).getByRole('link', { name: /problem/i }))
    await screen.findByRole('heading', { level: 1, name: /Understanding the Problem/ })

    await user.click(within(desktopNav()).getByRole('link', { name: /prototype/i }))
    await screen.findByRole('heading', { level: 1, name: /Interactive AI Product Experience/ })
    expect(screen.getByText(/Adaptive wearable sensor patch/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByText('None selected')).toBeInTheDocument()
  })

  it('runs the simulated pipeline to completion and keeps locked steps locked', async () => {
    const user = userEvent.setup()
    renderAt('/prototype')
    await screen.findByRole('heading', { level: 1, name: /Interactive AI Product Experience/ })
    await user.click(screen.getByRole('button', { name: /select example document/i }))

    // Review is locked until the draft exists and review begins.
    const stepper = screen.getByRole('navigation', { name: 'Prototype workflow' })
    expect(within(stepper).queryByRole('button', { name: /expert review/i })).not.toBeInTheDocument()

    // Fake timers only after the async route loading is done.
    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /run ai pipeline/i }))
    expect(screen.getByText('AI processing')).toBeInTheDocument()

    for (const stage of PIPELINE_STAGES) {
      act(() => {
        vi.advanceTimersByTime(STAGE_DURATION_MS[stage])
      })
    }

    expect(screen.getByText('Draft ready')).toBeInTheDocument()
    expect(screen.getByText('3 sources')).toBeInTheDocument()
    expect(within(stepper).getByRole('button', { name: /evidence/i })).toBeInTheDocument()
    expect(within(stepper).queryByRole('button', { name: /expert review/i })).not.toBeInTheDocument()
  })
})
