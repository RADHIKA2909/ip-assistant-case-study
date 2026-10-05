import type { DraftSection, PatentDocument, RetrievedSource } from '../types'

/*
 * Minimal FICTIONAL seed data so the workflow can be exercised end to end.
 * Identifiers use EX-… placeholders on purpose: never use real patent numbers or real parties.
 * Every record carries `illustrative: true`.
 *
 * The scenario, kept deliberately simple: a fictional company has applied to patent a smart water
 * bottle that tracks how much water the user drinks. An examiner objects, because an existing
 * water bottle already measures how much water remains inside it. The AI compares the two and
 * drafts a response; the patent professional decides what happens next.
 */

export const MOCK_DOCUMENTS: readonly PatentDocument[] = [
  {
    illustrative: true,
    id: 'EX-OA-1204',
    title: 'Office Action — Application No. EX-0001 (fictional)',
    type: 'Office Action',
    summary: 'Examiner review of a smart water bottle patent application.',
    pageCount: 6,
  },
]

interface OfficeActionSection {
  id: string
  label: string
  text: string
  /** When set, the passage is clickable and opens that source as evidence. */
  sourceId?: string
}

/** The Office Action, split into the three plain-English parts the prototype walks through. */
export const OFFICE_ACTION_TEXT: {
  heading: string
  meta: string
  sections: readonly OfficeActionSection[]
} = {
  heading: 'Office Action — Application No. EX-0001 (fictional)',
  meta: 'Examiner review of a smart water bottle patent application.',
  sections: [
    {
      id: 'claim',
      label: "Claim 1 — Company’s claim",
      text: 'A smart water bottle that tracks how much water the user drinks.',
      sourceId: 'src-1',
    },
    {
      id: 'objection',
      label: 'Examiner objection',
      text: 'The examiner believes Claim 1 may not be patentable because a previous reference already describes a water bottle that measures the amount of water inside it.',
    },
    {
      id: 'prior-art',
      label: 'Prior art — Existing reference',
      text: 'A water bottle that measures how much water remains inside the bottle.',
      sourceId: 'src-2',
    },
  ],
}

const SOURCES: readonly RetrievedSource[] = [
  {
    illustrative: true,
    id: 'src-1',
    label: "Claim 1 — Company’s claim",
    citationLabel: "Claim 1 — Company’s claim",
    category: "Company’s claim",
    location: 'Application No. EX-0001 · Claim 1',
    excerpt: 'A smart water bottle that tracks how much water the user drinks.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-2',
    label: 'Prior Art — Existing water bottle reference',
    citationLabel: 'Prior Art — Existing reference',
    category: 'Existing reference',
    location: 'Prior art reference (existing product)',
    excerpt: 'A water bottle that measures how much water remains inside the bottle.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-3',
    label: 'Examiner Objection',
    citationLabel: 'Examiner Objection',
    category: 'Examiner objection',
    location: 'Office Action · Examiner objection',
    excerpt:
      'The examiner believes Claim 1 may not be patentable because a previous reference already describes a water bottle that measures the amount of water inside it.',
    relevance: 'medium',
  },
]

/**
 * One short, plain-English draft response. Its explanation ("Why this answer?") lives in
 * prototype/content.ts so the copy stays with the other workspace text.
 */
const SECTIONS: readonly DraftSection[] = [
  {
    illustrative: true,
    id: 'sec-1',
    heading: 'Response to the examiner',
    text: 'Claim 1 focuses on tracking how much water the user drinks. The cited reference only describes measuring how much water remains inside the bottle. It does not describe tracking the amount consumed by the user. Therefore, the claimed functionality is different from the cited reference.',
    sourceIds: ['src-1', 'src-2'],
    confidence: 'high',
  },
]

/**
 * Stand-in for the retrieval + drafting backend.
 * To connect a real service later, replace this call in usePipelineRunner. The reducer does not change.
 */
export function getMockResult(_documentId: string) {
  return { sources: SOURCES, sections: SECTIONS }
}
