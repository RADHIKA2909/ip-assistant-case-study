import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ACTOR_TONE } from '@/components/case-study/actors'
import { FlowDiagram } from '@/components/case-study/FlowDiagram'
import { PrincipleCallout } from '@/components/case-study/PrincipleCallout'
import { Container } from '@/components/layout/Container'
import { Section, SectionHeading } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { ACTOR_LABEL, CORE_STORY, SECTIONS, pageTitle, type Actor } from '@/content/site'
import { cn } from '@/lib/cn'

const flowNodes = CORE_STORY.map((step) => ({
  id: step.id,
  label: step.label,
  description: step.description,
  tone: ACTOR_TONE[step.actor],
}))

const actors = Object.keys(ACTOR_LABEL) as Actor[]

/** Provisional landing page: hero + core story + section index. Replace when the home design arrives. */
export function Home() {
  return (
    <>
      <title>{pageTitle()}</title>

      <section className="border-b border-border">
        <Container className="grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          {/* Same animate-rise entrance every other page gets for free via PageHeader - Home
              builds its own hero, so it needs the stagger applied explicitly. */}
          <div className="animate-rise">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">Product case study</Badge>
              <IllustrativeTag label="Proposed" />
            </div>
            <h1 className="mt-6 text-display text-balance">
              AI for patent and IP work that shows its evidence and defers to the expert.
            </h1>
            <p className="mt-6 max-w-prose text-lead text-ink-muted">
              A case study in designing an enterprise AI product for document-heavy professional
              workflows: retrieval, drafting, citations, expert review and evaluation, end to end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                to="/problem"
                size="lg"
                iconRight={<ArrowRight aria-hidden className="size-4" />}
              >
                Start with the problem
              </Button>
              <Button to="/prototype" size="lg" variant="secondary">
                Jump to the prototype
              </Button>
            </div>
            <PrincipleCallout className="mt-10" />
          </div>

          <Card
            as="section"
            padding="lg"
            aria-labelledby="core-story-title"
            className="animate-rise self-start"
            style={{ animationDelay: '120ms' }}
          >
            <CardHeader
              headingLevel="h2"
              eyebrow="How it works"
              title={<span id="core-story-title">The core story</span>}
              description="From raw document to expert-approved output, and back into improvement."
            />
            <ul aria-label="Legend" className="mt-4 mb-6 flex flex-wrap gap-2">
              {actors.map((actor) => (
                <li key={actor}>
                  <Badge tone={ACTOR_TONE[actor]} dot>
                    {ACTOR_LABEL[actor]}
                  </Badge>
                </li>
              ))}
            </ul>
            <FlowDiagram nodes={flowNodes} label="Core product story" />
          </Card>
        </Container>
      </section>

      <Section aria-labelledby="parts-title" className="animate-rise" style={{ animationDelay: '200ms' }}>
        <SectionHeading
          id="parts-title"
          eyebrow="Five parts"
          title="What this case study covers"
          description="Each part answers one question, and ties back to the same principle."
        />
        <ul className="grid gap-4 lg:grid-cols-6">
          {SECTIONS.map((section, index) => (
            <Card
              as="li"
              key={section.id}
              interactive
              padding="none"
              className={cn('sm:col-span-1', index < 3 ? 'lg:col-span-2' : 'lg:col-span-3')}
            >
              <Link
                to={section.path}
                className="flex h-full flex-col gap-3 rounded-xl p-5 sm:p-6"
              >
                <span className="font-mono text-caption text-ink-subtle">{section.number}</span>
                <span className="font-serif text-h3 text-ink">{section.title}</span>
                <span className="text-small text-ink-muted">{section.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-small font-medium text-accent">
                  Open
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </Card>
          ))}
        </ul>
      </Section>
    </>
  )
}
