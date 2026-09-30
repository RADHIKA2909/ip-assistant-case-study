import { Card, CardHeader } from '@/components/ui/Card'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { QUALITY_ROWS } from '../content'

/**
 * Static illustrative quality summary - not derived from any real computation. Every row carries
 * an IllustrativeTag so it can never be mistaken for a real measurement.
 */
export function QualityPanel() {
  return (
    <Card as="section" aria-labelledby="quality-panel-title" padding="md" className="mt-4">
      <CardHeader headingLevel="h2" title={<span id="quality-panel-title">Evidence &amp; quality</span>} />
      <dl className="mt-3 space-y-3">
        {QUALITY_ROWS.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0">
            <dt className="text-small text-ink-muted">{row.label}</dt>
            <dd className="flex items-center gap-2 text-small font-semibold text-ink">
              {row.value}
              <IllustrativeTag />
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
