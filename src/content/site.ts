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
    "Independent case study of a proposed product concept. Workflows, architecture, data and metrics shown here are illustrative and do not represent any company's actual implementation.",
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
    shortTitle: 'AI Product Opportunity',
    summary:
      'Where retrieval, reasoning and drafting genuinely help, and where a human must stay in the loop.',
    question: 'Where can AI genuinely help, and where should it never act alone?',
  },
  {
    id: 'prototype',
    path: '/prototype',
    number: '03',
    title: 'Interactive AI Product Experience',
    shortTitle: 'Product',
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
    shortTitle: 'TPM Thinking',
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
    id: 'ingestion',
    label: 'Document ingestion & indexing',
    description:
      'Documents are uploaded, processed and prepared so the system can search them efficiently.',
    actor: 'ai',
  },
  {
    id: 'rag',
    label: 'Retrieval & context grounding (RAG)',
    description:
      'When the professional asks something, the system finds the most relevant passages and gives them to the AI as context.',
    actor: 'ai',
  },
  {
    id: 'reasoning',
    label: 'Reasoning & agentic workflow',
    description:
      'AI analyzes the retrieved information and breaks the task into steps when needed.',
    actor: 'ai',
  },
  {
    id: 'draft',
    label: 'Structured draft or recommendation',
    description: 'AI produces a useful draft or recommendation rather than a wall of text.',
    actor: 'ai',
  },
  {
    id: 'evidence',
    label: 'Evidence & citations',
    description: 'The professional can see the source passages supporting the AI’s claims.',
    actor: 'ai',
  },
  {
    id: 'review',
    label: 'Expert review',
    description: 'The patent professional reviews the output and its evidence.',
    actor: 'human',
  },
  {
    id: 'decision',
    label: 'Approve, edit or reject',
    description: 'The expert makes the final decision.',
    actor: 'human',
  },
  {
    id: 'feedback',
    label: 'Feedback & continuous improvement',
    description:
      'Those decisions and edits become signals for improving and evaluating the system.',
    actor: 'loop',
  },
]
