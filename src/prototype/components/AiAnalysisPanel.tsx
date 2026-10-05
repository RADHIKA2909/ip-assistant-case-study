import { ChevronRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { cn } from '@/lib/cn'
import { EVIDENCE_LABEL, KEY_FINDING, VIEW_SOURCES_LABEL } from '../content'
import { CONFIDENCE_TONE } from '../steps'
import type { RetrievedSource } from '../types'

interface AiAnalysisPanelProps {
  sources: readonly RetrievedSource[]
  activeSourceId: string | null
  onSelectSource: (id: string) => void
  onViewSources: () => void
}

export function AiAnalysisPanel({ sources, activeSourceId, onSelectSource, onViewSources }: AiAnalysisPanelProps) {
  return (
    <Card as="section" aria-labelledby="ai-analysis-title" padding="md" className="mt-4">
      <div className="flex items-start gap-2.5">
        <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Sparkles className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p id="ai-analysis-title" className="text-overline text-accent-strong uppercase">
            {KEY_FINDING.label}
          </p>
          <p className="mt-1 text-small text-ink">{KEY_FINDING.text}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <p className="text-overline text-ink-subtle uppercase">{EVIDENCE_LABEL}</p>
          <IllustrativeTag />
        </div>
        <ul className="mt-2 space-y-1.5">
          {sources.map((source) => {
            const active = activeSourceId === source.id
            return (
              <li key={source.id}>
                <button
                  type="button"
                  onClick={() => onSelectSource(source.id)}
                  aria-current={active || undefined}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-small transition-colors duration-150',
                    active ? 'bg-accent-soft text-accent-strong' : 'text-ink-muted hover:bg-surface-subtle',
                  )}
                >
                  <ChevronRight aria-hidden className="size-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate font-medium">{source.label}</span>
                  <Badge tone={CONFIDENCE_TONE[source.relevance]} className="shrink-0">
                    {source.relevance}
                  </Badge>
                </button>
              </li>
            )
          })}
        </ul>
        <Button variant="secondary" size="sm" onClick={onViewSources} className="mt-3">
          {VIEW_SOURCES_LABEL}
        </Button>
      </div>
    </Card>
  )
}
