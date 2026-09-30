import { FileStack } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CURRENT_SIDEBAR_ITEM, SIDEBAR_ITEMS, WORKSPACE_NAME } from '../content'

interface ProductShellProps {
  topBar: ReactNode
  children: ReactNode
}

/**
 * The enterprise-app chrome: a white, structured, bordered frame sitting inside the case study's
 * ivory page, with its own sidebar + top bar - the visual signal that the viewer has stepped from
 * the editorial case study into the actual product. Denser than Pages 1-2 on purpose.
 */
export function ProductShell({ topBar, children }: ProductShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-raised lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="border-b border-border px-4 py-3 sm:px-6">{topBar}</div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}

function Sidebar() {
  const currentRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    // Below `lg` the nav is a horizontal scroll strip that starts scrolled to the left, which
    // would otherwise hide which item is current (it isn't always the first one).
    currentRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [])

  return (
    <nav
      aria-label={WORKSPACE_NAME}
      className="shrink-0 border-b border-border bg-surface-subtle p-3 lg:w-60 lg:border-r lg:border-b-0 lg:p-4"
    >
      <div className="mb-4 hidden items-center gap-2 px-1 lg:flex">
        <span aria-hidden className="grid size-7 place-items-center rounded-md bg-ink text-ink-inverse">
          <FileStack className="size-4" />
        </span>
        <span className="text-small font-semibold text-ink">{WORKSPACE_NAME}</span>
      </div>

      {/* Below lg: a horizontal scrollable strip instead of a second overlay pattern. */}
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon
          const current = item.id === CURRENT_SIDEBAR_ITEM
          return (
            <li key={item.id} ref={current ? currentRef : undefined} className="shrink-0 lg:shrink">
              <span
                aria-current={current ? 'page' : undefined}
                title={!current ? `${item.label} (not part of this prototype)` : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-small font-medium whitespace-nowrap',
                  current ? 'bg-ink text-ink-inverse' : 'text-ink-muted',
                )}
              >
                <Icon aria-hidden className="size-4 shrink-0" />
                {item.label}
              </span>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
