import { useEffect, useState } from 'react'
import { DisclaimerNote } from '@/components/case-study/DisclaimerNote'
import { FlowDiagram } from '@/components/case-study/FlowDiagram'
import { PageHeader } from '@/components/layout/PageHeader'
import { PagePager } from '@/components/layout/PagePager'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Disclosure } from '@/components/ui/Disclosure'
import { Spinner } from '@/components/ui/Loading'
import { getSection, pageTitle } from '@/content/site'
import { AiAnalysisPanel } from '@/prototype/components/AiAnalysisPanel'
import { DocumentPanel } from '@/prototype/components/DocumentPanel'
import { DraftPanel } from '@/prototype/components/DraftPanel'
import { ProductShell } from '@/prototype/components/ProductShell'
import { QualityPanel } from '@/prototype/components/QualityPanel'
import { SourceDrawer } from '@/prototype/components/SourceDrawer'
import {
  ANALYZE_CTA,
  EXPORT_NOTE,
  HOW_IT_WORKS_LABEL,
  HOW_IT_WORKS_NODES,
  PRODUCT_PRINCIPLE,
  SAVE_CONFIRMATION,
  TOP_BAR,
} from '@/prototype/content'
import { MOCK_DOCUMENTS } from '@/prototype/mock/seed'
import { selectDocStatus, selectHasDraft, selectHasEdits, selectSectionText } from '@/prototype/reducer'
import { DOC_STATUS_META, STAGE_LABEL } from '@/prototype/steps'
import { usePrototype } from '@/prototype/usePrototype'

const section = getSection('prototype')
const exampleDocument = MOCK_DOCUMENTS[0]!

/**
 * Page 3: the interactive prototype. One persistent workspace whose panels populate
 * progressively (select -> analyzing -> full workspace -> reviewed), rather than switching
 * between separate step screens - see CLAUDE.md for why this departs from `WorkflowStepper`.
 */
export function Prototype() {
  const { state, actions } = usePrototype()
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const hasDraft = selectHasDraft(state)
  const hasEdits = selectHasEdits(state)
  const docStatus = selectDocStatus(state)
  const analyzing = state.pipeline.status === 'running'
  const pending = state.review.decision === 'pending'

  // The expert "opens" review once a draft exists; idempotent in the reducer if already reached.
  useEffect(() => {
    if (hasDraft && pending) actions.beginReview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDraft, pending])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const openSource = (id: string) => {
    actions.setActiveSource(id)
    setSourcesOpen(true)
  }
  const closeDrawer = () => {
    setSourcesOpen(false)
    actions.setActiveSource(null)
  }

  return (
    <>
      <title>{pageTitle(section.title)}</title>

      <PageHeader
        compact
        eyebrow={`${section.number} — Product Experience`}
        title="From complex documents to expert-validated output."
        lead="A proposed AI workspace that helps patent professionals research, analyse and draft — while keeping evidence and expert review at the centre."
      >
        <div className="mt-6">
          <Badge tone="accent" dot>
            Interactive Prototype
          </Badge>
        </div>
      </PageHeader>

      <Section className="py-6 md:py-8">
        <DisclaimerNote className="mb-6" />

        <Disclosure summary={HOW_IT_WORKS_LABEL} className="mb-6">
          <FlowDiagram nodes={HOW_IT_WORKS_NODES} direction="horizontal" label={HOW_IT_WORKS_LABEL} />
        </Disclosure>

        <ProductShell
          topBar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-small font-semibold text-ink">{TOP_BAR.title}</h2>
                  <Badge tone={DOC_STATUS_META[docStatus].tone} dot>
                    {DOC_STATUS_META[docStatus].label}
                  </Badge>
                </div>
                <p className="mt-0.5 text-caption text-ink-subtle">
                  {hasDraft
                    ? `${TOP_BAR.metaSources} · AI analysis complete`
                    : analyzing
                      ? `${TOP_BAR.metaSources} · ${state.pipeline.stage ? STAGE_LABEL[state.pipeline.stage] : ''}…`
                      : PRODUCT_PRINCIPLE}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setToast(SAVE_CONFIRMATION)}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setToast(EXPORT_NOTE)}>
                  Export
                </Button>
              </div>
            </div>
          }
        >
          <p aria-live="polite" className="mb-3 min-h-5 text-caption font-medium text-accent-strong">
            {toast}
          </p>

          {!state.documentId ? (
            <EmptyState
              onAnalyze={() => {
                // Two dispatches in one handler: React applies them to the reducer in order, so
                // START_PIPELINE already sees the document id SELECT_DOCUMENT just set.
                actions.selectDocument(exampleDocument.id)
                actions.startPipeline()
              }}
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              <div>
                <DocumentPanel sources={state.sources} activeSourceId={state.activeSourceId} onSelectSource={openSource} />
                {analyzing ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface-subtle p-4 text-small text-ink-muted">
                    <Spinner label="AI analysis running" />
                    {state.pipeline.stage ? STAGE_LABEL[state.pipeline.stage] : ''}…
                  </div>
                ) : (
                  hasDraft && (
                    <AiAnalysisPanel
                      sources={state.sources}
                      activeSourceId={state.activeSourceId}
                      onSelectSource={openSource}
                      onViewSources={() => setSourcesOpen(true)}
                    />
                  )
                )}
              </div>

              {hasDraft && (
                <div>
                  <DraftPanel
                    sections={state.draft.sections}
                    sources={state.sources}
                    getSectionText={(id) => selectSectionText(state, id)}
                    hasEdits={hasEdits}
                    decision={state.review.decision}
                    reviewReason={state.review.reason}
                    docStatus={docStatus}
                    onEditSection={actions.editSection}
                    onApprove={actions.approve}
                    onReject={actions.reject}
                    onSelectSource={openSource}
                  />
                  <QualityPanel />
                </div>
              )}
            </div>
          )}
        </ProductShell>

        <SourceDrawer
          open={sourcesOpen}
          sources={state.sources}
          activeSourceId={state.activeSourceId}
          onSelectSource={(id) => actions.setActiveSource(id)}
          onClose={closeDrawer}
        />
      </Section>

      <Section tone="subtle" className="py-6 md:py-8">
        <PagePager sectionId="prototype" />
      </Section>
    </>
  )
}

function EmptyState({ onAnalyze }: { onAnalyze: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border-strong bg-surface-subtle px-6 py-14 text-center">
      <p className="text-overline text-ink-subtle uppercase">{exampleDocument.type}</p>
      <p className="mt-2 max-w-sm text-small font-medium text-ink">{exampleDocument.title}</p>
      <p className="mt-1 max-w-sm text-caption text-ink-muted">{exampleDocument.summary}</p>
      <Button variant="accent" className="mt-5" onClick={onAnalyze}>
        {ANALYZE_CTA}
      </Button>
    </div>
  )
}
