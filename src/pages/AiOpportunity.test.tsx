import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import {
  CAPABILITIES_LABEL,
  OPPORTUNITY_HERO,
  OPPORTUNITY_NOTE,
  REASONS,
  STAGES,
  STATEMENT,
  SYSTEM_FLOW,
} from '@/content/aiOpportunity'

async function renderOpportunity() {
  const router = createMemoryRouter(routes, { initialEntries: ['/ai-opportunity'] })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}

const fullTitle = `${OPPORTUNITY_HERO.titlePrefix}${OPPORTUNITY_HERO.titleEmphasis}${OPPORTUNITY_HERO.titleSuffix}`

describe('AI Opportunity page', () => {
  it('has the eyebrow, title, subtitle and no placeholder badge', async () => {
    await renderOpportunity()
    expect(screen.getByText(OPPORTUNITY_HERO.eyebrow)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: fullTitle })).toBeInTheDocument()
    expect(screen.getByText(OPPORTUNITY_HERO.titleEmphasis, { selector: 'em' })).toBeInTheDocument()
    expect(screen.getByText(OPPORTUNITY_HERO.subtitle)).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })

  it('shows the existing and proposed workflow stages in order', async () => {
    await renderOpportunity()
    const diagram = screen.getByRole('group', { name: /opportunity/i })
    STAGES.forEach((stage) => {
      // "Draft" is deliberately the same word on both rows for one stage, so use getAllByText.
      expect(within(diagram).getAllByText(stage.existing).length).toBeGreaterThan(0)
      expect(within(diagram).getAllByText(stage.proposed).length).toBeGreaterThan(0)
    })
  })

  it('lists five AI capabilities with their description, and keeps the deeper sentence in the DOM', async () => {
    await renderOpportunity()
    const grid = screen.getByRole('list', { name: CAPABILITIES_LABEL })
    const items = within(grid).getAllByRole('listitem')
    expect(items).toHaveLength(5)
    STAGES.forEach((stage) => {
      expect(within(grid).getByText(stage.capabilityTitle)).toBeInTheDocument()
      expect(within(grid).getByText(stage.description)).toBeInTheDocument()
      // Present even before hovering: not hover-only content.
      expect(within(grid).getByText(stage.deeper)).toBeInTheDocument()
    })
  })

  it('links a workflow stage and its capability card: hovering either activates both', async () => {
    const user = userEvent.setup()
    await renderOpportunity()
    const second = STAGES[1]!

    const proposedChip = screen.getByText(second.proposed).closest('[data-active]')!
    const capabilityCard = screen.getByText(second.capabilityTitle).closest('[data-active]')!
    const otherCard = screen.getByText(STAGES[0]!.capabilityTitle).closest('[data-active]')!

    expect(proposedChip).toHaveAttribute('data-active', 'false')
    expect(capabilityCard).toHaveAttribute('data-active', 'false')

    await user.hover(proposedChip)
    expect(proposedChip).toHaveAttribute('data-active', 'true')
    expect(capabilityCard).toHaveAttribute('data-active', 'true')
    expect(otherCard).toHaveAttribute('data-active', 'false')
    await user.unhover(proposedChip)
    expect(capabilityCard).toHaveAttribute('data-active', 'false')

    await user.hover(capabilityCard)
    expect(proposedChip).toHaveAttribute('data-active', 'true')
    expect(capabilityCard).toHaveAttribute('data-active', 'true')
  })

  it('is keyboard reachable: focusing a workflow stage also activates it', async () => {
    await renderOpportunity()
    const third = STAGES[2]!
    const proposedChip = screen.getByText(third.proposed).closest('[data-active]')!
    const capabilityCard = screen.getByText(third.capabilityTitle).closest('[data-active]')!

    fireEvent.focus(proposedChip)
    expect(proposedChip).toHaveAttribute('data-active', 'true')
    expect(capabilityCard).toHaveAttribute('data-active', 'true')
    fireEvent.blur(proposedChip)
    expect(proposedChip).toHaveAttribute('data-active', 'false')
    expect(capabilityCard).toHaveAttribute('data-active', 'false')
  })

  it('shows the six-stage system flow in order with its technical captions', async () => {
    await renderOpportunity()
    const flow = screen.getByRole('list', { name: /How the AI system works/i })
    const items = within(flow).getAllByRole('listitem')
    expect(items).toHaveLength(6)
    SYSTEM_FLOW.forEach((stage, index) => {
      expect(items[index]).toHaveTextContent(stage.label)
      if (stage.caption) expect(items[index]).toHaveTextContent(stage.caption)
    })
  })

  it('gives three reasons for the approach', async () => {
    await renderOpportunity()
    for (const reason of REASONS) {
      expect(screen.getByText(reason.label)).toBeInTheDocument()
      expect(screen.getByText(reason.reason)).toBeInTheDocument()
    }
  })

  it('shows the product-principle statement and its supporting line', async () => {
    await renderOpportunity()
    expect(screen.getByText(STATEMENT.lineOne)).toBeInTheDocument()
    expect(screen.getByText(STATEMENT.lineTwo)).toBeInTheDocument()
    expect(screen.getByText(STATEMENT.support)).toBeInTheDocument()
  })

  it('states this is a proposed approach and never names a company', async () => {
    await renderOpportunity()
    expect(screen.getByText(OPPORTUNITY_NOTE)).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main.textContent).not.toMatch(/clairvolex/i)
  })

  it('does not invent numbers: no percentages or statistics appear in the page content', async () => {
    await renderOpportunity()
    const main = screen.getByRole('main')
    expect(main.textContent).not.toMatch(/\d+\s?%/)
    expect(main.textContent).not.toMatch(/\b\d+x\b/i)
  })
})
