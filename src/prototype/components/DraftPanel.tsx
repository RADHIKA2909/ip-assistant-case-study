import { CheckCircle2, Quote } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { Card, CardHeader } from '@/components/ui/Card'
import { Disclosure } from '@/components/ui/Disclosure'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { DRAFT_DISCLAIMER, WHY_THIS_ANSWER_LABEL, WHY_THIS_ANSWER_TEXT } from '../content'
import { CONFIDENCE_TONE, DOC_STATUS_META } from '../steps'
import type { DocStatus, DraftSection, ReviewDecision, RetrievedSource } from '../types'
import { RejectFeedbackPanel } from './RejectFeedbackPanel'

interface DraftPanelProps {
  sections: readonly DraftSection[]
  sources: readonly RetrievedSource[]
  getSectionText: (id: string) => string
  hasEdits: boolean
  decision: ReviewDecision
  reviewReason: string | null
  docStatus: DocStatus
  onEditSection: (id: string, text: string) => void
  onApprove: () => void
  onReject: (reason: string) => void
  onSelectSource: (id: string) => void
}

export function DraftPanel({
  sections,
  sources,
  getSectionText,
  hasEdits,
  decision,
  reviewReason,
  docStatus,
  onEditSection,
  onApprove,
  onReject,
  onSelectSource,
}: DraftPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showRejectPanel, setShowRejectPanel] = useState(false)
  const pending = decision === 'pending'

  return (
    <Card as="section" aria-labelledby="draft-panel-title" padding="md">
      <CardHeader
        headingLevel="h2"
        title={<span id="draft-panel-title">Draft Response</span>}
        action={
          pending && (
            <Button
              variant={isEditing ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? 'Done editing' : 'Edit'}
            </Button>
          )
        }
      />

      <Callout tone="warning" className="mt-3">
        {DRAFT_DISCLAIMER}
      </Callout>

      <div className="mt-4 space-y-5">
        {sections.map((section) => (
          <div key={section.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-small font-semibold text-ink">{section.heading}</h3>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge tone={CONFIDENCE_TONE[section.confidence]}>
                  {section.confidence} confidence
                </Badge>
                <IllustrativeTag />
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={getSectionText(section.id)}
                onChange={(event) => onEditSection(section.id, event.target.value)}
                rows={4}
                aria-label={`Edit: ${section.heading}`}
                className="mt-2 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-small text-ink outline-none focus-visible:border-accent"
              />
            ) : (
              <p className="mt-2 text-small leading-relaxed text-ink-muted">{getSectionText(section.id)}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {section.sourceIds.map((id) => {
                const source = sources.find((s) => s.id === id)
                if (!source) return null
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectSource(id)}
                    className="cursor-pointer rounded-full border border-border-strong bg-surface-subtle px-2 py-0.5 font-mono text-caption text-ink-muted hover:bg-surface"
                  >
                    [{source.citationLabel}]
                  </button>
                )
              })}
            </div>

            <Disclosure summary={WHY_THIS_ANSWER_LABEL} className="mt-2">
              <p className="mb-2 text-caption text-ink-muted">{WHY_THIS_ANSWER_TEXT}</p>
              <ul className="space-y-1.5">
                {section.sourceIds.map((id) => {
                  const source = sources.find((s) => s.id === id)
                  if (!source) return null
                  return (
                    <li key={id} className="flex gap-2 text-caption text-ink-muted">
                      <Quote aria-hidden className="mt-0.5 size-3 shrink-0" />
                      <span>
                        <span className="font-medium text-ink">{source.label}:</span> &ldquo;{source.excerpt}&rdquo;
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Disclosure>
          </div>
        ))}
      </div>

      {pending ? (
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={onApprove}>Approve</Button>
            <Button variant="danger" onClick={() => setShowRejectPanel((v) => !v)}>
              Reject
            </Button>
          </div>
          {showRejectPanel && (
            <RejectFeedbackPanel
              onSubmit={(reason) => {
                onReject(reason)
                setShowRejectPanel(false)
              }}
              onCancel={() => setShowRejectPanel(false)}
            />
          )}
        </div>
      ) : (
        <DecisionBanner docStatus={docStatus} hasEdits={hasEdits} reason={reviewReason} />
      )}
    </Card>
  )
}

function DecisionBanner({
  docStatus,
  hasEdits,
  reason,
}: {
  docStatus: DocStatus
  hasEdits: boolean
  reason: string | null
}) {
  const meta = DOC_STATUS_META[docStatus]
  const rejected = docStatus === 'rejected'

  return (
    <div aria-live="polite" className="mt-5 border-t border-border pt-4">
      <Callout tone={rejected ? 'danger' : 'success'} icon={rejected ? undefined : CheckCircle2} title={meta.label}>
        {rejected
          ? `Feedback captured — thank you.${reason ? ` Reason: ${reason}.` : ''}`
          : hasEdits
            ? 'Approved with your edits applied.'
            : 'Approved as generated by the AI.'}
      </Callout>
    </div>
  )
}
