import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { OPEN_SOURCE_LABEL, VIEW_SOURCES_LABEL } from '../content'
import { CONFIDENCE_TONE } from '../steps'
import type { RetrievedSource } from '../types'

interface SourceDrawerProps {
  open: boolean
  sources: readonly RetrievedSource[]
  activeSourceId: string | null
  onSelectSource: (id: string) => void
  onClose: () => void
}

/**
 * Evidence drawer: a right-side panel at `lg+`, a bottom sheet below `lg`. Demonstrates grounded
 * AI - every draft citation and document highlight opens the same list, scrolled/highlighted to
 * the source in question. Escape closes it and focus returns to whatever opened it.
 */
export function SourceDrawer({ open, sources, activeSourceId, onSelectSource, onClose }: SourceDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open && activeSourceId) {
      itemRefs.current[activeSourceId]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeSourceId])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/30"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={VIEW_SOURCES_LABEL}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border-strong bg-surface p-4 shadow-raised sm:p-6 lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:h-full lg:max-h-none lg:w-96 lg:rounded-t-none lg:border-t-0 lg:border-l"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">{VIEW_SOURCES_LABEL}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close sources"
            className="grid size-8 cursor-pointer place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <ul className="space-y-3">
          {sources.map((source) => {
            const active = activeSourceId === source.id
            return (
              <li
                key={source.id}
                ref={(el) => {
                  itemRefs.current[source.id] = el
                }}
                className={cn(
                  'rounded-lg border p-3.5 transition-colors duration-150',
                  active ? 'border-accent-border bg-accent-soft/50' : 'border-border',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Badge tone="neutral" className="mb-1.5">
                      {source.category}
                    </Badge>
                    <p className="text-small font-semibold text-ink">{source.label}</p>
                    <p className="text-caption text-ink-subtle">{source.location}</p>
                  </div>
                  <Badge tone={CONFIDENCE_TONE[source.relevance]} className="shrink-0">
                    {source.relevance}
                  </Badge>
                </div>
                <p className="mt-2 text-small text-ink-muted">&ldquo;{source.excerpt}&rdquo;</p>
                <Button variant="ghost" size="sm" onClick={() => onSelectSource(source.id)} className="mt-2 -ml-2">
                  {OPEN_SOURCE_LABEL}
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
