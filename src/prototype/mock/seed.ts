import type { DraftSection, PatentDocument, RetrievedSource } from '../types'

/*
 * Minimal FICTIONAL seed data so the architecture can be exercised end to end.
 * Identifiers use EX-… placeholders on purpose: never use real patent numbers or real parties.
 * Every record carries `illustrative: true`.
 *
 * The scenario: a fictional application for a wearable sensor patch (flexible substrate + strain
 * sensor) has received an illustrative Office Action rejecting Claim 1 as obvious over a cited
 * reference (a rigid housing with a single motion sensor). The prototype walks through analysing
 * that Office Action and drafting a response, grounded in three pieces of evidence.
 */

export const MOCK_DOCUMENTS: readonly PatentDocument[] = [
  {
    illustrative: true,
    id: 'EX-OA-1204',
    title: 'Office Action — Application No. EX-0001 (fictional)',
    type: 'Office Action',
    summary:
      'A made-up Office Action rejecting the claimed wearable sensor patch as obvious over a cited reference, used only to demonstrate the workflow.',
    pageCount: 6,
  },
]

/**
 * The Office Action text shown in the document panel. `{{src-1}}` / `{{src-2}}` mark the two
 * passages that map to retrieved sources, so the UI can render them as clickable highlights.
 */
export const OFFICE_ACTION_TEXT = {
  heading: 'Office Action — Application No. EX-0001',
  meta: 'Examiner: J. Alvarez (fictional) · Mailed: illustrative date · Application: fictional',
  paragraphs: [
    'Claim 1 is rejected under obviousness. The claim recites {{src-1}}.',
    'The Examiner finds this claim unpatentable in view of {{src-2}}. A person of ordinary skill would find substituting a flexible substrate for a rigid housing to be an obvious design choice, absent a showing of unexpected results.',
    'Applicant is invited to distinguish the claimed sensor assembly from the cited reference, or to amend the claim to more clearly recite the distinguishing structure.',
  ],
} as const

const SOURCES: readonly RetrievedSource[] = [
  {
    illustrative: true,
    id: 'src-1',
    label: 'Claim 1 (as filed)',
    category: 'Patent Claim',
    location: 'EX-0001 · Claims',
    excerpt:
      'A wearable sensor patch comprising a flexible substrate, an adhesive layer, and a strain sensor coupled to the substrate.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-2',
    label: 'Cited reference — EX-P-0007',
    category: 'Prior Art Document',
    location: 'EX-P-0007 · Section 3',
    excerpt: 'A rigid housing is coupled to a flexible strap carrying a single motion sensor.',
    relevance: 'high',
  },
  {
    illustrative: true,
    id: 'src-3',
    label: 'Examiner interview summary (fictional)',
    category: 'Prosecution History',
    location: 'EX-0001 · Interview summary',
    excerpt:
      'Examiner noted that a flexible-substrate embodiment with an integrated strain sensor was not previously discussed on the record.',
    relevance: 'medium',
  },
]

const SECTIONS: readonly DraftSection[] = [
  {
    illustrative: true,
    id: 'sec-1',
    heading: 'Response to the obviousness rejection',
    text: 'Claim 1 recites a flexible substrate with an integrated strain sensor, structurally distinct from a rigid housing paired with a separate motion sensor. This is not a mere design choice: the flexible construction is what enables sustained skin contact, which the cited reference does not address.',
    sourceIds: ['src-1', 'src-2'],
    confidence: 'high',
  },
  {
    illustrative: true,
    id: 'sec-2',
    heading: 'Distinction from the cited reference',
    text: 'The cited reference discloses a rigid housing and a single motion sensor, with no flexible substrate or strain-sensing element. As the examiner interview record reflects, this combination was not previously on the record, supporting patentability of the amended claim language.',
    sourceIds: ['src-2', 'src-3'],
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
