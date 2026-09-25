/*
 * Site-wide content. This file is the single source of truth for:
 *  - the concept's working title and disclaimer copy
 *  - the five case-study sections (drives routes, header nav, home index, prev/next pager)
 *  - the core product story shown on the home page
 *
 * Page-specific content should live in its own file next to this one (problem.ts, ...),
 * not inside page components.
 */

export const SITE = {
  /** Working title of the proposed product concept. Change here and it updates everywhere. */
  conceptName: 'Evidence-Grounded IP Assistant',
  shortName: 'IP Assistant',
  tagline: 'A proposed AI product concept for document-heavy patent and IP workflows',
  principle: 'AI should assist the professional, not blindly replace expert judgment.',
  disclaimer:
    'Independent case study of a proposed product concept. Workflows, architecture, data and metrics shown here are illustrative and are not the implementation of any company.',
} as const

export function pageTitle(part?: string) {
  return part ? `${part} · ${SITE.shortName} case study` : `${SITE.conceptName} · case study`
}

export type SectionId = 'problem' | 'ai-opportunity' | 'prototype' | 'evaluation' | 'tpm-thinking'

export interface Section {
  id: SectionId
  path: `/${SectionId}`
  /** Two-digit index shown as an eyebrow, e.g. "01" */
  number: string
  title: string
  /** Compact label for nav and pager */
  shortTitle: string
  summary: string
  /** The one question this page exists to answer */
  question: string
}

export const SECTIONS: readonly Section[] = [
  {
    id: 'problem',
    path: '/problem',
    number: '01',
    title: 'Understanding the Problem',
    shortTitle: 'Problem',
    summary:
      'Why expert work on complex patent and IP documents is slow, hard to verify, and difficult to scale.',
    question: 'What makes this workflow hard today, and for whom?',
  },
  {
    id: 'ai-opportunity',
    path: '/ai-opportunity',
    number: '02',
    title: 'AI Product Opportunity',
    shortTitle: 'Opportunity',
    summary:
      'Where retrieval, reasoning and drafting genuinely help, and where a human must stay in the loop.',
    question: 'Where can AI genuinely help, and where should it never act alone?',
  },
  {
    id: 'prototype',
    path: '/prototype',
    number: '03',
    title: 'Interactive AI Product Experience',
    shortTitle: 'Prototype',
    summary:
      'One end-to-end workflow: analyse a document, inspect the evidence, then approve, edit or reject the draft.',
    question: 'What does an evidence-grounded, expert-reviewed AI workflow feel like end to end?',
  },
  {
    id: 'evaluation',
    path: '/evaluation',
    number: '04',
    title: 'Evaluation & Safety',
    shortTitle: 'Evaluation',
    summary:
      'How output quality is measured, what guardrails apply, and what happens when the AI is wrong.',
    question: 'How do we know the AI output is good, and what happens when it is not?',
  },
  {
    id: 'tpm-thinking',
    path: '/tpm-thinking',
    number: '05',
    title: 'TPM Thinking',
    shortTitle: 'TPM thinking',
    summary:
      'How a technical product manager would scope, sequence, prioritise and measure this product.',
    question: 'How would a TPM scope, sequence and measure this product?',
  },
]

export function getSection(id: SectionId): Section {
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) throw new Error(`Unknown section: ${id}`)
  return section
}

/**
 * The seven questions every feature in this case study should answer.
 * Placeholder pages list them; real pages should be able to answer all of them.
 */
export const PRODUCT_QUESTIONS = [
  'What user problem does this solve?',
  'Why does AI help?',
  'Why is this the right workflow?',
  'How do we know the AI output is good?',
  'Where does human judgment remain necessary?',
  'What could go wrong?',
  'How would we measure success?',
] as const

/**
 * Who acts at each step of the core story. Drives node tone in the flow diagram
 * so the reader can see where AI works and where a human decides.
 */
export type Actor = 'input' | 'ai' | 'human' | 'loop'

export const ACTOR_LABEL: Record<Actor, string> = {
  input: 'Source material',
  ai: 'AI system',
  human: 'Expert',
  loop: 'Improvement loop',
}

export interface CoreStoryStep {
  id: string
  label: string
  /** Product reason for the step, not a technical description */
  description: string
  actor: Actor
}

export const CORE_STORY: readonly CoreStoryStep[] = [
  {
    id: 'documents',
    label: 'Complex professional documents',
    description: 'Long, dense patent and IP files are the raw material.',
    actor: 'input',
  },
  {
    id: 'understanding',
    label: 'Retrieval & understanding',
    description: 'Find what matters in the document instead of reading all of it.',
    actor: 'ai',
  },
  {
    id: 'rag',
    label: 'Knowledge retrieval (RAG)',
    description: 'Ground every answer in retrieved passages, not model memory.',
    actor: 'ai',
  },
  {
    id: 'reasoning',
    label: 'Reasoning & agentic workflow',
    description: 'Break the task into steps the system can check and explain.',
    actor: 'ai',
  },
  {
    id: 'draft',
    label: 'Structured draft or recommendation',
    description: 'A usable first draft, not a wall of text.',
    actor: 'ai',
  },
  {
    id: 'evidence',
    label: 'Evidence & citations',
    description: 'Every claim links to the passage that supports it.',
    actor: 'ai',
  },
  {
    id: 'review',
    label: 'Expert review',
    description: 'A professional inspects the evidence and owns the judgment.',
    actor: 'human',
  },
  {
    id: 'decision',
    label: 'Approve, edit or reject',
    description: 'The expert decides. Nothing ships without this step.',
    actor: 'human',
  },
  {
    id: 'feedback',
    label: 'Feedback & continuous improvement',
    description: 'Decisions and edits become signals for evaluating and improving the system.',
    actor: 'loop',
  },
]
