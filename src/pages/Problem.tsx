import { ContextNote } from '@/components/case-study/ContextNote'
import { DocumentStackIllustration } from '@/components/case-study/DocumentStackIllustration'
import { IconList } from '@/components/case-study/IconList'
import { PairedCards, type Pair } from '@/components/case-study/PairedCards'
import { PersonaAvatar } from '@/components/case-study/PersonaAvatar'
import { PersonaCard } from '@/components/case-study/PersonaCard'
import { WorkflowStrip } from '@/components/case-study/WorkflowStrip'
import { BlockHeading } from '@/components/layout/BlockHeading'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import {
  GOALS,
  GOALS_LABEL,
  OPPORTUNITY_TITLE,
  PAIN_TITLE,
  PAIR_ADDRESSES_LABEL,
  PAIRS,
  PERSONA,
  PROBLEM_HERO,
  PROBLEM_NOTE,
  WORKFLOW,
  WORKFLOW_HEAVY_LABEL,
  WORKFLOW_LABEL,
  WORKFLOW_NOTE,
} from '@/content/problem'
import { getSection, pageTitle } from '@/content/site'

const section = getSection('problem')

const pairs: Pair[] = PAIRS.map(({ id, pain, opportunity }) => ({ id, left: pain, right: opportunity }))

/** Stagger for the entrance animation, so blocks arrive top to bottom. */
const rise = (delayMs: number) => ({ animationDelay: `${delayMs}ms` })

/** Page 1: who the user is, how they work today, where it hurts, and where AI could help. */
export function Problem() {
  return (
    <>
      <title>{pageTitle(section.title)}</title>

      <PageHeader
        compact
        eyebrow={PROBLEM_HERO.eyebrow}
        title={
          <>
            {PROBLEM_HERO.titlePrefix}
            <em>{PROBLEM_HERO.titleEmphasis}</em>
          </>
        }
        lead={PROBLEM_HERO.subtitle}
        aside={<DocumentStackIllustration className="ml-auto max-w-sm" />}
      />

      <Section className="animate-rise py-6 md:py-8" style={rise(120)}>
        <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-0">
          <div className="lg:pr-10">
            <BlockHeading id="persona-title" title={PERSONA.label} />
            <PersonaCard
              role={PERSONA.role}
              description={PERSONA.description}
              avatar={<PersonaAvatar className="size-20" />}
            />
          </div>
          <div className="lg:border-l lg:border-border lg:pl-10">
            <BlockHeading id="goals-title" title={GOALS_LABEL} />
            <IconList items={GOALS} columns={2} />
          </div>
        </div>
      </Section>

      <Section
        aria-labelledby="workflow-title"
        className="animate-rise border-t border-border py-6 md:py-8"
        style={rise(200)}
      >
        <BlockHeading id="workflow-title" title={WORKFLOW_LABEL} note={WORKFLOW_NOTE} />
        <WorkflowStrip steps={WORKFLOW} label={WORKFLOW_LABEL} heavyLabel={WORKFLOW_HEAVY_LABEL} />
      </Section>

      <Section className="animate-rise border-t border-border py-6 md:py-8" style={rise(280)}>
        <PairedCards
          pairs={pairs}
          left={{ title: PAIN_TITLE, tone: 'accent', tag: <IllustrativeTag label="Proposed" /> }}
          right={{
            title: OPPORTUNITY_TITLE,
            tone: 'success',
            tag: <IllustrativeTag label="Proposed" />,
          }}
          addressesLabel={PAIR_ADDRESSES_LABEL}
        />
      </Section>

      <Section tone="subtle" className="py-6 md:py-8">
        <ContextNote className="mb-6">{PROBLEM_NOTE}</ContextNote>
        <PagePager sectionId="problem" />
      </Section>
    </>
  )
}
