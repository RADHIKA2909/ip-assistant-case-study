import { CircleDashed } from 'lucide-react'
import { PRODUCT_QUESTIONS, getSection, pageTitle, type SectionId } from '@/content/site'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { Card } from '@/components/ui/Card'
import { PagePager } from './PagePager'
import { PageHeader } from './PageHeader'
import { Section, SectionHeading } from './Section'

/**
 * Stand-in for a case-study page that has not been designed yet.
 * Replace by building the real page and deleting its use of this component.
 */
export function PlaceholderPage({ sectionId }: { sectionId: SectionId }) {
  const section = getSection(sectionId)

  return (
    <>
      <title>{pageTitle(section.title)}</title>
      <PageHeader
        eyebrow={`${section.number} · ${section.shortTitle}`}
        title={section.title}
        lead={section.summary}
      >
        <div className="mt-6">
          <Badge tone="warning" dot>
            Placeholder: design pending
          </Badge>
        </div>
      </PageHeader>

      <Section>
        <Callout tone="info" title="This page is wired up and waiting for its design.">
          Routing, layout, navigation and the design system are in place. The page content and layout
          arrive in a separate step.
        </Callout>

        <div className="mt-12">
          <SectionHeading
            eyebrow="The core question"
            title={section.question}
            description="Every part of this page should help answer that question, and should be able to answer the seven below."
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_QUESTIONS.map((question) => (
              <Card as="li" key={question} padding="sm" className="flex items-start gap-3">
                <CircleDashed aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
                <span className="text-small text-ink-muted">{question}</span>
              </Card>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="subtle" className="py-10 md:py-12">
        <PagePager sectionId={sectionId} />
      </Section>
    </>
  )
}
