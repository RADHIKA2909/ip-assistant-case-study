import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import { GOALS, PAIRS, PERSONA, PROBLEM_HERO, PROBLEM_NOTE, WORKFLOW } from '@/content/problem'

async function renderProblem() {
  const router = createMemoryRouter(routes, { initialEntries: ['/problem'] })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: /Understanding the Problem/ })
}

describe('Problem page', () => {
  it('has the eyebrow, title, subtitle and no placeholder badge', async () => {
    await renderProblem()
    expect(screen.getByText(PROBLEM_HERO.eyebrow)).toBeInTheDocument()
    // The emphasized word is an <em>; the accessible name is still the full title.
    expect(screen.getByRole('heading', { level: 1, name: '1. Understanding the Problem' })).toBeInTheDocument()
    expect(screen.getByText(PROBLEM_HERO.titleEmphasis, { selector: 'em' })).toBeInTheDocument()
    expect(screen.getByText(PROBLEM_HERO.subtitle)).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })

  it('shows the primary user and their four goals', async () => {
    await renderProblem()
    expect(screen.getByRole('heading', { name: PERSONA.label })).toBeInTheDocument()
    expect(screen.getByText(PERSONA.role)).toBeInTheDocument()
    expect(screen.getByText(PERSONA.description)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Key Goals' })).toBeInTheDocument()
    expect(GOALS).toHaveLength(4)
    for (const goal of GOALS) expect(screen.getByText(goal.text)).toBeInTheDocument()
  })

  it('lists the five workflow steps in order and flags the information-heavy ones', async () => {
    await renderProblem()
    const list = screen.getByRole('list', { name: /Current Workflow/ })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(5)
    WORKFLOW.forEach((step, index) => {
      expect(items[index]).toHaveTextContent(step.title)
      expect(items[index]).toHaveTextContent(String(index + 1).padStart(2, '0'))
    })
    // Steps 2-4 carry the heavy chip (visible below lg, read by screen readers at lg).
    const heavy = items.filter((item) => within(item).queryByText('Information-heavy steps'))
    expect(heavy).toHaveLength(WORKFLOW.filter((s) => s.heavy).length)
    expect(heavy).toHaveLength(3)
  })

  it('pairs five pain points with five AI opportunities, each marked as a proposed framing', async () => {
    await renderProblem()
    const pains = screen.getByRole('region', { name: 'Key Pain Points' })
    const opportunities = screen.getByRole('region', { name: 'Opportunity Areas for AI' })
    expect(within(pains).getAllByRole('listitem')).toHaveLength(5)
    expect(within(opportunities).getAllByRole('listitem')).toHaveLength(5)
    expect(within(pains).getByText('Proposed')).toBeInTheDocument()
    expect(within(opportunities).getByText('Proposed')).toBeInTheDocument()

    for (const pair of PAIRS) {
      expect(within(pains).getByText(pair.pain.title)).toBeInTheDocument()
      expect(within(opportunities).getByText(pair.opportunity.title)).toBeInTheDocument()
      // Every opportunity names the pain point it addresses (screen readers / small screens).
      expect(within(opportunities).getByText(`Addresses: ${pair.pain.title}`)).toBeInTheDocument()
    }
  })

  it('highlights the paired opportunity when a pain point is hovered', async () => {
    const user = userEvent.setup()
    await renderProblem()
    const pains = screen.getByRole('region', { name: 'Key Pain Points' })
    const opportunities = screen.getByRole('region', { name: 'Opportunity Areas for AI' })
    const second = PAIRS[1]!

    const painRow = within(pains).getByText(second.pain.title).closest('li')!
    const oppRow = within(opportunities).getByText(second.opportunity.title).closest('li')!
    const otherRow = within(opportunities).getByText(PAIRS[0]!.opportunity.title).closest('li')!

    expect(oppRow).toHaveAttribute('data-active', 'false')
    await user.hover(painRow)
    expect(painRow).toHaveAttribute('data-active', 'true')
    expect(oppRow).toHaveAttribute('data-active', 'true')
    expect(otherRow).toHaveAttribute('data-active', 'false')
    await user.unhover(painRow)
    expect(oppRow).toHaveAttribute('data-active', 'false')
  })

  it('states that this is framing, not internal company data', async () => {
    await renderProblem()
    expect(screen.getByText(PROBLEM_NOTE)).toBeInTheDocument()
  })

  it('does not invent numbers: no percentages or statistics appear in the page content', async () => {
    await renderProblem()
    const main = screen.getByRole('main')
    expect(main.textContent).not.toMatch(/\d+\s?%/)
    expect(main.textContent).not.toMatch(/\b\d+x\b/i)
  })
})
