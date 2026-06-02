import type { BehaviorTrigger, OutputExample } from './types';

export type Language = 'tr' | 'en';

export const appText = {
  tr: {
    subtitle: 'Kişiselleştirme Kontrol Merkezi',
    liveRules: 'Canlı kurallar',
    mockData: 'Demo veri',
    nav: {
      pipelines: 'Pipeline',
      rules: 'İçerik Kuralları',
      review: 'Review Kuyruğu',
      audit: 'Denetim Logu',
    },
    pageKicker: 'Pipeline özeti',
    pageTitle: 'Kişiselleştirme operasyon paneli',
    pageCopy: 'Ürün, müşteri sinyali, kural kararı ve güvenli içerik önizlemesi tek çalışma alanında yönetilir.',
    ready: 'Hazır.',
    editMode: 'Metin düzenleme moduna alındı.',
    paused: 'Tetikleyici duraklatıldı ve yayın akışından çıkarıldı.',
    approved: 'Varyant onaylandı ve yayınlanabilir listeye eklendi.',
  },
  en: {
    subtitle: 'Personalization Control Center',
    liveRules: 'Live rules',
    mockData: 'Mock data',
    nav: {
      pipelines: 'Pipelines',
      rules: 'Content Rules',
      review: 'Review Queue',
      audit: 'Audit Log',
    },
    pageKicker: 'Pipeline overview',
    pageTitle: 'Personalization operations dashboard',
    pageCopy: 'Product context, shopper signals, rule decisions, and safe content previews are managed in one workspace.',
    ready: 'Ready.',
    editMode: 'Copy is now in edit mode.',
    paused: 'Trigger paused and removed from the publishing flow.',
    approved: 'Variant approved and added to the publishable list.',
  },
};

const englishRules: Record<string, Partial<BehaviorTrigger>> = {
  'repeated-product-view': {
    shortName: 'Repeated product view',
    journeyStep: 'Product viewed 3+ times',
    behavior: 'AeroRun Daily Shoe product page was opened 3+ times within 48 hours',
    inferredIntent: 'Interested but undecided',
    contentAction: 'Show a more explanatory product description',
    safetyGuardrail: 'No fake urgency, pressure, or exaggerated claims',
    personalizedOutput:
      'AeroRun Daily Shoe is designed for breathable comfort, steady grip, and lightweight support during daily runs.',
    reviewMode: 'Human review for the first 20 launches',
    guardrailChecks: [
      'No urgency or stock pressure detected',
      'Comfort and support claims stay within product facts',
      'Tone is calm and informative',
    ],
  },
  'price-filter-used': {
    shortName: 'Price filter used',
    journeyStep: 'Price filter applied',
    behavior: 'AeroRun was opened after a price range filter was applied',
    inferredIntent: 'Price-sensitive comparison',
    contentAction: 'Highlight value and durability',
    safetyGuardrail: 'No invented discount or misleading savings claim',
    personalizedOutput: 'AeroRun offers lightweight comfort, a durable sole, and practical daily performance.',
    reviewMode: 'Auto-approve while risk remains low',
    guardrailChecks: [
      'No discount or savings claim was generated',
      'Value is framed through durability and daily use',
      'Price sensitivity is not manipulated',
    ],
  },
  'reviews-opened': {
    shortName: 'Reviews opened',
    journeyStep: 'Reviews tab opened',
    behavior: 'The reviews tab was opened and product details were inspected',
    inferredIntent: 'Needs trust and reassurance',
    contentAction: 'Show trust-supporting product details',
    safetyGuardrail: 'No fake social proof or unsupported popularity claims',
    personalizedOutput: 'Review the details that matter: breathable mesh, balanced sole, and everyday comfort.',
    reviewMode: 'Manual review before publishing',
    guardrailChecks: [
      'No fake social proof used',
      'No unsupported popularity claim',
      'Trust need is answered with product details',
    ],
  },
  'similar-products-compared': {
    shortName: 'Similar products compared',
    journeyStep: 'Similar products compared',
    behavior: 'AeroRun was added to a comparison view with similar daily running shoes',
    inferredIntent: 'Evaluating alternatives',
    contentAction: 'Explain what makes this product different',
    safetyGuardrail: 'Do not attack competitors or make unverifiable claims',
    personalizedOutput:
      'Among daily trainers, AeroRun focuses on lightweight construction, breathable upper material, and steady grip.',
    reviewMode: 'Human review for comparison language',
    guardrailChecks: [
      'No competitor brand is targeted',
      'Differentiation uses verifiable product features',
      'Comparison language is routed to manual review',
    ],
  },
  'cart-abandoned': {
    shortName: 'Cart abandoned',
    journeyStep: 'Checkout not completed',
    behavior: 'AeroRun was added to cart, but checkout ended before completion',
    inferredIntent: 'Purchase intent with hesitation',
    contentAction: 'Show return, delivery, or guarantee information',
    safetyGuardrail: 'No pressure or manipulative urgency',
    personalizedOutput: 'Your selected AeroRun pair is still in your cart when you are ready.',
    reviewMode: 'Paused while lifecycle policy review is pending',
    guardrailChecks: [
      'No pressure language used',
      'No fake scarcity or time limit',
      'A soft reminder preserves user control',
    ],
  },
};

