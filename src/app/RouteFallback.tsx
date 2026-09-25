import { Spinner } from '@/components/ui/Loading'

/** Shown while the first route's code is loading. Also the router's HydrateFallback. */
export function RouteFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas">
      <Spinner label="Loading page" className="size-6" />
    </div>
  )
}
