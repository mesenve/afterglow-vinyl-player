import {
  surfaceNames,
  surfaceRules,
  type BrandTension,
  type DiscoveryState,
  type GeneratedBrief,
  type GeneratedWorkspace,
  type GenerationCheck,
  type ProductInput,
  type RuleGroup,
  type SampleOutput,
  type SurfaceName,
} from '../data/caseStudy';

const hasAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

const unique = (items: string[]) => Array.from(new Set(items));

const sentence = (value: string) => value.trim().replace(/\.$/, '');

const getSignals = (notes: string) => {
  const normalized = notes.toLocaleLowerCase('en-US');

  return {
    premium: hasAny(normalized, ['premium', 'high-end', 'luxury']),
    warm: hasAny(normalized, ['warm', 'friendly', 'helpful', 'supportive', 'samimi']),
    clear: hasAny(normalized, ['clear', 'simple', 'simply', 'plain', 'açık']),
    finance: hasAny(normalized, ['finance', 'financial', 'fintech', 'compliance', 'legal']),
    urgency: hasAny(normalized, ['urgent', 'limited', 'scarcity', 'pressure', 'aggressive', 'pushy']),
    discount: hasAny(normalized, ['discount', 'sale', 'savings', 'offer']),
    personal: hasAny(normalized, ['personal', 'personalized', 'behavior', 'context']),
    creative: hasAny(normalized, ['creative', 'bold', 'playful']),
  };
};

const buildTensions = (): BrandTension[] => [
  {
    input: 'Friendly vs Premium',
    tension: 'Tone may become too casual or too distant if the boundary is not defined.',
    question: 'Which everyday expressions are acceptable before the brand starts feeling too casual?',
    selectedResolution: 'Warm but controlled',
    resolvedRule: 'Use clear and warm language, but avoid slang, jokes, emojis, and overly casual phrasing.',
    guardrail: 'Maintain an approachable premium tone. Do not use slang, jokes, emojis, or overly casual expressions.',
    severity: 'Medium',
    evidence: 'The notes ask for a friendly voice while protecting a premium perception.',
    contentRisk: 'If language becomes too casual, the brand may feel less credible.',
    affectedSurfaces: ['Email', 'Product Page', 'Ads'],
  },
  {
    input: 'Conversion vs Pressure',
    tension: 'Conversion goals can turn into manipulative urgency if CTA strength is not constrained.',
    question: 'Which CTA strength is allowed: soft, direct, or urgent?',
    selectedResolution: 'Helpful conversion',
    resolvedRule: 'Make the value clear before asking for action. Avoid pressure-based CTAs, fake urgency, and scarcity claims.',
    guardrail: 'Avoid pressure-based CTAs, fake urgency, scarcity claims, or fear-based conversion language.',
    severity: 'High',
    evidence: 'The notes ask content to drive conversion but never feel pushy.',
    contentRisk: 'AI may create aggressive CTAs, fake urgency, or manipulative sales copy.',
    affectedSurfaces: ['Push', 'Ads', 'Product Page'],
  },
  {
    input: 'Personal vs Creepy',
    tension: 'Personalization can feel helpful or invasive depending on whether behavior is exposed.',
    question: 'Can we reference user behavior directly, or should personalization stay implicit?',
    selectedResolution: 'Implicit personalization',
    resolvedRule: 'Use context-aware language without directly saying what the user did.',
    guardrail:
      "Do not explicitly mention tracked user behavior. Use contextual relevance without saying 'you viewed this' or 'you looked at this before.'",
    severity: 'High',
    evidence: 'The notes ask personalization to feel relevant but not creepy.',
    contentRisk: 'AI may expose behavioral tracking too directly and make the user uncomfortable.',
    affectedSurfaces: ['Push', 'Product Page', 'Email'],
  },
  {
    input: 'Creative vs Compliant',
    tension: 'Creative copy can accidentally create unsupported claims or regulated language.',
    question: 'Which claim types require proof or human approval before publication?',
    selectedResolution: 'Creative only around approved facts',
    resolvedRule:
      'Allow creative framing only when based on approved facts. Route finance, discount, legal, and campaign claims to review.',
    guardrail:
      'Use creative framing only around approved facts. Route finance, discount, legal, and campaign claims to human review.',
    severity: 'Critical',
    evidence: 'The notes ask for creative copy while finance-related content must stay compliant.',
    contentRisk: 'AI may create unsupported claims, risky finance language, or messages requiring legal review.',
    affectedSurfaces: ['Finance content', 'Campaigns', 'Ads'],
  },
  {
    input: 'Short vs Informative',
    tension: 'Short messages can become vague, while informative messages can become too long for the surface.',
    question: 'What is the minimum value information that must remain even in short formats?',
    selectedResolution: 'Surface-aware minimum value',
    resolvedRule: 'Keep short formats concise, but preserve one clear product value or next step.',
    guardrail: 'For short surfaces, preserve one clear product value or next step. Do not compress the message into vague hype.',
    severity: 'Medium',
    evidence: 'The notes say push messages should be short but still explain the value.',
    contentRisk: 'Short messages may become vague, while informative messages may become too long for the surface.',
    affectedSurfaces: ['Push', 'Marketplace', 'Ads'],
  },
];

