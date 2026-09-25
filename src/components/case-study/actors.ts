import type { Actor } from '@/content/site'
import type { Tone } from '@/components/ui/tones'

/** Visual tone for each actor in the product story: where AI works and where a human decides. */
export const ACTOR_TONE: Record<Actor, Tone> = {
  input: 'neutral',
  ai: 'accent',
  human: 'ink',
  loop: 'success',
}
