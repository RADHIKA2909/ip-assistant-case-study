import { createBrowserRouter, type RouteObject } from 'react-router'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { RouteError } from '@/pages/RouteError'
import { AppLayout } from './AppLayout'
import { RouteFallback } from './RouteFallback'

/*
 * Route table. Paths mirror SECTIONS in src/content/site.ts.
 * Pages are code-split with route-level `lazy`, so the heavy prototype page does not load with Home.
 * The pathless child route puts the error boundary INSIDE AppLayout, so nav and footer survive an error.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    HydrateFallback: RouteFallback,
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          { index: true, Component: Home },
          {
            path: 'problem',
            lazy: () => import('@/pages/Problem').then((m) => ({ Component: m.Problem })),
          },
          {
            path: 'ai-opportunity',
            lazy: () =>
              import('@/pages/AiOpportunity').then((m) => ({ Component: m.AiOpportunity })),
          },
          {
            path: 'prototype',
            lazy: () => import('@/pages/Prototype').then((m) => ({ Component: m.Prototype })),
          },
          {
            path: 'evaluation',
            lazy: () => import('@/pages/Evaluation').then((m) => ({ Component: m.Evaluation })),
          },
          {
            path: 'tpm-thinking',
            lazy: () => import('@/pages/TpmThinking').then((m) => ({ Component: m.TpmThinking })),
          },
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
]

export const createAppRouter = () => createBrowserRouter(routes)
