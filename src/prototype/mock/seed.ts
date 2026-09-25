import type { DraftSection, PatentDocument, RetrievedSource } from '../types'

/*
 * Minimal FICTIONAL seed data so the architecture can be exercised end to end.
 * Identifiers use EX-… placeholders on purpose: never use real patent numbers or real parties.
 * Every record carries `illustrative: true`. Replace this content when the prototype page is designed.
 */

export const MOCK_DOCUMENTS: readonly PatentDocument[] = [
  {
    illustrative: true,
    id: 'EX-0001',
    title: 'Adaptive wearable sensor patch (fictional application)',
    type: 'Patent application',
    summary:
      'A made-up application describing a skin-worn sensor patch, used only to demonstrate the workflow.',
    pageCount: 42,
  },
]

const SOURCES: readonly RetrievedSource[] = [
  {
    illustrative: true,
    id: 'src-1',
    label: 'Claim 1',
    location: 'EX-0001 · Claims',
    excerpt:
      'A wearable sensor patch comprising a flexible substrate, an adhesive layer, and a strain sensor coupled to the substrate.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-2',
    label: 'Description, paragraph 12',
    location: 'EX-0001 · Description',
    excerpt:
      'The adhesive layer maintains skin contact while permitting moisture vapour transmission.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-3',
    label: 'Cited reference EX-P-0007',
    location: 'EX-P-0007 · Section 3',
    excerpt: 'A rigid housing is coupled to a flexible strap carrying a single motion sensor.',
    relevance: 'medium',
  },
]

const SECTIONS: readonly DraftSection[] = [
  {
    illustrative: true,
    id: 'sec-1',
    heading: 'What the application claims',
    text: 'The application claims a wearable patch built from a flexible substrate, an adhesive layer and a strain sensor.',
    sourceIds: ['src-1', 'src-2'],
    confidence: 'high',
  },
  {
    illustrative: true,
    id: 'sec-2',
    heading: 'How it may differ from the cited reference',
    text: 'The cited reference uses a rigid housing with a single motion sensor, while this application uses a flexible substrate with a strain sensor.',
    sourceIds: ['src-1', 'src-3'],
    confidence: 'medium',
  },
]

/**
 * Stand-in for the retrieval + drafting backend.
 * To connect a real service later, replace this call in usePipelineRunner. The reducer does not change.
 */
export function getMockResult(_documentId: string) {
  return { sources: SOURCES, sections: SECTIONS }
}
