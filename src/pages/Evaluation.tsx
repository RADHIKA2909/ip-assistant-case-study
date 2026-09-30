import { useMemo, useState } from 'react'
import { ACTOR_TONE } from '@/components/case-study/actors'
import { ContextNote } from '@/components/case-study/ContextNote'
import { FailureModeList } from '@/components/case-study/FailureModeList'
import { FlowDiagram, type FlowNode } from '@/components/case-study/FlowDiagram'
import { GuardrailGrid } from '@/components/case-study/GuardrailGrid'
import { MetricGrid } from '@/components/case-study/MetricGrid'
import { BlockHeading } from '@/components/layout/BlockHeading'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import {
  EVALUATION_HERO,
  EVALUATION_NOTE,
  FAILURE_MODES,
  FAILURE_MODES_LABEL,
  FAILURE_MODES_NOTE,
  GUARDRAILS,
  GUARDRAILS_LABEL,
  HUMAN_LOOP,
  HUMAN_LOOP_HIGHLIGHT,
  HUMAN_LOOP_LABEL,
  IMPROVEMENT_CAPTION,
  IMPROVEMENT_LABEL,
  IMPROVEMENT_LOOP,
  METRICS,
  METRICS_LABEL,
  PRINCIPLE_STATEMENT,
  STAGES,
  STAGES_LABEL,
  STAGES_NOTE,
} from '@/content/evaluation'
import { getSection, pageTitle } from '@/content/site'

const section = getSection('evaluation')

const stageNodes: FlowNode[] = STAGES.map((stage) => ({
  id: stage.id,
  label: stage.label,
  description: stage.question,
  tone: ACTOR_TONE[stage.actor],
}))

const humanLoopNodes: FlowNode[] = HUMAN_LOOP.map((node) => ({
  id: node.id,
  label: node.label,
  caption: node.caption,
  tone: ACTOR_TONE[node.actor],
}))

const improvementNodes: FlowNode[] = IMPROVEMENT_LOOP.map((node) => ({
  id: node.id,
  label: node.label,
  caption: node.caption,
  tone: ACTOR_TONE[node.actor],
}))

/** Stagger for the entrance animation, so blocks arrive top to bottom. */
const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` })

/**
 * Page 4: what "good" means for this workflow, illustrative quality metrics, why human review is
 * part of the design rather than a fallback, the guardrails, the failure modes they're meant to
 * catch, and the feedback loop that improves the system over time.
 */
export function Evaluation() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // One shared hover state drives both lists. The relation is explicit and many-to-many (a
  // guardrail can catch more than one failure; a failure can have no guardrail at all) rather
  // than a forced 1:1 pairing - see CLAUDE.md.
  const highlightedGuardrailIds = useMemo(() => {
    const ids = new Set<string>()
    if (!hoveredId) return ids
    if (GUARDRAILS.some((g) => g.id === hoveredId)) ids.add(hoveredId)
    const failure = FAILURE_MODES.find((f) => f.id === hoveredId)
    failure?.relatedGuardrailIds.forEach((id) => ids.add(id))
    return ids
  }, [hoveredId])

  const highlightedFailureIds = useMemo(() => {
    const ids = new Set<string>()
    if (!hoveredId) return ids
    if (FAILURE_MODES.some((f) => f.id === hoveredId)) ids.add(hoveredId)
    for (const failure of FAILURE_MODES) {
      if (failure.relatedGuardrailIds.includes(hoveredId)) ids.add(failure.id)
    }
    return ids
  }, [hoveredId])

  return (
    <>
      <title>{pageTitle(section.title)}</title>

      <PageHeader
        compact
        eyebrow={EVALUATION_HERO.eyebrow}
        title={
          <>
            {EVALUATION_HERO.titlePrefix}
            <em>{EVALUATION_HERO.titleEmphasis}</em>
            {EVALUATION_HERO.titleSuffix}
          </>
        }
        lead={EVALUATION_HERO.subtitle}
      >
        <div className="mt-6">
          <Badge tone="accent" dot>
            {EVALUATION_HERO.badge}
          </Badge>
        </div>
      </PageHeader>

      <Section className="animate-rise py-6 md:py-8" style={rise(100)}>
        <p className="mb-5 max-w-2xl text-lead font-medium text-ink">{PRINCIPLE_STATEMENT}</p>
        <BlockHeading id="stages-title" title={STAGES_LABEL} />
        <FlowDiagram nodes={stageNodes} direction="horizontal" label={STAGES_LABEL} />
        <p className="mt-4 text-small text-ink-muted">{STAGES_NOTE}</p>
      </Section>

      <Section
        aria-labelledby="metrics-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(160)}
      >
        <BlockHeading id="metrics-title" title={METRICS_LABEL} />
        <MetricGrid metrics={METRICS} label={METRICS_LABEL} />
      </Section>

      <Section
        aria-labelledby="human-loop-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(220)}
      >
        <BlockHeading id="human-loop-title" title={HUMAN_LOOP_LABEL} />
        <FlowDiagram nodes={humanLoopNodes} direction="horizontal" label={HUMAN_LOOP_LABEL} />
        <Callout tone="accent" className="mt-5">
          {HUMAN_LOOP_HIGHLIGHT}
        </Callout>
      </Section>

      <Section
        aria-labelledby="guardrails-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(280)}
      >
        <BlockHeading id="guardrails-title" title={GUARDRAILS_LABEL} />
        <GuardrailGrid
          items={GUARDRAILS}
          label={GUARDRAILS_LABEL}
          highlightedIds={highlightedGuardrailIds}
          onHover={setHoveredId}
        />
      </Section>

      <Section
        aria-labelledby="failure-modes-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(340)}
      >
        <BlockHeading id="failure-modes-title" title={FAILURE_MODES_LABEL} note={FAILURE_MODES_NOTE} />
        <FailureModeList
          items={FAILURE_MODES}
          guardrails={GUARDRAILS}
          label={FAILURE_MODES_LABEL}
          highlightedIds={highlightedFailureIds}
          onHover={setHoveredId}
        />
      </Section>

      <Section tone="subtle" className="animate-rise py-6 md:py-8" style={rise(400)}>
        <BlockHeading id="improvement-title" as="h3" title={IMPROVEMENT_LABEL} note={IMPROVEMENT_CAPTION} />
        <FlowDiagram nodes={improvementNodes} direction="horizontal" label={IMPROVEMENT_LABEL} className="opacity-90" />

        <ContextNote className="mt-8 border-t border-border pt-6">{EVALUATION_NOTE}</ContextNote>
        <div className="mt-6">
          <PagePager sectionId="evaluation" />
        </div>
      </Section>
    </>
  )
}
