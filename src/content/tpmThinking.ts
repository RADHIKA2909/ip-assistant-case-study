import {
  BarChart3,
  Blocks,
  CheckCircle2,
  CircleCheck,
  Clock,
  DollarSign,
  FileWarning,
  Gauge,
  Lock,
  Repeat,
  ShieldAlert,
  ShieldCheck,
  Timer,
  TimerReset,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

/*
 * Content for /tpm-thinking ("TPM Thinking") - the final conceptual page.
 *
 * Section headings, the MVP/Later scope items, the prioritization criteria and worked examples,
 * the North Star and metric names, the risk/mitigation pairs, the validation loop and the final
 * principle are the case study author's own wording (from the Page 5 brief), reused close to
 * verbatim. This page's own addition: the one-line definition per supporting metric (purely
 * descriptive of what's measured - the brief gives no numbers here, so none are invented).
 */

export const TPM_HERO = {
  eyebrow: '05 — TPM Thinking',
  titlePrefix: 'From AI capability to a product ',
  titleEmphasis: 'customers can trust',
  titleSuffix: '.',
  subtitle:
    'The opportunity is not to add AI everywhere. It is to identify the highest-value workflow, validate it with experts and build the right level of automation around it.',
} as const

export interface ScopeItem {
  id: string
  text: string
}

export const MVP_LABEL = 'MVP'
export const MVP_TITLE = 'Evidence-grounded AI drafting assistant'
export const MVP_ITEMS: readonly ScopeItem[] = [
  { id: 'ingestion', text: 'Document ingestion' },
  { id: 'retrieval', text: 'Semantic retrieval' },
  { id: 'draft', text: 'Evidence-backed AI draft' },
  { id: 'citations', text: 'Source citations' },
  { id: 'review', text: 'Expert review' },
  { id: 'decision', text: 'Approve / Edit / Reject' },
  { id: 'feedback', text: 'Feedback capture' },
]

export const LATER_LABEL = 'Later'
export const LATER_TITLE = 'Expand the workflow'
export const LATER_ITEMS: readonly ScopeItem[] = [
  { id: 'multi-doc', text: 'Multi-document reasoning' },
  { id: 'agentic', text: 'Agentic research workflows' },
  { id: 'knowledge-graph', text: 'Knowledge graph integration' },
  { id: 'orchestration', text: 'Automated workflow orchestration' },
  { id: 'integrations', text: 'Deeper enterprise integrations' },
]

export const MVP_NOTE = 'Start with one high-value workflow before expanding automation.'

export const PRIORITIZATION_LABEL = 'Prioritization'

export interface IconText {
  icon: LucideIcon
  text: string
}

export const CRITERIA: readonly IconText[] = [
  { icon: Users, text: 'Customer Value' },
  { icon: BarChart3, text: 'Business Impact' },
  { icon: Blocks, text: 'Technical Feasibility' },
  { icon: ShieldAlert, text: 'Risk / Accuracy' },
]

export interface PrioritizationExample {
  id: string
  conditions: readonly string[]
  conditionTone: 'success' | 'warning' | 'neutral'
  conclusion: string
  tag?: string
}

export const PRIORITIZATION_EXAMPLES: readonly PrioritizationExample[] = [
  {
    id: 'mvp',
    conditions: ['High value', 'High feasibility'],
    conditionTone: 'success',
    conclusion: 'Evidence-grounded drafting',
    tag: 'MVP',
  },
  {
    id: 'validate',
    conditions: ['High value', 'High risk'],
    conditionTone: 'warning',
    conclusion: 'More validation required',
  },
  {
    id: 'deprioritize',
    conditions: ['Low value'],
    conditionTone: 'neutral',
    conclusion: 'Deprioritize',
  },
]

export const METRICS_LABEL = 'Success metrics'
export const NORTH_STAR_LABEL = 'North Star'
export const NORTH_STAR = 'Expert-validated AI-assisted work completed'
export const SUPPORTING_METRICS_LABEL = 'Supporting metrics'
export const USAGE_CAVEAT =
  'Usage alone does not mean the AI is creating value. A user repeatedly opening the AI feature is not enough - the output must actually help complete the professional workflow.'

export interface Metric {
  id: string
  icon: LucideIcon
  label: string
  definition: string
}

export const SUPPORTING_METRICS: readonly Metric[] = [
  { id: 'acceptance', icon: CheckCircle2, label: 'Expert acceptance rate', definition: 'How often a draft is approved without substantive changes.' },
  { id: 'time-saved', icon: Timer, label: 'Time saved per workflow', definition: 'The difference between assisted and unassisted completion time.' },
  { id: 'groundedness', icon: ShieldCheck, label: 'Groundedness / citation coverage', definition: 'How much of the output is traceable to cited evidence.' },
  { id: 'override', icon: UserCheck, label: 'Human override rate', definition: 'How often an expert corrects the output before approving it.' },
  { id: 'completion', icon: Blocks, label: 'Task completion rate', definition: 'How often a started workflow reaches an approved outcome.' },
  { id: 'repeat', icon: Repeat, label: 'Repeat usage', definition: 'Whether experts choose to come back for their next matter.' },
  { id: 'cost', icon: DollarSign, label: 'Cost per completed workflow', definition: 'Total model and retrieval spend divided by completed workflows.' },
  { id: 'latency', icon: Gauge, label: 'AI response latency', definition: 'Time from request to a reviewable response.' },
]

export const RISKS_LABEL = 'Key product risks'

export interface Risk {
  id: string
  icon: LucideIcon
  risk: string
  mitigation: string
}

export const RISKS: readonly Risk[] = [
  {
    id: 'hallucination',
    icon: FileWarning,
    risk: 'Hallucination',
    mitigation: 'Ground responses in retrieved evidence + citations.',
  },
  {
    id: 'poor-retrieval',
    icon: Gauge,
    risk: 'Poor retrieval',
    mitigation: 'Retrieval evaluation + reranking + expert-reviewed datasets.',
  },
  {
    id: 'incorrect-output',
    icon: ShieldAlert,
    risk: 'Incorrect professional output',
    mitigation: 'Mandatory expert review for high-risk workflows.',
  },
  {
    id: 'low-trust',
    icon: Users,
    risk: 'Low user trust',
    mitigation: 'Explainability + evidence + transparent confidence.',
  },
  {
    id: 'cost-latency',
    icon: TimerReset,
    risk: 'High AI cost / latency',
    mitigation: 'Model selection + caching + workflow optimization.',
  },
  {
    id: 'data-privacy',
    icon: Lock,
    risk: 'Data privacy',
    mitigation: 'Tenant isolation + access controls + secure data handling.',
  },
]

export const VALIDATION_LABEL = 'How I would validate it'

export interface ValidationStep {
  id: string
  label: string
  action: string
}

export const VALIDATION_STEPS: readonly ValidationStep[] = [
  { id: 'discover', label: 'Discover', action: 'Talk to patent professionals and observe workflows.' },
  { id: 'define', label: 'Define', action: 'Identify one high-value, measurable workflow.' },
  { id: 'pilot', label: 'Pilot', action: 'Launch with a small group of expert users.' },
  { id: 'learn', label: 'Learn', action: 'Measure quality + time saved + expert feedback.' },
]

export const ITERATE_NOTE = 'Iterate before expanding automation.'

export const FINAL_PRINCIPLE = {
  avoidLead: "Don't start with:",
  avoidQuestion: 'Where can we use AI?',
  preferLead: 'Start with:',
  preferQuestion: 'Where is the user spending valuable time — and can AI make that work meaningfully better?',
  support: 'AI capability is the enabler. Customer value, trust and measurable outcomes are the product.',
} as const

export const TPM_NOTE =
  "Proposed approach for how a TPM might scope, sequence and validate this product — not any company's actual roadmap, priorities or internal process."

export const MVP_ICON: LucideIcon = CircleCheck
export const LATER_ICON: LucideIcon = Clock
