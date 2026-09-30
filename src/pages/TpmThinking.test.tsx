import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import {
  FINAL_PRINCIPLE,
  ITERATE_NOTE,
  LATER_ITEMS,
  MVP_ITEMS,
  MVP_NOTE,
  NORTH_STAR,
  PRIORITIZATION_EXAMPLES,
  RISKS,
  SUPPORTING_METRICS,
  TPM_HERO,
  TPM_NOTE,
  USAGE_CAVEAT,
  VALIDATION_STEPS,
} from '@/content/tpmThinking'

async function renderTpm() {
  const router = createMemoryRouter(routes, { initialEntries: ['/tpm-thinking'] })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}

const fullTitle = `${TPM_HERO.titlePrefix}${TPM_HERO.titleEmphasis}${TPM_HERO.titleSuffix}`

describe('TPM Thinking page', () => {
  it('has the eyebrow, title and subtitle', async () => {
    await renderTpm()
    expect(screen.getByText(TPM_HERO.eyebrow)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: fullTitle })).toBeInTheDocument()
    expect(screen.getByText(TPM_HERO.titleEmphasis, { selector: 'em' })).toBeInTheDocument()
    expect(screen.getByText(TPM_HERO.subtitle)).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })

  it('lists all MVP and Later scope items, and the scope note', async () => {
    await renderTpm()
    MVP_ITEMS.forEach((item) => expect(screen.getByText(item.text)).toBeInTheDocument())
    LATER_ITEMS.forEach((item) => expect(screen.getByText(item.text)).toBeInTheDocument())
    expect(screen.getByText(MVP_NOTE)).toBeInTheDocument()
  })

  it('shows the 4 prioritization criteria and all 3 worked reasoning examples', async () => {
    await renderTpm()
    PRIORITIZATION_EXAMPLES.forEach((example) => {
      example.conditions.forEach((condition) => expect(screen.getAllByText(condition).length).toBeGreaterThan(0))
      expect(screen.getByText(example.conclusion)).toBeInTheDocument()
    })
    // "MVP" legitimately appears twice: Section 1's card eyebrow, and this row's tag badge.
    expect(screen.getAllByText('MVP').length).toBeGreaterThanOrEqual(2)
  })

  it('shows the North Star, all 8 supporting metrics with their definitions always visible, and the usage caveat', async () => {
    await renderTpm()
    expect(screen.getByText(NORTH_STAR)).toBeInTheDocument()
    SUPPORTING_METRICS.forEach((metric) => {
      expect(screen.getByText(metric.label)).toBeInTheDocument()
      // No hover needed: definitions are not gated behind an interaction on this page.
      expect(screen.getByText(metric.definition)).toBeVisible()
    })
    expect(screen.getByText(USAGE_CAVEAT)).toBeInTheDocument()
  })

  it('shows all 6 risks with their mitigations always visible (never gated behind hover)', async () => {
    await renderTpm()
    RISKS.forEach((r) => {
      expect(screen.getByText(r.risk)).toBeInTheDocument()
      expect(screen.getByText(r.mitigation)).toBeVisible()
    })
    // The hover/focus tint itself is pure CSS with no React state or DOM attribute behind it
    // (deliberately: nothing here relates to anything else on the page), so there's nothing
    // meaningful to assert via jsdom - it's checked visually in a real browser instead.
  })

  it('shows the 4 validation steps in order and the iterate note', async () => {
    await renderTpm()
    const diagram = screen.getByRole('list', { name: 'How I would validate it' })
    const items = within(diagram).getAllByRole('listitem')
    VALIDATION_STEPS.forEach((step, index) => {
      expect(items[index]).toHaveTextContent(step.label)
      expect(items[index]).toHaveTextContent(step.action)
    })
    expect(screen.getByText(ITERATE_NOTE)).toBeInTheDocument()
  })

  it('shows the final principle: the discouraged question, the encouraged question, and the support line', async () => {
    await renderTpm()
    expect(screen.getByText(FINAL_PRINCIPLE.avoidLead)).toBeInTheDocument()
    // Rendered inside curly quotes ("“…”"), and the question itself has regex
    // metacharacters (a literal "?"), so match by substring rather than an exact/regex string.
    expect(
      screen.getByText((_, el) => el?.textContent === `“${FINAL_PRINCIPLE.avoidQuestion}”`),
    ).toBeInTheDocument()
    expect(screen.getByText(FINAL_PRINCIPLE.preferLead)).toBeInTheDocument()
    expect(screen.getByText(FINAL_PRINCIPLE.support)).toBeInTheDocument()
  })

  it('frames this as a proposed approach and never names a company', async () => {
    await renderTpm()
    expect(screen.getByText(TPM_NOTE)).toBeInTheDocument()
    expect(screen.getByText(/proposed approach/i)).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main.textContent).not.toMatch(/clairvolex/i)
  })

  it('is the last page: the pager offers no "next" card', async () => {
    await renderTpm()
    const pager = screen.getByRole('navigation', { name: 'Case study pages' })
    expect(within(pager).getByRole('link', { name: /Evaluation & Safety/ })).toHaveAttribute('href', '/evaluation')
    expect(within(pager).queryAllByRole('link')).toHaveLength(1)
  })
})
