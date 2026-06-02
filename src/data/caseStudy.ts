export type SurfaceName = 'Product Page' | 'Push Notification' | 'Email' | 'Ads' | 'Marketplace';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type OutputStatus = 'Ready' | 'Needs Review';
export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'voice';

export interface DiscoveryState {
  messyNotes: string;
  industry: string;
  maturity: string;
  surfaces: SurfaceName[];
  primaryGoal: string;
}

export interface SurfaceRule {
  surface: SurfaceName;
  purpose: string;
  tone: string;
  length: string;
  allowed: string;
  avoid: string;
}

export interface SampleOutput {
  surface: SurfaceName;
  content: string;
  reason: string;
  checks: string[];
  risk: RiskLevel;
  status: OutputStatus;
}

export interface BrandTension {
  input: string;
  tension: string;
  question: string;
  resolvedRule: string;
  severity?: RiskLevel;
  evidence?: string;
  contentRisk?: string;
  affectedSurfaces?: string[];
  selectedResolution?: string;
  guardrail?: string;
  defines?: string;
  allowedLanguage?: string;
  avoidedLanguage?: string;
}

export interface ProductInput {
  name: string;
  facts: string;
}

export interface RuleGroup {
  title: string;
  badge: string;
  tone: BadgeTone;
  rules: string[];
}

export interface GeneratedBrief {
  brandVoice: string;
  toneRules: string[];
  avoidRules: string[];
  surfaceRules: string[];
  approvals: string[];
}

export interface GenerationCheck {
  weakPrompt: string;
  riskyOutput: string;
  detectedIssues: string[];
  guardrailedPrompt: string;
  saferOutput: string;
}

export interface GeneratedWorkspace {
  tensions: BrandTension[];
  ruleGroups: RuleGroup[];
  brief: GeneratedBrief;
  prompt: string;
  outputs: SampleOutput[];
  guardrails: string[];
  generationCheck: GenerationCheck;
}

export const steps = [
  'Messy Input',
  'Detected Tensions',
  'Clarifying Questions',
  'Resolution Workspace',
  'AI Guardrails',
  'Generation Check',
];

export const defaultDiscoveryState: DiscoveryState = {
  messyNotes:
    'We want to sound friendly but premium. The content should drive conversion but never feel pushy. Personalization should feel relevant but not creepy. We want creative copy, but finance-related content must stay compliant. Push messages should be short but still explain the value.',
  industry: 'E-commerce',
  maturity: 'Growing brand',
  surfaces: ['Product Page', 'Push Notification', 'Email', 'Ads', 'Marketplace'],
  primaryGoal: 'Trust',
};

export const defaultProductInput: ProductInput = {
  name: 'AeroRun Daily Shoe',
  facts: 'Lightweight running shoe with breathable mesh, durable sole, and everyday comfort.',
};

export const industries = ['E-commerce', 'Fintech', 'Retail', 'Education'];
export const maturities = ['New brand', 'Growing brand', 'Established brand'];
export const goals = ['Conversion', 'Retention', 'Trust', 'Education'];
export const surfaceNames: SurfaceName[] = ['Product Page', 'Push Notification', 'Email', 'Ads', 'Marketplace'];

export const questionGroups = [
  {
    group: 'A. Brand Voice',
    questions: [
      {
        question: 'How should the brand sound when helping a confused user?',
        answer: 'Clear and supportive, with enough warmth to reduce hesitation.',
      },
      {
        question: 'How direct can the brand be when asking users to take action?',
        answer: 'Direct is fine when the value is clear, but avoid pressure or urgency.',
      },
      {
        question: 'What words or tones should the brand avoid?',
        answer: 'Avoid hype, slang, fear-based prompts, and pushy sales phrasing.',
      },
    ],
  },
  {
    group: 'B. User Context',
    questions: [
      {
        question: 'What are the most important user moments?',
        answer: 'Product comparison, cart hesitation, onboarding, and renewal reminders.',
      },
      {
        question: 'Where do users hesitate?',
        answer: 'When claims feel vague, discounts seem unclear, or finance language feels risky.',
      },
      {
        question: 'What information helps users feel confident?',
        answer: 'Concrete benefits, factual product details, proof points, and calm guidance.',
      },
    ],
  },
  {
    group: 'C. Content Boundaries',
    questions: [
      {
        question: 'What should the AI never claim?',
        answer: 'Discounts, scarcity, finance outcomes, guarantees, or legal claims without proof.',
      },
      {
        question: 'Which claims require proof?',
        answer: 'Savings, performance, availability, compliance, and finance-related statements.',
      },
      {
        question: 'Which content types need human approval?',
        answer: 'Campaign claims, discount messages, finance copy, and compliance-sensitive content.',
      },
    ],
  },
  {
    group: 'D. Surface Rules',
    questions: [
      {
        question: 'How should product pages differ from push notifications?',
        answer: 'Product pages can explain value; push notifications should stay short and respectful.',
      },
      {
        question: 'Which surfaces can be more emotional?',
        answer: 'Email can be warmer because it has more room for context and guidance.',
      },
      {
        question: 'Which surfaces must stay factual?',
        answer: 'Marketplace, finance-related content, ads, and any limited-time message.',
      },
    ],
  },
];

