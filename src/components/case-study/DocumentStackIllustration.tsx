import { cn } from '@/lib/cn'

/**
 * Hero illustration: a stack of patent-style sheets with a drawing, highlighted passages and
 * annotation chips. Stands in for photography: it conveys "dense document, many things to
 * cross-check" without stock imagery. All text in it is placeholder, and all color comes from tokens.
 */
export function DocumentStackIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 340"
      role="img"
      aria-label="Illustration of a patent document with a drawing, highlighted passages and annotations for a claim and prior art"
      className={cn('block h-auto w-full', className)}
    >
      {/* soft backdrop */}
      <rect x="8" y="8" width="504" height="324" rx="24" className="fill-surface-subtle" />

      {/* sheets behind */}
      <g transform="rotate(7 270 172)">
        <rect x="150" y="28" width="240" height="284" rx="8" className="fill-surface-sunken stroke-border-strong" />
      </g>
      <g transform="rotate(-4 270 172)">
        <rect x="150" y="28" width="240" height="284" rx="8" className="fill-surface stroke-border-strong" />
        <rect x="170" y="52" width="90" height="5" rx="2.5" className="fill-border-strong" />
        <rect x="170" y="66" width="140" height="4" rx="2" className="fill-border" />
      </g>

      {/* front sheet */}
      <rect x="150" y="30" width="240" height="284" rx="8" className="fill-surface stroke-border-strong" strokeWidth="1.25" />
      <rect x="170" y="50" width="72" height="6" rx="3" className="fill-ink" />
      <rect x="170" y="63" width="112" height="4" rx="2" className="fill-border-strong" />
      <text x="372" y="57" textAnchor="end" className="fill-ink-subtle font-mono text-[9px] tracking-wide">
        EX-0001
      </text>

      {/* figure */}
      <rect x="170" y="80" width="200" height="104" rx="4" className="fill-surface-subtle stroke-border" />
      <g className="fill-none stroke-ink" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="198" y="112" width="72" height="44" rx="3" />
        <line x1="270" y1="134" x2="292" y2="134" />
        <circle cx="314" cy="134" r="21" />
        <circle cx="314" cy="134" r="8" />
        <line x1="212" y1="126" x2="256" y2="126" />
        <line x1="212" y1="140" x2="244" y2="140" />
      </g>
      <g className="stroke-ink-subtle" strokeWidth="1" fill="none">
        <path d="M212 104l8 10" />
        <path d="M304 103l6 12" />
        <path d="M240 176l-6-18" />
      </g>
      <g className="fill-ink-subtle font-mono text-[9px]">
        <text x="204" y="100">12</text>
        <text x="300" y="99">14</text>
        <text x="238" y="181">20</text>
      </g>
      <text x="176" y="177" className="fill-ink-muted font-mono text-[8px] tracking-wide">
        FIG. 2
      </text>

      {/* text lines, two highlighted */}
      <g className="fill-border-strong">
        <rect x="170" y="204" width="200" height="4" rx="2" />
        <rect x="170" y="228" width="196" height="4" rx="2" />
        <rect x="170" y="240" width="122" height="4" rx="2" />
        <rect x="170" y="258" width="200" height="4" rx="2" />
        <rect x="170" y="282" width="196" height="4" rx="2" />
        <rect x="170" y="294" width="88" height="4" rx="2" />
      </g>
      <rect x="166" y="211" width="208" height="12" rx="3" className="fill-accent-soft" />
      <rect x="170" y="215" width="198" height="4" rx="2" className="fill-accent" opacity="0.75" />
      <rect x="166" y="265" width="208" height="12" rx="3" className="fill-accent-soft" />
      <rect x="170" y="269" width="180" height="4" rx="2" className="fill-accent" opacity="0.75" />

      {/* annotation: claim */}
      <line x1="118" y1="217" x2="166" y2="217" className="stroke-accent" strokeWidth="1.5" />
      <circle cx="166" cy="217" r="3" className="fill-accent" />
      <rect x="34" y="204" width="86" height="26" rx="13" className="fill-accent" />
      <text x="77" y="221" textAnchor="middle" className="fill-ink-inverse font-mono text-[11px] font-medium">
        Claim 1
      </text>

      {/* annotation: prior art */}
      <line x1="134" y1="112" x2="170" y2="112" className="stroke-accent" strokeWidth="1.5" />
      <circle cx="170" cy="112" r="3" className="fill-accent" />
      <rect x="34" y="99" width="100" height="26" rx="13" className="fill-surface stroke-accent" strokeWidth="1.5" />
      <text x="84" y="116" textAnchor="middle" className="fill-accent-strong font-mono text-[11px] font-medium">
        Prior art
      </text>

      {/* annotation: citation */}
      <line x1="374" y1="271" x2="402" y2="271" className="stroke-border-strong" strokeWidth="1.5" />
      <circle cx="374" cy="271" r="3" className="fill-ink-subtle" />
      <rect x="402" y="258" width="82" height="26" rx="13" className="fill-surface stroke-border-strong" strokeWidth="1.25" />
      <text x="443" y="275" textAnchor="middle" className="fill-ink-muted font-mono text-[11px] font-medium">
        Citation
      </text>
    </svg>
  )
}
