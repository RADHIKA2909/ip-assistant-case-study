import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
}

interface TabsProps {
  items: readonly TabItem[]
  /** Accessible name for the tab list */
  label: string
  /** Uncontrolled initial tab */
  defaultId?: string
  /** Controlled selected tab */
  value?: string
  onValueChange?: (id: string) => void
  className?: string
}

/** Accessible tabs: roving tabindex, Arrow/Home/End keys, automatic activation. */
export function Tabs({ items, label, defaultId, value, onValueChange, className }: TabsProps) {
  const uid = useId()
  const [internal, setInternal] = useState(defaultId ?? items[0]?.id)
  const activeId = value ?? internal
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const select = (id: string) => {
    setInternal(id)
    onValueChange?.(id)
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1
    const target =
      event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (target === null) return
    event.preventDefault()
    const next = items[target]
    if (!next) return
    select(next.id)
    refs.current[next.id]?.focus()
  }

  const active = items.find((item) => item.id === activeId)

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {items.map((item, index) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                '-mb-px cursor-pointer border-b-2 px-3 py-2.5 text-small font-medium whitespace-nowrap transition-colors duration-150',
                selected
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={`${uid}-panel-${active.id}`}
          aria-labelledby={`${uid}-tab-${active.id}`}
          tabIndex={0}
          className="pt-5"
        >
          {active.content}
        </div>
      )}
    </div>
  )
}
