import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

/** Page-width wrapper with the shared side gutters. Every page section sits inside one. */
export function Container({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-auto w-full max-w-page px-5 sm:px-8', className)} {...rest} />
}
