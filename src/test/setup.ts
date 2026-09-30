import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom does not implement scrolling; react-router's <ScrollRestoration> calls it on navigation,
// and components like SourceDrawer call element.scrollIntoView().
window.scrollTo = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}

afterEach(() => {
  cleanup()
})