const buildRuleGroups = (discovery: DiscoveryState, tensions: BrandTension[]): RuleGroup[] => {
  const voice = unique([
    'Warm but controlled',
    'Premium without sounding distant',
    'Helpful without becoming overly casual',
  ].filter(Boolean));

  const avoid = unique([
    'Pressure-based CTAs',
    'Fake urgency or scarcity',
    'Exposed behavioral tracking',
    'Unsupported compliance or finance claims',
    'Slang, jokes, emojis, and vague hype',
  ].filter(Boolean));

  const allowed = unique([
    'Benefit-focused explanations',
    'Clear product value statements',
    'Implicit personalization',
    'Surface-aware short copy',
  ].filter(Boolean));

  const review = unique([
    'Finance-related claims',
    'Legal or compliance-sensitive content',
    'Campaign claims',
    'Discount or limited-time messages',
  ].filter(Boolean));

  return [
    { title: 'Brand Voice', badge: 'Voice Rule', tone: 'voice', rules: voice },
    { title: 'Avoid', badge: 'Avoid Rule', tone: 'danger', rules: avoid },
    { title: 'Allowed', badge: 'Allowed Rule', tone: 'success', rules: allowed },
    { title: 'Needs Human Review', badge: 'Review Required', tone: 'warning', rules: review },
  ];
};

const buildBrief = (discovery: DiscoveryState, groups: RuleGroup[]): GeneratedBrief => {
  const selectedSurfaceRules = surfaceRules
    .filter((rule) => discovery.surfaces.includes(rule.surface))
    .map((rule) => `${rule.surface}: ${rule.purpose.toLocaleLowerCase('en-US')}; tone should be ${rule.tone.toLocaleLowerCase('en-US')}.`);

  return {
    brandVoice: groups[0].rules.join(', ') + '.',
    toneRules: [
      'Use simple language.',
      'Be supportive, not pushy.',
      discovery.primaryGoal === 'Trust' ? 'Prioritize trust-building proof and clarity.' : 'Make the content goal easy to understand.',
      'Keep sensitive content calm and factual.',
    ],
    avoidRules: groups[1].rules,
    surfaceRules: selectedSurfaceRules,
    approvals: groups[3].rules,
  };
};

const outputForSurface = (surface: SurfaceName, product: ProductInput, brief: GeneratedBrief): SampleOutput => {
  const productName = product.name.trim() || 'Selected product';
  const productFacts = sentence(product.facts || 'Use only approved product facts');
  const contentBySurface: Record<SurfaceName, string> = {
    'Product Page': `Designed for everyday decisions, ${productName} brings ${productFacts.toLocaleLowerCase('en-US')}.`,
    'Push Notification': `${productName} is still here when you're ready.`,
    Email: `Meet ${productName}: a straightforward option built around ${productFacts.toLocaleLowerCase('en-US')}.`,
    Ads: `${productName}: ${productFacts}.`,
    Marketplace: `${productName}. ${productFacts}.`,
  };

  const needsReview = brief.approvals.some((item) => item.toLocaleLowerCase('en-US').includes('finance'));

  return {
    surface,
    content: contentBySurface[surface],
    reason: 'Generated from the current discovery rules, selected surface guidance, and approved product facts.',
    checks: [
      'Uses only provided product facts',
      'Applies the selected surface rule',
      'Avoids fake urgency and unsupported claims',
      'Routes sensitive claim types to review rules',
    ],
    risk: needsReview && surface === 'Ads' ? 'Medium' : 'Low',
    status: needsReview && surface === 'Ads' ? 'Needs Review' : 'Ready',
  };
};

const buildPrompt = (surface: SurfaceName, product: ProductInput, brief: GeneratedBrief, discovery: DiscoveryState) =>
  `Generate ${surface.toLocaleLowerCase('en-US')} content for ${product.name}. Use this brand voice: ${brief.brandVoice} Content goal: ${discovery.primaryGoal}. Use only these product facts: ${product.facts}. Avoid: ${brief.avoidRules.join(', ')}. Human approval is required for: ${brief.approvals.join(', ')}. Keep the output aligned with the selected surface rules.`;

const buildGenerationCheck = (): GenerationCheck => ({
  weakPrompt: 'Create a high-converting push notification for a returning user.',
  riskyOutput: "You looked at this 3 times. Buy now before it's gone.",
  detectedIssues: [
    'Exposes user behavior directly',
    'Uses pressure-based CTA',
    'Creates fake urgency',
    'Feels manipulative',
  ],
  guardrailedPrompt:
    'Create a short, helpful push notification for a returning user. Do not mention tracked behavior directly. Avoid urgency, pressure, scarcity claims, or fear-based language. Keep the tone warm but premium.',
  saferOutput: "Still considering it? Your selected item is here when you're ready.",
});

export const generateWorkspace = (
  discovery: DiscoveryState,
  product: ProductInput,
  selectedSurface: SurfaceName,
): GeneratedWorkspace => {
  const tensions = buildTensions();
  const ruleGroups = buildRuleGroups(discovery, tensions);
  const brief = buildBrief(discovery, ruleGroups);
  const outputs = surfaceNames
    .filter((surface) => discovery.surfaces.includes(surface))
    .map((surface) => outputForSurface(surface, product, brief));

  return {
    tensions,
    ruleGroups,
    brief,
    prompt: buildPrompt(selectedSurface, product, brief, discovery),
    outputs,
    guardrails: tensions.map((tension) => tension.guardrail ?? tension.resolvedRule),
    generationCheck: buildGenerationCheck(),
  };
};
