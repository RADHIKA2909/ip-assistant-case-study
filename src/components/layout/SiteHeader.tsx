import { FileSearch, Menu, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { SECTIONS, SITE } from '@/content/site'
import { cn } from '@/lib/cn'
import { Container } from './Container'

/** Desktop: text with a 2px accent underline on the current page, sitting on the header's bottom edge. */
const desktopLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex h-full items-center gap-2 border-b-2 px-3 text-small font-medium transition-colors duration-150',
    isActive ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink',
  )

/** Mobile menu: a soft accent fill marks the current page. */
const mobileLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2 rounded-md px-3 py-2.5 text-small font-medium transition-colors duration-150',
    isActive
      ? 'bg-accent-soft text-accent-strong'
      : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
  )

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const renderItems = (linkClass: typeof desktopLink) => (
    <>
      <li>
        {/* `end` so this doesn't read as "active" on every route - NavLink otherwise matches
            any path starting with "/". */}
        <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
          Overview
        </NavLink>
      </li>
      {SECTIONS.map((section) => (
        <li key={section.id}>
          <NavLink to={section.path} className={linkClass} onClick={() => setOpen(false)}>
            <span className="font-mono text-caption text-ink-subtle">{section.number}</span>
            {section.shortTitle}
          </NavLink>
        </li>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-md"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-ink text-ink-inverse"
          >
            <FileSearch className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-small font-semibold">{SITE.shortName}</span>
            <span className="block text-caption text-ink-subtle">Case study</span>
          </span>
        </Link>

        <nav aria-label="Case study sections" className="hidden self-stretch lg:block">
          <ul className="flex h-full items-stretch gap-1">{renderItems(desktopLink)}</ul>
        </nav>

        <button
          type="button"
          className="-mr-2 grid size-10 cursor-pointer place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {open && (
        <nav
          id={menuId}
          aria-label="Case study sections (mobile)"
          className="border-t border-border bg-canvas lg:hidden"
        >
          <Container className="py-3">
            <ul className="flex flex-col gap-1">{renderItems(mobileLink)}</ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