export function localizeRules(rules: BehaviorTrigger[], language: Language) {
  if (language === 'tr') {
    return rules;
  }

  return rules.map((rule) => ({
    ...rule,
    ...englishRules[rule.id],
  })) as BehaviorTrigger[];
}

export function localizeLevel(value: string, language: Language) {
  if (language === 'tr') return value;
  if (value === 'Yüksek' || value === 'YÃ¼ksek') return 'High';
  if (value === 'Orta') return 'Medium';
  if (value === 'Düşük' || value === 'DÃ¼ÅŸÃ¼k') return 'Low';
  return value;
}

export function localizeAction(value: string, language: Language) {
  if (language === 'tr') return value;
  if (value === 'Onayla') return 'Approve';
  if (value === 'Düzenle' || value === 'DÃ¼zenle') return 'Edit';
  if (value === 'Duraklat') return 'Pause';
  return value;
}

export function localizeStatus(value: string, language: Language) {
  if (language === 'tr') return value;
  if (value === 'Aktif') return 'Active';
  if (value === 'İnceleme Gerekli' || value === 'Ä°nceleme Gerekli') return 'Needs Review';
  if (value === 'Duraklatıldı' || value === 'DuraklatÄ±ldÄ±') return 'Paused';
  if (value === 'Onaylandı' || value === 'OnaylandÄ±') return 'Approved';
  return value;
}

export function getProductOptions(language: Language) {
  if (language === 'en') {
    return [
      {
        id: 'aerorun-daily-shoe',
        name: 'AeroRun Daily Shoe',
        defaultDescription: 'Lightweight running shoe with breathable mesh and a durable rubber sole.',
      },
      {
        id: 'pacelite-training-shoe',
        name: 'PaceLite Training Shoe',
        defaultDescription: 'Lightweight training shoe with a breathable upper and balanced everyday support.',
      },
      {
        id: 'cloudstep-walking-sneaker',
        name: 'CloudStep Walking Sneaker',
        defaultDescription: 'Soft-soled city sneaker designed for daily walking, flexibility, and simple comfort.',
      },
    ];
  }

  return [
    {
      id: 'aerorun-daily-shoe',
      name: 'AeroRun Daily Shoe',
      defaultDescription: 'Günlük koşular ve şehir içi kullanım için nefes alabilen file yüzeyli, hafif koşu ayakkabısı.',
    },
    {
      id: 'pacelite-training-shoe',
      name: 'PaceLite Training Shoe',
      defaultDescription: 'Hafif antrenman ayakkabısı; nefes alabilen üst yüzey ve dengeli günlük destek sunar.',
    },
    {
      id: 'cloudstep-walking-sneaker',
      name: 'CloudStep Walking Sneaker',
      defaultDescription: 'Günlük yürüyüş için yumuşak tabanlı, esnek ve sade şehir ayakkabısı.',
    },
  ];
}

export function getOutputExamples(language: Language): OutputExample[] {
  if (language === 'en') {
    return [
      {
        bad: 'Buy now before it is gone!',
        reason: 'Creates pressure and fake urgency.',
        safe: 'Your selected item is still in your cart when you are ready.',
      },
      {
        bad: 'The cheapest quality shoe online.',
        reason: 'Unsupported and misleading claim.',
        safe: 'A practical option for daily comfort and regular use.',
      },
      {
        bad: 'Everyone loves this product.',
        reason: 'Fake social proof.',
        safe: 'Review the key details before choosing the right fit.',
      },
    ];
  }

  return [
    {
      bad: 'Tükenmeden hemen satın al!',
      reason: 'Baskı ve sahte aciliyet yaratır.',
      safe: 'Seçtiğiniz ürün hazır olduğunuzda sepetinizde duruyor.',
    },
    {
      bad: 'İnternetteki en ucuz kaliteli ayakkabı.',
      reason: 'Desteksiz ve yanıltıcı bir iddia.',
      safe: 'Günlük konfor ve düzenli kullanım için pratik bir seçenek.',
    },
    {
      bad: 'Herkes bu ürünü seviyor.',
      reason: 'Sahte sosyal kanıt üretir.',
      safe: 'Size uygun seçimi yapmadan önce temel detayları inceleyin.',
    },
  ];
}
