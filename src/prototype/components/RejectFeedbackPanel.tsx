import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { REJECT_PANEL_LABEL, REJECT_REASONS } from '../content'

interface RejectFeedbackPanelProps {
  onSubmit: (reason: string) => void
  onCancel: () => void
}

/**
 * Shown after "Reject" is clicked, before the decision is committed. Nothing is dispatched to the
 * reducer until Submit - Cancel just closes this panel, leaving the draft pending.
 */
export function RejectFeedbackPanel({ onSubmit, onCancel }: RejectFeedbackPanelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [otherText, setOtherText] = useState('')
  const groupId = useId()

  const isOther = selected === 'other'
  const reason = isOther ? otherText.trim() : (REJECT_REASONS.find((r) => r.id === selected)?.label ?? '')
  const canSubmit = reason.length > 0

  return (
    <Card as="section" aria-labelledby={groupId} padding="sm" className="mt-3 border-danger-border bg-danger-soft/40">
      <p id={groupId} className="text-small font-semibold text-ink">
        {REJECT_PANEL_LABEL}
      </p>
      <div role="radiogroup" aria-labelledby={groupId} className="mt-3 flex flex-wrap gap-2">
        {REJECT_REASONS.map((option) => {
          const active = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(option.id)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1.5 text-small font-medium transition-colors duration-150',
                active
                  ? 'border-danger bg-danger text-ink-inverse'
                  : 'border-border-strong bg-surface text-ink-muted hover:bg-surface-subtle',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {isOther && (
        <label className="mt-3 block">
          <span className="sr-only">Describe what needs improvement</span>
          <textarea
            value={otherText}
            onChange={(event) => setOtherText(event.target.value)}
            placeholder="Say more…"
            rows={2}
            className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-small text-ink outline-none focus-visible:border-accent"
          />
        </label>
      )}

      <div className="mt-3 flex gap-2">
        <Button variant="danger" size="sm" disabled={!canSubmit} onClick={() => canSubmit && onSubmit(reason)}>
          Submit feedback
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  )
}
