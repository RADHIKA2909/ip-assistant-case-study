import { Disclosure } from '@/components/ui/Disclosure'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { HOW_WE_MEASURE_LABEL, type Metric } from '@/content/evaluation'

interface MetricGridProps {
  metrics: readonly Metric[]
  label: string
}

/**
 * A restrained stat-tile grid, not a dashboard: no color-coding of "good" vs "bad" (these are
 * invented numbers - implying some are concerning would overclaim precision this project doesn't
 * have), no legend or hover tooltip (each tile is an independent figure, not a chart). Per the
 * dataviz skill's figure spec, the value is set in the sans face at semibold weight with
 * proportional figures - a standalone stat value in the page's serif would read as decoration,
 * not data.
 */
export function MetricGrid({ metrics, label }: MetricGridProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <li key={metric.id} className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
          {/* Proportional figures (the default), not tabular-nums: these values aren't a column of
              digit-aligned numbers, and their formats differ (%, $, s) so alignment wouldn't hold anyway. */}
          <p className="font-sans text-h2 font-semibold text-ink">{metric.value}</p>
          <p className="mt-1 flex items-center gap-1.5 text-small font-semibold text-ink">
            {metric.label}
            <IllustrativeTag />
          </p>
          <p className="mt-1 text-caption text-ink-muted">{metric.explanation}</p>

          <Disclosure summary={HOW_WE_MEASURE_LABEL} className="mt-2.5">
            <p className="text-caption text-ink-muted">{metric.howWeMeasure}</p>
          </Disclosure>
        </li>
      ))}
    </ul>
  )
}
