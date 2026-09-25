/*
 * Shared tone vocabulary for Badge, Callout, FlowDiagram, etc.
 * Semantic tones (success/warning/danger/info) are reserved for status and review outcomes.
 * Use neutral / accent / ink for everything else.
 */
export type Tone = 'neutral' | 'accent' | 'ink' | 'success' | 'warning' | 'danger' | 'info'

/** Tinted background + border + text, used by Badge and Callout. */
export const toneSoft: Record<Tone, string> = {
  neutral: 'border-border bg-surface-subtle text-ink-muted',
  accent: 'border-accent-border bg-accent-soft text-accent-strong',
  ink: 'border-ink bg-ink text-ink-inverse',
  success: 'border-success-border bg-success-soft text-success',
  warning: 'border-warning-border bg-warning-soft text-warning',
  danger: 'border-danger-border bg-danger-soft text-danger',
  info: 'border-info-border bg-info-soft text-info',
}

/** Solid fill, used for small markers (numbered steps, dots). */
export const toneSolid: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-ink-muted',
  accent: 'bg-accent text-ink-inverse',
  ink: 'bg-ink text-ink-inverse',
  success: 'bg-success text-ink-inverse',
  warning: 'bg-warning text-ink-inverse',
  danger: 'bg-danger text-ink-inverse',
  info: 'bg-info text-ink-inverse',
}

/** Text-only color for icons. */
export const toneText: Record<Tone, string> = {
  neutral: 'text-ink-muted',
  accent: 'text-accent',
  ink: 'text-ink',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}
