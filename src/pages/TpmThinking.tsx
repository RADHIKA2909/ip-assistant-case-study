import { ArrowRight } from 'lucide-react'
import { ContextNote } from '@/components/case-study/ContextNote'
import { FlowDiagram, type FlowNode } from '@/components/case-study/FlowDiagram'
import { IconList } from '@/components/case-study/IconList'
import { RiskList } from '@/components/case-study/RiskList'
import { BlockHeading } from '@/components/layout/BlockHeading'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { Card, CardHeader } from '@/components/ui/Card'
import {
  CRITERIA,
  FINAL_PRINCIPLE,
  ITERATE_NOTE,
  LATER_ICON,
  LATER_ITEMS,
  LATER_LABEL,
  LATER_TITLE,
  METRICS_LABEL,
  MVP_ICON,
  MVP_ITEMS,
  MVP_LABEL,
  MVP_NOTE,
  MVP_TITLE,
  NORTH_STAR,
  NORTH_STAR_LABEL,
  PRIORITIZATION_EXAMPLES,
  PRIORITIZATION_LABEL,
  RISKS,
  RISKS_LABEL,
  SUPPORTING_METRICS,
  SUPPORTING_METRICS_LABEL,
  TPM_HERO,
  TPM_NOTE,
  USAGE_CAVEAT,
  VALIDATION_LABEL,
  VALIDATION_STEPS,
} from '@/content/tpmThinking'
import { getSection, pageTitle } from '@/content/site'

const section = getSection('tpm-thinking')

const mvpItems = MVP_ITEMS.map((item) => ({ icon: MVP_ICON, text: item.text }))
const laterItems = LATER_ITEMS.map((item) => ({ icon: LATER_ICON, text: item.text }))
const criteriaItems = CRITERIA.map((c) => ({ icon: c.icon, text: c.text }))

const validationNodes: FlowNode[] = VALIDATION_STEPS.map((step) => ({
  id: step.id,
  label: step.label,
  description: step.action,
  tone: 'accent',
}))

/** Stagger for the entrance animation, so blocks arrive top to bottom. */
const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` })

/**
 * Page 5, the last conceptual page: MVP vs later scope, how to prioritise, what success looks
 * like, the key risks and their mitigations, how to validate the approach, and the closing
 * product principle.
 */
export function TpmThinking() {
  return (
    <>
      <title>{pageTitle(section.title)}</title>

      <PageHeader
        compact
        eyebrow={TPM_HERO.eyebrow}
        title={
          <>
            {TPM_HERO.titlePrefix}
            <em>{TPM_HERO.titleEmphasis}</em>
            {TPM_HERO.titleSuffix}
          </>
        }
        lead={TPM_HERO.subtitle}
      />

      <Section className="animate-rise py-6 md:py-8" style={rise(100)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="md">
            <CardHeader headingLevel="h2" eyebrow={MVP_LABEL} title={MVP_TITLE} />
            <IconList items={mvpItems} className="mt-4" />
          </Card>
          <Card padding="md" variant="subtle">
            <CardHeader headingLevel="h2" eyebrow={LATER_LABEL} title={LATER_TITLE} />
            <IconList items={laterItems} className="mt-4" />
          </Card>
        </div>
        <p className="mt-5 text-small font-medium text-ink">{MVP_NOTE}</p>
      </Section>

      <Section
        aria-labelledby="prioritization-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(160)}
      >
        <BlockHeading id="prioritization-title" title={PRIORITIZATION_LABEL} />
        <IconList items={criteriaItems} columns={2} />

        <ul className="mt-6 flex flex-col gap-2.5">
          {PRIORITIZATION_EXAMPLES.map((example) => (
            <li
              key={example.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-3.5 sm:p-4"
            >
              <span className="flex flex-wrap gap-1.5">
                {example.conditions.map((condition) => (
                  <Badge key={condition} tone={example.conditionTone}>
                    {condition}
                  </Badge>
                ))}
              </span>
              <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-subtle" />
              <span className="text-small text-ink-muted">{example.conclusion}</span>
              {example.tag && (
                <Badge tone="ink" className="ml-auto">
                  {example.tag}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        aria-labelledby="metrics-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(220)}
      >
        <BlockHeading id="metrics-title" title={METRICS_LABEL} />

        <div className="rounded-xl border border-accent-border bg-accent-soft p-5">
          <p className="text-overline text-accent-strong uppercase">{NORTH_STAR_LABEL}</p>
          <p className="mt-1 text-lead font-medium text-ink">{NORTH_STAR}</p>
        </div>

        <p className="mt-6 mb-3 text-overline text-ink-subtle uppercase">{SUPPORTING_METRICS_LABEL}</p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTING_METRICS.map((metric) => {
            const Icon = metric.icon
            return (
              <li key={metric.id} className="rounded-xl border border-border bg-surface p-4 shadow-card">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-full border border-accent-border bg-accent-soft text-accent"
                >
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-small font-semibold text-ink">{metric.label}</p>
                <p className="mt-1 text-caption text-ink-muted">{metric.definition}</p>
              </li>
            )
          })}
        </ul>

        <Callout tone="warning" className="mt-6">
          {USAGE_CAVEAT}
        </Callout>
      </Section>

      <Section
        aria-labelledby="risks-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(280)}
      >
        <BlockHeading id="risks-title" title={RISKS_LABEL} />
        <RiskList items={RISKS} label={RISKS_LABEL} />
      </Section>

      <Section
        aria-labelledby="validation-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(340)}
      >
        <BlockHeading id="validation-title" title={VALIDATION_LABEL} />
        <FlowDiagram nodes={validationNodes} direction="horizontal" label={VALIDATION_LABEL} />
        <p className="mt-4 text-small font-medium text-ink">{ITERATE_NOTE}</p>
      </Section>

      <Section className="animate-rise border-t border-border py-6 md:py-8" style={rise(400)}>
        <figure className="rounded-2xl bg-ink px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-small text-ink-inverse/60">{FINAL_PRINCIPLE.avoidLead}</p>
          <p className="mt-1 font-serif text-h3 text-ink-inverse/60 italic">
            &ldquo;{FINAL_PRINCIPLE.avoidQuestion}&rdquo;
          </p>
          <p className="mt-6 text-small font-medium text-ink-inverse">{FINAL_PRINCIPLE.preferLead}</p>
          <blockquote className="mx-auto mt-1 max-w-2xl font-serif text-h1 text-balance text-accent-soft italic">
            &ldquo;{FINAL_PRINCIPLE.preferQuestion}&rdquo;
          </blockquote>
          <figcaption className="mx-auto mt-6 max-w-xl text-small text-ink-inverse/70">
            {FINAL_PRINCIPLE.support}
          </figcaption>
        </figure>
      </Section>

      <Section tone="subtle" className="py-6 md:py-8">
        <ContextNote className="mb-6">{TPM_NOTE}</ContextNote>
        <PagePager sectionId="tpm-thinking" />
      </Section>
    </>
  )
}
