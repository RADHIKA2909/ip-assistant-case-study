import { ChevronDown, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { toneSolid, type Tone } from '@/components/ui/tones'

export interface FlowNode {
  id: string
  label: string
  description?: string
  tone?: Tone
}

interface FlowDiagramProps {
  nodes: readonly FlowNode[]
  /**
   * vertical: numbered rail, works for any number of nodes.
   * horizontal: cards with connectors, meant for about 5 nodes or fewer; stacks on mobile.
   */
  direction?: 'vertical' | 'horizontal'
  /** Accessible name for the list */
  label: string
  className?: string
}

/** Data-driven ordered flow. Feed it nodes from src/content, never hardcode nodes in a page. */
export function FlowDiagram({ nodes, direction = 'vertical', label, className }: FlowDiagramProps) {
  if (direction === 'horizontal') {
    return (
      <ol
        aria-label={label}
        style={{ '--cols': nodes.length } as CSSProperties}
        className={cn(
          'grid gap-6 md:gap-4 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]',
          className,
        )}
      >
        {nodes.map((node, index) => {
          const last = index === nodes.length - 1
          return (
            <li
              key={node.id}
              className="relative rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <span
                aria-hidden
                className={cn(
                  'mb-3 grid size-6 place-items-center rounded-full font-mono text-caption',
                  toneSolid[node.tone ?? 'neutral'],
                )}
              >
                {index + 1}
              </span>
              <p className="text-small font-semibold text-ink">{node.label}</p>
              {node.description && (
                <p className="mt-1 text-caption text-ink-muted">{node.description}</p>
              )}
              {!last && (
                <>
                  <ChevronRight
                    aria-hidden
                    className="absolute top-1/2 -right-[0.85rem] hidden size-4 -translate-y-1/2 rounded-full bg-canvas text-ink-subtle md:block"
                  />
                  <ChevronDown
                    aria-hidden
                    className="absolute -bottom-[1.1rem] left-1/2 size-4 -translate-x-1/2 text-ink-subtle md:hidden"
                  />
                </>
              )}
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol aria-label={label} className={cn('flex flex-col', className)}>
      {nodes.map((node, index) => {
        const last = index === nodes.length - 1
        return (
          <li key={node.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full font-mono text-caption font-medium',
                  toneSolid[node.tone ?? 'neutral'],
                )}
              >
                {index + 1}
              </span>
              {!last && <span aria-hidden className="my-1 w-px flex-1 bg-border-strong" />}
            </div>
            <div className={cn('min-w-0 pt-0.5', !last && 'pb-5')}>
              <p className="text-small font-semibold text-ink">{node.label}</p>
              {node.description && (
                <p className="mt-0.5 text-small text-ink-muted">{node.description}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
