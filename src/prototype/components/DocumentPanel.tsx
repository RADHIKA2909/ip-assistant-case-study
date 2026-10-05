import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { OFFICE_ACTION_TEXT } from '../mock/seed'
import type { RetrievedSource } from '../types'

interface DocumentPanelProps {
  sources: readonly RetrievedSource[]
  activeSourceId: string | null
  onSelectSource: (id: string) => void
}

/**
 * The Office Action, in three labelled parts: the company's claim, the examiner's objection, and
 * the existing reference (prior art) the examiner is using. The claim and the existing reference
 * are clickable evidence passages; the reference's label is accented so it stands out as the
 * thing being compared against.
 */
export function DocumentPanel({ sources, activeSourceId, onSelectSource }: DocumentPanelProps) {
  return (
    <Card as="section" aria-labelledby="document-panel-title" padding="md">
      <p className="text-overline text-ink-subtle uppercase">Document</p>
      <h2 id="document-panel-title" className="mt-1 text-small font-semibold text-ink">
        {OFFICE_ACTION_TEXT.heading}
      </h2>
      <p className="mt-1 text-caption text-ink-subtle">{OFFICE_ACTION_TEXT.meta}</p>

      <div className="mt-4 space-y-4 text-small leading-relaxed text-ink-muted">
        {OFFICE_ACTION_TEXT.sections.map((section) => {
          const isPriorArt = section.id === 'prior-art'
          const source = section.sourceId ? sources.find((s) => s.id === section.sourceId) : undefined
          const active = source !== undefined && activeSourceId === source.id
          return (
            <div key={section.id}>
              <p
                className={cn(
                  'mb-1 text-overline uppercase',
                  isPriorArt ? 'text-accent-strong' : 'text-ink-subtle',
                )}
              >
                {section.label}
              </p>
              {source ? (
                <button
                  type="button"
                  onClick={() => onSelectSource(source.id)}
                  title={`${source.category}: ${source.label}`}
                  className={cn(
                    'block w-full cursor-pointer rounded-md px-3 py-2 text-left font-medium transition-colors duration-150',
                    active ? 'bg-accent text-ink-inverse' : 'bg-accent-soft text-accent-strong',
                  )}
                >
                  {section.text}
                </button>
              ) : (
                <p>{section.text}</p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
