import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import {
  EVALUATION_HERO,
  EVALUATION_NOTE,
  FAILURE_MODES,
  GUARDRAILS,
  HUMAN_LOOP,
  IMPROVEMENT_LOOP,
  METRICS,
  STAGES,
} from '@/content/evaluation'

async function renderEvaluation() {
  const router = createMemoryRouter(routes, { initialEntries: ['/evaluation'] })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}

const fullTitle = `${EVALUATION_HERO.titlePrefix}${EVALUATION_HERO.titleEmphasis}${EVALUATION_HERO.titleSuffix}`

describe('Evaluation page', () => {
  it('has the eyebrow, title, subtitle and illustrative-framework badge', async () => {
    await renderEvaluation()
    expect(screen.getByText(EVALUATION_HERO.eyebrow)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: fullTitle })).toBeInTheDocument()
    expect(screen.getByText(EVALUATION_HERO.titleEmphasis, { selector: 'em' })).toBeInTheDocument()
    expect(screen.getByText(EVALUATION_HERO.subtitle)).toBeInTheDocument()
    expect(screen.getByText(EVALUATION_HERO.badge)).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })

  it('shows the 4-stage framework with its trust question per stage', async () => {
    await renderEvaluation()
    const diagram = screen.getByRole('list', { name: 'What does "good" mean?' })
    STAGES.forEach((stage) => {
      expect(within(diagram).getByText(stage.label)).toBeInTheDocument()
      expect(within(diagram).getByText(stage.question)).toBeInTheDocument()
    })
  })

  it('shows all 7 metrics with value + explanation, each tagged Illustrative, and reveals its measurement note on click', async () => {
    const user = userEvent.setup()
    await renderEvaluation()
    const grid = screen.getByRole('list', { name: /Example quality metrics/i })
    const items = within(grid).getAllByRole('listitem')
    expect(items).toHaveLength(7)

    METRICS.forEach((metric) => {
      expect(within(grid).getByText(metric.value)).toBeInTheDocument()
      expect(within(grid).getByText(metric.label)).toBeInTheDocument()
      expect(within(grid).getByText(metric.explanation)).toBeInTheDocument()
    })
    expect(within(grid).getAllByText('Illustrative')).toHaveLength(7)

    // The methodology note sits inside a native <details>, so it's present in the DOM (screen
    // readers can find it) but not visible until the disclosure opens.
    const first = METRICS[0]!
    expect(screen.getByText(first.howWeMeasure)).not.toBeVisible()
    await user.click(within(grid).getAllByText('How would we measure this?')[0]!)
    expect(screen.getByText(first.howWeMeasure)).toBeVisible()
  })

  it('shows the human-in-the-loop flow and its highlight', async () => {
    await renderEvaluation()
    const diagram = screen.getByRole('list', { name: 'Human-in-the-loop' })
    HUMAN_LOOP.forEach((node) => expect(within(diagram).getByText(node.label)).toBeInTheDocument())
    expect(screen.getByText('Human review is part of the product design — not a fallback.')).toBeInTheDocument()
  })

  it('shows all 5 guardrails and all 5 failure modes', async () => {
    await renderEvaluation()
    GUARDRAILS.forEach((g) => expect(screen.getByText(g.title)).toBeInTheDocument())
    FAILURE_MODES.forEach((f) => {
      expect(screen.getByText(f.failure)).toBeInTheDocument()
      expect(screen.getByText(f.expectedBehaviour)).toBeInTheDocument()
    })
  })

  it('hovering a failure with a related guardrail cross-highlights both, and shows the relation as text', async () => {
    const user = userEvent.setup()
    await renderEvaluation()

    const lowConfidenceRow = screen.getByText('Low confidence').closest('[data-active]')!
    const escalationCard = screen.getByText('Confidence / Escalation').closest('[data-active]')!
    const otherCard = screen.getByText('Data Isolation').closest('[data-active]')!

    expect(lowConfidenceRow).toHaveAttribute('data-active', 'false')
    expect(escalationCard).toHaveAttribute('data-active', 'false')
    expect(screen.getByText(/Guardrail: Confidence \/ Escalation/)).toBeInTheDocument()

    await user.hover(lowConfidenceRow)
    expect(lowConfidenceRow).toHaveAttribute('data-active', 'true')
    expect(escalationCard).toHaveAttribute('data-active', 'true')
    expect(otherCard).toHaveAttribute('data-active', 'false')
    await user.unhover(lowConfidenceRow)
    expect(escalationCard).toHaveAttribute('data-active', 'false')

    // And the reverse direction: hovering the guardrail highlights the failure.
    await user.hover(escalationCard)
    expect(lowConfidenceRow).toHaveAttribute('data-active', 'true')
  })

  it('hovering "Incorrect draft" highlights no guardrail, and it says why', async () => {
    const user = userEvent.setup()
    await renderEvaluation()
    const row = screen.getByText('Incorrect draft').closest('[data-active]')!
    expect(screen.getByText(/Caught by expert review, not an automated guardrail/)).toBeInTheDocument()

    await user.hover(row)
    for (const g of GUARDRAILS) {
      expect(screen.getByText(g.title).closest('[data-active]')).toHaveAttribute('data-active', 'false')
    }
  })

  it('"Data Isolation" is never highlighted by any failure mode', async () => {
    const user = userEvent.setup()
    await renderEvaluation()
    const dataIsolation = screen.getByText('Data Isolation').closest('[data-active]')!
    for (const failure of FAILURE_MODES) {
      const row = screen.getByText(failure.failure).closest('[data-active]')!
      await user.hover(row)
      expect(dataIsolation).toHaveAttribute('data-active', 'false')
      await user.unhover(row)
    }
  })

  it('shows the continuous-improvement loop', async () => {
    await renderEvaluation()
    const diagram = screen.getByRole('list', { name: 'Continuous improvement' })
    IMPROVEMENT_LOOP.forEach((node) => expect(within(diagram).getByText(node.label)).toBeInTheDocument())
    expect(screen.getByText('Measure → Learn → Improve')).toBeInTheDocument()
  })

  it('states this is a proposed framework and never names a company', async () => {
    await renderEvaluation()
    expect(screen.getByText(EVALUATION_NOTE)).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main.textContent).not.toMatch(/clairvolex/i)
  })

  it('does not invent numbers beyond the labelled illustrative metrics', async () => {
    await renderEvaluation()
    const main = screen.getByRole('main')
    // Strip the 7 known illustrative values first, then check nothing else looks like a stat.
    const knownValues = METRICS.map((m) => m.value)
    let text = main.textContent ?? ''
    for (const value of knownValues) text = text.split(value).join('')
    expect(text).not.toMatch(/\d+\s?%/)
    expect(text).not.toMatch(/\$\d/)
  })
})
