import { DisclaimerNote } from '@/components/case-study/DisclaimerNote'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { Spinner } from '@/components/ui/Loading'
import { getSection, pageTitle } from '@/content/site'
import { WorkflowStepper } from '@/prototype/components/WorkflowStepper'
import { MOCK_DOCUMENTS } from '@/prototype/mock/seed'
import { selectCanStartPipeline, selectDocStatus, selectHasDraft } from '@/prototype/reducer'
import { DOC_STATUS_META, STAGE_LABEL } from '@/prototype/steps'
import { usePrototype } from '@/prototype/usePrototype'

const section = getSection('prototype')

/**
 * SCAFFOLD ONLY. The controls below exist to prove that workflow state is shared across screens
 * and routes. The real prototype (from the page-specific prompt) replaces this page's body.
 */
export function Prototype() {
  const { state, actions } = usePrototype()
  const status = DOC_STATUS_META[selectDocStatus(state)]
  const example = MOCK_DOCUMENTS[0]
  const selected = MOCK_DOCUMENTS.find((doc) => doc.id === state.documentId)
  const running = state.pipeline.status === 'running'
  const pending = state.review.decision === 'pending'
  const reviewing = state.reached.includes('review') && pending

  return (
    <>
      <title>{pageTitle(section.title)}</title>
      <PageHeader
        eyebrow={`${section.number} · ${section.shortTitle}`}
        title={section.title}
        lead={section.summary}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="warning" dot>
            Placeholder: design pending
          </Badge>
          <IllustrativeTag />
        </div>
      </PageHeader>

      <Section>
        <DisclaimerNote className="mb-8" />

        <Card padding="lg">
          <CardHeader
            headingLevel="h2"
            eyebrow="Scaffold check"
            title="Shared workflow state"
            description="Temporary controls. Move through the workflow, navigate to another page, and come back: the state stays."
            action={
              <Badge tone={status.tone} dot>
                {status.label}
              </Badge>
            }
          />

          <WorkflowStepper className="mt-8" />

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              disabled={!example || running || state.documentId === example.id}
              onClick={() => example && actions.selectDocument(example.id)}
            >
              Select example document
            </Button>
            <Button
              variant="accent"
              disabled={!selectCanStartPipeline(state)}
              onClick={actions.startPipeline}
            >
              Run AI pipeline
            </Button>
            <Button
              variant="secondary"
              disabled={!selectHasDraft(state) || !pending}
              onClick={actions.beginReview}
            >
              Begin review
            </Button>
            <Button disabled={!reviewing} onClick={actions.approve}>
              Approve
            </Button>
            <Button
              variant="danger"
              disabled={!reviewing}
              onClick={() => actions.reject('Scaffold check: rejected from the test controls.')}
            >
              Reject
            </Button>
            <Button variant="ghost" onClick={actions.reset}>
              Reset
            </Button>
          </div>

          <p aria-live="polite" className="mt-4 flex min-h-6 items-center gap-2 text-small text-ink-muted">
            {running && state.pipeline.stage && (
              <>
                <Spinner label="AI pipeline running" />
                {STAGE_LABEL[state.pipeline.stage]}…
              </>
            )}
          </p>

          <dl className="mt-4 grid gap-x-6 gap-y-4 border-t border-border pt-6 text-small sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Document" value={selected?.title ?? 'None selected'} />
            <Fact
              label="Pipeline"
              value={state.pipeline.stage ? STAGE_LABEL[state.pipeline.stage] : state.pipeline.status}
            />
            <Fact label="Evidence retrieved" value={`${state.sources.length} sources`} />
            <Fact label="Review decision" value={state.review.decision} />
          </dl>
        </Card>
      </Section>

      <Section tone="subtle" className="py-10 md:py-12">
        <PagePager sectionId="prototype" />
      </Section>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-overline text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  )
}
