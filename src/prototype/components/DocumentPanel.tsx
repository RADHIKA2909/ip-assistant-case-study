import { Fragment } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { OFFICE_ACTION_TEXT } from '../mock/seed'
import type { RetrievedSource } from '../types'

const MARKER = /\{\{(src-\d+)\}\}/g

interface DocumentPanelProps {
  sources: readonly RetrievedSource[]
  activeSourceId: string | null
  onSelectSource: (id: string) => void
}

/**
 * The Office Action text. Two passages are marked in the source text ({{src-1}}, {{src-2}}) and
 * rendered as clickable highlights showing the actual retrieved excerpt - clicking one selects
 * that source, demonstrating grounding: the document and the evidence are the same passages.
 */
export function DocumentPanel({ sources, activeSourceId, onSelectSource }: DocumentPanelProps) {
  return (
    <Card as="section" aria-labelledby="document-panel-title" padding="md">
      <p className="text-overline text-ink-subtle uppercase">Document</p>
      <h2 id="document-panel-title" className="mt-1 text-small font-semibold text-ink">
        {OFFICE_ACTION_TEXT.heading}
      </h2>
      <p className="mt-1 text-caption text-ink-subtle">{OFFICE_ACTION_TEXT.meta}</p>

      <div className="mt-4 space-y-3 text-small leading-relaxed text-ink-muted">
        {OFFICE_ACTION_TEXT.paragraphs.map((paragraph, index) => (
          <p key={index}>{renderWithHighlights(paragraph, sources, activeSourceId, onSelectSource)}</p>
        ))}
      </div>
    </Card>
  )
}

function renderWithHighlights(
  text: string,
  sources: readonly RetrievedSource[],
  activeSourceId: string | null,
  onSelectSource: (id: string) => void,
) {
  const parts = text.split(MARKER)
  return parts.map((part, index) => {
    // Odd indices are the captured source ids from MARKER's group.
    if (index % 2 === 1) {
      const source = sources.find((s) => s.id === part)
      if (!source) return null
      const active = activeSourceId === source.id
      return (
        <button
          key={index}
          type="button"
          onClick={() => onSelectSource(source.id)}
          title={`${source.category}: ${source.label}`}
          className={cn(
            // `inline` (not the button default of inline-block) so trailing punctuation flows
            // right after the highlight instead of wrapping onto its own line.
            'inline cursor-pointer rounded px-1 py-0.5 font-medium underline decoration-accent decoration-2 underline-offset-2 transition-colors duration-150',
            active ? 'bg-accent text-ink-inverse decoration-transparent' : 'bg-accent-soft text-accent-strong',
          )}
        >
          &ldquo;{source.excerpt}&rdquo;
        </button>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}
