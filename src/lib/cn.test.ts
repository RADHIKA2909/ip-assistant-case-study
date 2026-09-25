import { cn } from './cn'

describe('cn', () => {
  it('keeps a custom font-size token alongside a custom text color', () => {
    expect(cn('text-small', 'text-ink-muted')).toBe('text-small text-ink-muted')
  })

  it('lets a later color override an earlier one', () => {
    expect(cn('text-ink', 'text-accent')).toBe('text-accent')
  })

  it('lets a later font-size token override an earlier one', () => {
    expect(cn('text-body', 'text-small')).toBe('text-small')
  })

  it('keeps custom shadow tokens distinct from shadow colors', () => {
    expect(cn('shadow-card', 'shadow-raised')).toBe('shadow-raised')
  })

  it('drops falsy conditionals', () => {
    expect(cn('a', { b: false }, undefined, 'c')).toBe('a c')
  })
})
