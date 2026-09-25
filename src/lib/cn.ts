import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * tailwind-merge only knows Tailwind's default scales. Register our design-token names
 * (src/styles/index.css) so e.g. `text-small` is treated as a font size, not a color,
 * and does not get dropped when merged with `text-ink-muted`.
 * Keep these lists in sync with the @theme block.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'h1', 'h2', 'h3', 'lead', 'body', 'small', 'caption', 'overline'],
      shadow: ['card', 'raised'],
      container: ['page'],
      animate: ['rise'],
    },
  },
})

/** Merge conditional class names and resolve Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