export const brandTensions: BrandTension[] = [
  {
    input: 'Friendly but premium',
    tension: 'If the language gets too casual, the brand can start to feel less credible.',
    question: 'How much everyday language is acceptable before the tone stops feeling premium?',
    resolvedRule: 'Use warm, clear language, but avoid slang, jokes, and overly casual phrasing.',
  },
  {
    input: 'Sales-driven but not pushy',
    tension: 'The desired CTA strength is unclear, especially for conversion surfaces.',
    question: 'Can the brand use direct CTAs like "Buy now", or should CTAs stay softer?',
    resolvedRule: 'Make the value clear before asking for action; avoid pressure-based CTAs and fake urgency.',
  },
  {
    input: 'Personal but not creepy',
    tension: 'Behavior-based content can feel useful or invasive depending on how it is framed.',
    question: 'Should the copy mention user behavior, or only respond to it silently?',
    resolvedRule: 'Use context-aware helper text without saying the user was tracked or monitored.',
  },
  {
    input: 'Creative but compliant',
    tension: 'Creative language can accidentally create unsupported claims or regulated statements.',
    question: 'Which claim types need proof or human approval before publication?',
    resolvedRule: 'Allow creative framing only around approved facts; route finance, discount, and legal claims to review.',
  },
];

export const extractedRules = [
  {
    title: 'Brand Voice',
    badge: 'Voice Rule',
    tone: 'voice' as const,
    rules: ['Clear, helpful, and warm', 'Premium but not distant', 'Calm and trustworthy in sensitive moments'],
  },
  {
    title: 'Avoid',
    badge: 'Avoid Rule',
    tone: 'danger' as const,
    rules: [
      'Aggressive sales language',
      'Fake urgency',
      'Unsupported discount claims',
      'Overly casual slang',
      'Pressure-based CTAs',
    ],
  },
  {
    title: 'Allowed',
    badge: 'Allowed Rule',
    tone: 'success' as const,
    rules: [
      'Benefit-focused explanations',
      'Calm reminders',
      'Context-aware helper text',
      'Clear product value statements',
    ],
  },
  {
    title: 'Needs Human Review',
    badge: 'Review Required',
    tone: 'warning' as const,
    rules: [
      'Finance-related claims',
      'Legal or compliance-sensitive content',
      'Campaign claims',
      'Discount or limited-time messages',
    ],
  },
];

export const surfaceRules: SurfaceRule[] = [
  {
    surface: 'Product Page',
    purpose: 'Explain product value clearly',
    tone: 'Helpful, clear, benefit-led',
    length: 'One concise paragraph or 3 to 5 bullets',
    allowed: 'Benefits, features, use cases',
    avoid: 'Exaggerated claims, fake superiority',
  },
  {
    surface: 'Push Notification',
    purpose: 'Bring users back without pressure',
    tone: 'Short, calm, respectful',
    length: 'One short sentence under 90 characters',
    allowed: 'Gentle reminders, useful updates',
    avoid: 'Fake urgency, guilt, pressure',
  },
  {
    surface: 'Email',
    purpose: 'Give more context and guidance',
    tone: 'Warm, premium, informative',
    length: 'Short subject plus a focused body paragraph',
    allowed: 'Detailed explanation, product education',
    avoid: 'Overly long or generic promotional language',
  },
  {
    surface: 'Ads',
    purpose: 'Capture attention quickly',
    tone: 'Clear, sharp, not misleading',
    length: 'Headline plus one supporting line',
    allowed: 'Simple value proposition',
    avoid: 'Unsupported claims, misleading savings',
  },
  {
    surface: 'Marketplace',
    purpose: 'Fit channel requirements and explain value fast',
    tone: 'Direct, factual, scannable',
    length: 'Concise title and compact factual description',
    allowed: 'Product facts, concise benefits',
    avoid: 'Brand-heavy storytelling, vague adjectives',
  },
];

export const sampleOutputs: SampleOutput[] = [
  {
    surface: 'Product Page',
    content:
      'Designed for daily movement, AeroRun combines breathable comfort with durable support for everyday runs and walks.',
    reason: 'Uses provided product facts, explains value simply, and keeps the tone benefit-led.',
    checks: [
      'Does not change the product facts',
      'Avoids exaggerated performance claims',
      'Feels premium without becoming distant',
      'Makes the user benefit clear',
    ],
    risk: 'Low',
    status: 'Ready',
  },
  {
    surface: 'Push Notification',
    content: "Your AeroRun pair is still here when you're ready.",
    reason: 'Short, calm, and respectful with no false urgency or pressure language.',
    checks: [
      'Does not create fake scarcity',
      'Keeps the message short',
      'Avoids guilt or pressure',
      'Does not reveal behavioral tracking',
    ],
    risk: 'Low',
    status: 'Ready',
  },
  {
    surface: 'Email',
    content: 'Meet AeroRun: a lightweight daily shoe designed to keep comfort, breathability, and support simple.',
    reason: 'Warmer than push, still concise, and grounded in the product facts.',
    checks: [
      'Uses a warmer surface-appropriate tone',
      'Stays grounded in product facts',
      'Avoids generic promotional language',
      'Explains value without overpromising',
    ],
    risk: 'Low',
    status: 'Ready',
  },
  {
    surface: 'Marketplace',
    content: 'Lightweight daily running shoe with breathable mesh and durable everyday support.',
    reason: 'Factual, scannable, and compatible with marketplace-style product listings.',
    checks: [
      'Prioritizes facts over brand storytelling',
      'Keeps the wording scannable',
      'Avoids vague premium adjectives',
      'Does not add unsupported savings claims',
    ],
    risk: 'Low',
    status: 'Ready',
  },
];

export const promptExample =
  'Generate a product page description for AeroRun Daily Shoe. Use a clear, helpful, premium but not distant tone. Explain the product value using only the provided facts. Avoid fake urgency, unsupported claims, invented discounts, or pressure-based language. Keep the message concise and benefit-led.';
