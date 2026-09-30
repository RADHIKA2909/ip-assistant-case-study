import { useState } from 'react'
import { CapabilityGrid } from '@/components/case-study/CapabilityGrid'
import { ContextNote } from '@/components/case-study/ContextNote'
import { FlowDiagram, type FlowNode } from '@/components/case-study/FlowDiagram'
import { StatementBanner } from '@/components/case-study/StatementBanner'
import { WorkflowEvolution } from '@/components/case-study/WorkflowEvolution'
import { BlockHeading } from '@/components/layout/BlockHeading'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import {
  AI_ASSISTED_TAG,
  CAPABILITIES_LABEL,
  CAPABILITIES_NOTE,
  EXISTING_ROW_LABEL,
  OPPORTUNITY_HERO,
  OPPORTUNITY_NOTE,
  PROPOSED_ROW_LABEL,
  REASONS,
  REASONS_LABEL,
  STAGES,
  STATEMENT,
  SYSTEM_FLOW,
  SYSTEM_FLOW_LABEL,
  SYSTEM_FLOW_NOTE,
  WORKFLOW_EVOLUTION_LABEL,
} from '@/content/aiOpportunity'
import { getSection, pageTitle } from '@/content/site'

const section = getSection('ai-opportunity')

const evolutionStages = STAGES.map(({ id, existing, proposed }) => ({ id, existing, proposed }))
const capabilities = STAGES.map(({ id, icon, capabilityTitle, description, deeper }) => ({
  id,
  icon,
  title: capabilityTitle,
  description,
  deeper,
}))
const systemFlowNodes: FlowNode[] = SYSTEM_FLOW.map(({ id, label, caption, tone }) => ({
  id,
  label,
  caption,
  tone,
}))

/** Stagger for the entrance animation, so blocks arrive top to bottom. */
const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` })

/**
 * Page 2: where AI genuinely helps in the workflow from Page 1, how the system works at a
 * product level, why this approach (RAG / agentic / human-in-the-loop), and the guiding principle.
 */
export function AiOpportunity() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      <title>{pageTitle(section.title)}</title>

      <PageHeader
        compact
        eyebrow={OPPORTUNITY_HERO.eyebrow}
        title={
          <>
            {OPPORTUNITY_HERO.titlePrefix}
            <em>{OPPORTUNITY_HERO.titleEmphasis}</em>
            {OPPORTUNITY_HERO.titleSuffix}
          </>
        }
        lead={OPPORTUNITY_HERO.subtitle}
      />

      <Section className="animate-rise py-6 md:py-8" style={rise(120)}>
        <BlockHeading id="evolution-title" title="The opportunity" />
        <WorkflowEvolution
          stages={evolutionStages}
          existingLabel={EXISTING_ROW_LABEL}
          proposedLabel={PROPOSED_ROW_LABEL}
          assistedTag={AI_ASSISTED_TAG}
          label={WORKFLOW_EVOLUTION_LABEL}
          activeIndex={active}
          onActiveChange={setActive}
        />
      </Section>

      <Section
        aria-labelledby="capabilities-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(200)}
      >
        <BlockHeading id="capabilities-title" title={CAPABILITIES_LABEL} note={CAPABILITIES_NOTE} />
        <CapabilityGrid
          items={capabilities}
          label={CAPABILITIES_LABEL}
          activeIndex={active}
          onActiveChange={setActive}
        />
      </Section>

      <Section
        aria-labelledby="system-flow-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(280)}
      >
        <BlockHeading id="system-flow-title" title={SYSTEM_FLOW_LABEL} note={SYSTEM_FLOW_NOTE} />
        <FlowDiagram nodes={systemFlowNodes} direction="horizontal" label={SYSTEM_FLOW_LABEL} />
      </Section>

      <Section
        aria-labelledby="reasons-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(340)}
      >
        <BlockHeading id="reasons-title" title={REASONS_LABEL} />
        <ul className="grid gap-6 sm:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon
            return (
              <li
                key={reason.label}
                className={index > 0 ? 'sm:border-l sm:border-border sm:pl-6' : ''}
              >
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent"
                >
                  <Icon className="size-[18px]" />
                </span>
                <p className="mt-3 text-small font-semibold text-ink">{reason.label}</p>
                <p className="mt-1 text-small text-ink-muted">{reason.reason}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section className="animate-rise border-t border-border py-6 md:py-8" style={rise(400)}>
        <StatementBanner lines={[STATEMENT.lineOne, STATEMENT.lineTwo]} support={STATEMENT.support} />
      </Section>

      <Section tone="subtle" className="py-6 md:py-8">
        <ContextNote className="mb-6">{OPPORTUNITY_NOTE}</ContextNote>
        <PagePager sectionId="ai-opportunity" />
      </Section>
    </>
  )
}
