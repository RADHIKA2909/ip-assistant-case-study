import {
  BadgeCheck,
  BookOpenText,
  ClipboardList,
  Clock,
  FileCheck,
  FilePenLine,
  FileSearch,
  FileText,
  ListChecks,
  PenLine,
  Radar,
  Repeat,
  ScanSearch,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tags,
  Timer,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'

/*
 * Content for /problem ("Understanding the Problem").
 *
 * Titles, the persona, goals, workflow step names, the pain/opportunity headlines and the footnote are
 * the case study author's own wording. The one-line descriptions are qualitative framing written for this
 * page: they contain no statistics and are NOT customer research. Keep it that way.
 */

export const PROBLEM_HERO = {
  eyebrow: 'AI Product Case Study',
  titlePrefix: '1. Understanding the ',
  titleEmphasis: 'Problem',
  subtitle: 'Helping patent professionals work faster, with higher quality, using AI.',
} as const

export const PERSONA = {
  label: 'Primary User',
  role: 'Patent Attorney / IP Professional',
  description: 'Works on patent drafting, prosecution, prior-art search and legal analysis.',
} as const

export interface IconText {
  icon: LucideIcon
  text: string
}

export const GOALS_LABEL = 'Key Goals'

export const GOALS: readonly IconText[] = [
  { icon: BadgeCheck, text: 'Produce high-quality, accurate work product' },
  { icon: Timer, text: 'Reduce time spent on manual research and drafting' },
  { icon: FileSearch, text: 'Find relevant prior-art and prosecution information quickly' },
  { icon: UserCheck, text: 'Maintain expert control over the final output' },
]

export interface WorkflowStepContent {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** Marks the steps that are heavy on reading and cross-referencing. Must be contiguous. */
  heavy?: boolean
}

export const WORKFLOW_LABEL = 'Current Workflow (Simplified)'
export const WORKFLOW_NOTE = 'Multiple information-heavy steps before producing the final work product.'
export const WORKFLOW_HEAVY_LABEL = 'Information-heavy steps'

export const WORKFLOW: readonly WorkflowStepContent[] = [
  {
    id: 'review-invention',
    icon: ClipboardList,
    title: 'Review invention details',
    description: 'Understand the invention, its claims and technical context.',
  },
  {
    id: 'search-prior-art',
    icon: Search,
    title: 'Search prior art & relevant documents',
    description: 'Look through patents, publications and other sources.',
    heavy: true,
  },
  {
    id: 'analyze-documents',
    icon: BookOpenText,
    title: 'Analyze & read documents',
    description: 'Study long, technical documents for what matters.',
    heavy: true,
  },
  {
    id: 'draft',
    icon: PenLine,
    title: 'Draft response / application',
    description: 'Write arguments and claims, citing supporting evidence.',
    heavy: true,
  },
  {
    id: 'review-file',
    icon: FileCheck,
    title: 'Review, edit and file',
    description: 'Refine the draft, apply judgment, then submit.',
  },
]

export interface PairSide {
  icon: LucideIcon
  title: string
  description: string
}

/** Each pain point is paired 1:1 with the AI opportunity that answers it, so the pairing cannot drift. */
export interface PainOpportunityPair {
  id: string
  pain: PairSide
  opportunity: PairSide
}

export const PAIN_TITLE = 'Key Pain Points'
export const OPPORTUNITY_TITLE = 'Opportunity Areas for AI'
export const PAIR_ADDRESSES_LABEL = 'Addresses'

export const PAIRS: readonly PainOpportunityPair[] = [
  {
    id: 'search',
    pain: {
      icon: Clock,
      title: 'Time-consuming document search and analysis',
      description: 'Finding relevant prior art means searching across many sources.',
    },
    opportunity: {
      icon: ScanSearch,
      title: 'Intelligent document search and understanding',
      description: 'Find relevant passages by meaning, not just keywords.',
    },
  },
  {
    id: 'reading',
    pain: {
      icon: FileText,
      title: 'Reading and summarizing long, complex documents',
      description: 'Dense specifications and office actions take careful reading.',
    },
    opportunity: {
      icon: ListChecks,
      title: 'Summarization and key insight extraction',
      description: 'Surface claims, arguments and key points from long documents.',
    },
  },
  {
    id: 'drafting',
    pain: {
      icon: Repeat,
      title: 'Drafting repetitive sections and responses',
      description: 'Similar structures recur, yet each still needs tailoring.',
    },
    opportunity: {
      icon: FilePenLine,
      title: 'Draft assistance with citations and evidence',
      description: 'Generate structured first drafts, each point linked to its source.',
    },
  },
  {
    id: 'monitoring',
    pain: {
      icon: Radar,
      title: 'Keeping up with relevant prior art',
      description: 'New publications and filings keep appearing.',
    },
    opportunity: {
      icon: Tags,
      title: 'Automated document analysis and classification',
      description: 'Triage documents by type, claims and technical concepts.',
    },
  },
  {
    id: 'accuracy',
    pain: {
      icon: ShieldAlert,
      title: 'High accuracy expectations for professional/legal work',
      description: 'Output has to be accurate, well-cited and defensible.',
    },
    opportunity: {
      icon: ShieldCheck,
      title: 'Expert-in-the-loop validation',
      description: 'Experts review the evidence, then approve, edit or reject.',
    },
  },
]

export const PROBLEM_NOTE =
  'Problem framing based on publicly available information and product/domain understanding. Proposed case study — not internal company data.'
