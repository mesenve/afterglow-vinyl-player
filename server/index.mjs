import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

await loadEnvFile(path.join(rootDir, '.env'));

const port = Number(process.env.PORT ?? 8787);
const openAiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

async function loadEnvFile(envPath) {
  try {
    const raw = await readFile(envPath, 'utf8');

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional; production hosts usually provide environment variables directly.
  }
}

const severityRank = {
  Medium: 1,
  High: 2,
  Critical: 3,
};

const surfaceTaxonomy = [
  {
    surface: 'Email Subject',
    terms: ['email subject', 'subject line', 'konu satırı', 'e-posta konusu', 'mail konusu'],
  },
  {
    surface: 'Email',
    terms: ['email', 'e-mail', 'e-posta', 'mail', 'newsletter'],
  },
  {
    surface: 'Push',
    terms: ['push', 'push notification', 'bildirim', 'anlık bildirim'],
  },
  {
    surface: 'SMS',
    terms: ['sms', 'text message', 'short message'],
  },
  {
    surface: 'In-app',
    terms: ['in-app', 'in app', 'uygulama içi', 'app message', 'onboarding'],
  },
  {
    surface: 'Ads',
    terms: ['ads', 'ad ', 'advertising', 'reklam', 'reklamlar', 'paid social'],
  },
  {
    surface: 'Campaigns',
    terms: ['campaign', 'campaigns', 'kampanya', 'kampanyalar'],
  },
  {
    surface: 'Landing Page',
    terms: ['landing page', 'landing', 'açılış sayfası'],
  },
  {
    surface: 'Product Page',
    terms: ['product page', 'ürün sayfası', 'pdp'],
  },
  {
    surface: 'Finance Content',
    terms: ['finance', 'financial', 'finans', 'finansal', 'regulated finance', 'regüle finans'],
  },
  {
    surface: 'Healthcare Content',
    terms: ['health', 'healthcare', 'medical', 'sağlık', 'tıbbi', 'clinical', 'klinik'],
  },
  {
    surface: 'Offer Modules',
    terms: ['offer', 'offers', 'teklif', 'teklifler', 'pricing', 'fiyat', 'availability', 'müsaitlik'],
  },
  {
    surface: 'Concierge',
    terms: ['concierge', 'advisor', 'danışman'],
  },
];

const fallbackSignals = {
  en: ['Tone preference', 'Conversion expectation', 'Personalization boundary', 'Compliance concern', 'Surface constraint'],
  tr: ['Ton tercihi', 'Dönüşüm beklentisi', 'Kişiselleştirme sınırı', 'Uyum riski', 'Kanal kısıtı'],
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function asId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function findEvidence(input, terms, fallback) {
  const sentences = input.match(/[^.!?\n]+[.!?]?/g) ?? [input];
  const normalizedTerms = terms.map((term) => term.toLowerCase());
  const match = sentences.find((sentence) => {
    const normalized = sentence.toLowerCase();
    return normalizedTerms.some((term) => normalized.includes(term));
  });

  return (match ?? fallback).trim();
}

function detectSurfaces(text) {
  const haystack = ` ${String(text ?? '').toLowerCase()} `;
  const matches = [];

  for (const item of surfaceTaxonomy) {
    if (item.terms.some((term) => haystack.includes(term.toLowerCase()))) {
      matches.push(item.surface);
    }
  }

  return matches;
}

function inferSurfacesForTension(tension, brandInput) {
  const primaryCombined = [
    brandInput,
    tension.name,
    tension.evidenceFromInput,
    tension.vagueInput,
    ...(tension.affectedSurfaces ?? []),
  ].join(' ');
  let detected = detectSurfaces(primaryCombined);

  if (detected.length) {
    return detected.slice(0, 4);
  }

  const normalized = `${tension.name} ${tension.risk} ${tension.guardrailContent}`.toLowerCase();
  if (normalized.includes('personal') || normalized.includes('privacy') || normalized.includes('tracking') || normalized.includes('kişisel') || normalized.includes('takip')) {
    return ['Push', 'Email', 'In-app'];
  }
  if (normalized.includes('conversion') || normalized.includes('cta') || normalized.includes('pressure') || normalized.includes('dönüşüm') || normalized.includes('baskı')) {
    return ['Push', 'Ads', 'Product Page'];
  }
  if (normalized.includes('claim') || normalized.includes('compliance') || normalized.includes('accurate') || normalized.includes('uyum') || normalized.includes('doğru')) {
    return ['Campaigns', 'Ads', 'Content'];
  }
  if (normalized.includes('short') || normalized.includes('brief') || normalized.includes('kısa')) {
    return ['Push', 'Email Subject', 'Ads'];
  }

  return ['Email', 'Product Page', 'Ads'];
}

function normalizeAnalysisSurfaces(analysis, brandInput) {
  return {
    ...analysis,
    tensions: (analysis.tensions ?? []).map((tension) => ({
      ...tension,
      affectedSurfaces: inferSurfacesForTension(tension, brandInput),
    })),
  };
}

function createTension({
  id,
  name,
  severity,
  risk,
  surfaces,
  why,
  ambiguous,
  question,
  defines,
  resolution,
  rule,
  allowed,
  avoid,
  vague,
  evidence,
  unresolved,
  guardrailTitle,
  guardrail,
}) {
  return {
    id,
    name,
    severity,
    risk,
    affectedSurfaces: surfaces,
    whyItMatters: why,
    whyAmbiguous: ambiguous,
    question,
    defines,
    resolution,
    resolvedRule: rule,
    allowed,
    avoid,
    vagueInput: vague,
    evidenceFromInput: evidence,
    riskIfUnresolved: unresolved,
    operationalRule: rule,
    guardrailTitle,
    guardrailContent: guardrail,
  };
}

function deterministicAnalyze({ brandInput = '', language = 'en', source = 'Custom brand input' }) {
  const input = String(brandInput || '');
  const lower = input.toLowerCase();
  const isTr = language === 'tr';
  const tensions = [];

  const addTone = lower.includes('premium') || lower.includes('friendly') || lower.includes('samimi') || lower.includes('seçkin');
  const addConversion = lower.includes('conversion') || lower.includes('dönüş') || lower.includes('cta') || lower.includes('offer') || lower.includes('teklif');
  const addPersonal = lower.includes('personal') || lower.includes('kişisel') || lower.includes('preference') || lower.includes('tercih') || lower.includes('tracked') || lower.includes('takip');
  const addCompliance = lower.includes('compliant') || lower.includes('uyum') || lower.includes('finance') || lower.includes('medical') || lower.includes('health') || lower.includes('pricing') || lower.includes('fiyat');
  const addLength = lower.includes('short') || lower.includes('brief') || lower.includes('kısa') || lower.includes('subject');

  if (addTone) {
    tensions.push(
      createTension({
        id: 'tone-boundary',
        name: isTr ? 'Sıcaklık vs Güvenilirlik' : 'Warmth vs Credibility',
        severity: 'Medium',
        risk: isTr
          ? 'AI tonu fazla gündelik veya fazla soğuk hale getirebilir.'
          : 'AI may make the tone either too casual or too cold.',
        surfaces: isTr ? ['E-posta', 'Ürün Sayfası', 'Reklamlar'] : ['Email', 'Product Page', 'Ads'],
        why: isTr
          ? 'Marka tonu üretimden önce net sınır gerektirir.'
          : 'Brand tone needs a clear boundary before generation.',
        ambiguous: isTr
          ? 'Girdi aynı anda sıcaklık ve güvenilirlik beklentisi taşıyor.'
          : 'The input asks for warmth and credibility at the same time.',
        question: isTr
          ? 'Hangi ifadeler markayı fazla gündelik hissettirmeye başlar?'
          : 'Which expressions make the brand start feeling too casual?',
        defines: isTr ? 'Ton sınırı, argo kullanımı, sıcaklık seviyesi.' : 'Tone boundary, slang usage, warmth level.',
        resolution: isTr ? 'Sıcak ama kontrollü' : 'Warm but controlled',
        rule: isTr
          ? 'Açık ve sıcak bir dil kullan; argo, şaka ve aşırı gündelik ifadelerden kaçın.'
          : 'Use clear and warm language; avoid slang, jokes, and overly casual phrasing.',
        allowed: isTr ? ['Yardımcı', 'Sakin', 'Net', 'Rafine'] : ['Helpful', 'Calm', 'Clear', 'Refined'],
        avoid: isTr ? ['Argo', 'Aşırı samimiyet', 'Şaka'] : ['Slang', 'Over-familiarity', 'Jokes'],
        vague: isTr ? 'Sıcak ama güvenilir' : 'Warm but credible',
        evidence: findEvidence(input, ['premium', 'friendly', 'samimi', 'seçkin', 'approachable'], isTr ? 'Ton beklentisi' : 'Tone expectation'),
        unresolved: isTr
          ? 'AI markayı fazla gündelik veya fazla mesafeli gösterebilir.'
          : 'AI may make the brand feel too casual or too distant.',
        guardrailTitle: isTr ? 'Ton Guardrail' : 'Tone Guardrail',
        guardrail: isTr
          ? 'Sıcak ama kontrollü bir ton kullan. Argo, şaka ve aşırı gündelik ifadelerden kaçın.'
          : 'Use a warm but controlled tone. Avoid slang, jokes, and overly casual phrasing.',
      }),
    );
  }

  if (addConversion) {
    tensions.push(
      createTension({
        id: 'conversion-pressure',
        name: isTr ? 'Dönüşüm vs Baskı' : 'Conversion vs Pressure',
        severity: 'High',
        risk: isTr
          ? 'AI baskı temelli CTA, sahte aciliyet veya manipülatif satış dili üretebilir.'
          : 'AI may create pressure-based CTAs, fake urgency, or manipulative sales copy.',
        surfaces: isTr ? ['Push', 'Reklamlar', 'Ürün Sayfası'] : ['Push', 'Ads', 'Product Page'],
        why: isTr
          ? 'Dönüşüm dili kullanıcı kontrolünü korumalıdır.'
          : 'Conversion language must preserve user control.',
        ambiguous: isTr
          ? 'Girdi aksiyon istiyor ama baskı istemiyor.'
          : 'The input asks users to act without creating pressure.',
        question: isTr ? 'Hangi CTA gücü kabul edilebilir?' : 'Which CTA strength is acceptable?',
        defines: isTr ? 'CTA stili, aciliyet sınırı, baskı dili.' : 'CTA style, urgency limits, pressure language.',
        resolution: isTr ? 'Değer odaklı CTA' : 'Value-led CTA',
        rule: isTr
          ? 'Aksiyon istemeden önce değeri netleştir; sahte aciliyet ve kıtlık iddialarından kaçın.'
          : 'Make the value clear before asking for action; avoid fake urgency and scarcity claims.',
        allowed: isTr ? ['Keşfet', 'Devam et', 'Detayları gör'] : ['Explore', 'Continue', 'See details'],
        avoid: isTr ? ['Hemen al', 'Son şans', 'Kaçırma'] : ['Buy now', 'Last chance', "Don't miss out"],
        vague: isTr ? 'Dönüşüm ama baskı yok' : 'Conversion without pressure',
        evidence: findEvidence(input, ['conversion', 'dönüş', 'cta', 'offer', 'teklif', 'interest'], isTr ? 'Dönüşüm beklentisi' : 'Conversion expectation'),
        unresolved: isTr
          ? 'AI aciliyet, indirim veya baskı dilini fazla kullanabilir.'
          : 'AI may overuse urgency, discounts, or pressure language.',
        guardrailTitle: isTr ? 'CTA Guardrail' : 'CTA Guardrail',
        guardrail: isTr
          ? 'Önce değeri açıklayın. Baskı, sahte aciliyet ve doğrulanmamış kıtlık kullanmayın.'
          : 'Explain value first. Do not use pressure, fake urgency, or unverified scarcity.',
      }),
    );
  }

  if (addPersonal) {
    tensions.push(
      createTension({
        id: 'personalization-privacy',
        name: isTr ? 'Kişiselleştirme vs Mahremiyet' : 'Personalization vs Privacy',
        severity: 'High',
        risk: isTr
          ? 'AI takip edilen davranışı veya hassas tercihleri fazla doğrudan açığa çıkarabilir.'
          : 'AI may reveal tracked behavior or sensitive preferences too directly.',
        surfaces: isTr ? ['Push', 'E-posta', 'Uygulama içi'] : ['Push', 'Email', 'In-app'],
        why: isTr
          ? 'Kişiselleştirme alakalı hissettirmeli, izlenmiş gibi değil.'
          : 'Personalization should feel relevant, not surveilled.',
        ambiguous: isTr
          ? 'Girdi alaka istiyor ama takip hissi yaratmak istemiyor.'
          : 'The input wants relevance without making tracking visible.',
        question: isTr
          ? 'Kullanıcı davranışı doğrudan söylenebilir mi, yoksa örtük mü kalmalı?'
          : 'Can user behavior be referenced directly, or should it remain implicit?',
        defines: isTr ? 'Kişiselleştirme görünürlüğü ve veri sınırları.' : 'Personalization visibility and data boundaries.',
        resolution: isTr ? 'Örtük kişiselleştirme' : 'Implicit personalization',
        rule: isTr
          ? 'Bağlamsal alaka kur, ancak davranışsal takip veya hassas veriyi açık etme.'
          : 'Use contextual relevance without exposing behavioral tracking or sensitive data.',
        allowed: isTr ? ['Senin için seçildi', 'İlgini çekebilir', 'Hazır olduğunda'] : ['Selected for you', 'You may like', 'When ready'],
        avoid: isTr ? ['Baktığını gördük', 'Tıkladın', 'Gezinmene göre'] : ['We saw you looking', 'You clicked', 'Based on browsing'],
        vague: isTr ? 'Kişisel ama izlenmiş gibi değil' : 'Personal but not tracked',
        evidence: findEvidence(input, ['personal', 'kişisel', 'preference', 'tercih', 'tracked', 'takip'], isTr ? 'Kişiselleştirme sınırı' : 'Personalization boundary'),
        unresolved: isTr
          ? 'AI davranışsal takibi veya hassas veriyi fazla doğrudan açığa çıkarabilir.'
          : 'AI may reveal behavioral tracking or sensitive data too directly.',
        guardrailTitle: isTr ? 'Kişiselleştirme Guardrail' : 'Personalization Guardrail',
        guardrail: isTr
          ? 'Kişiselleştirmeyi örtük tut. Takip, gezinme, tıklama veya hassas veri referansı verme.'
          : 'Keep personalization implicit. Do not mention tracking, browsing, clicks, or sensitive data.',
      }),
    );
  }

  if (addCompliance) {
    tensions.push(
      createTension({
        id: 'creative-compliance',
        name: isTr ? 'Yaratıcılık vs Doğruluk' : 'Creative vs Accurate',
        severity: 'Critical',
        risk: isTr
          ? 'AI doğrulanmamış iddia, fiyat, müsaitlik, tıbbi veya finansal claim üretebilir.'
          : 'AI may invent unverified claims, pricing, availability, medical, or financial claims.',
        surfaces: isTr ? ['Kampanyalar', 'Reklamlar', 'İçerik'] : ['Campaigns', 'Ads', 'Content'],
        why: isTr
          ? 'Yaratıcı dil doğrulanmış gerçekler içinde kalmalıdır.'
          : 'Creative language must stay inside verified facts.',
        ambiguous: isTr
          ? 'Girdi yaratıcı ifade istiyor ama doğruluk/uyum sınırı da koyuyor.'
          : 'The input asks for creative language while also requiring accuracy or compliance.',
        question: isTr
          ? 'Hangi iddialar kanıt veya insan onayı gerektirir?'
          : 'Which claims require proof or human approval?',
        defines: isTr ? 'İddia sınırı, kanıt gereksinimi, inceleme akışı.' : 'Claim boundaries, proof requirements, review routing.',
        resolution: isTr ? 'Doğrulanmış gerçekler etrafında yaratıcılık' : 'Creativity around verified facts',
        rule: isTr
          ? 'Yaratıcı ifadeyi yalnızca doğrulanmış gerçekler etrafında kullan; hassas iddiaları incelemeye yönlendir.'
          : 'Use creative framing only around verified facts; route sensitive claims to review.',
        allowed: isTr ? ['Onaylı gerçekler', 'Net değer açıklaması', 'Doğrulanmış iddialar'] : ['Approved facts', 'Clear value explanation', 'Verified claims'],
        avoid: isTr ? ['Garantili', 'En iyi', 'Risksiz', 'Doğrulanmamış fiyat'] : ['Guaranteed', 'Best', 'Risk-free', 'Unverified pricing'],
        vague: isTr ? 'Yaratıcı ama doğru' : 'Creative but accurate',
        evidence: findEvidence(input, ['compliant', 'uyum', 'accurate', 'doğru', 'pricing', 'fiyat', 'medical', 'finance'], isTr ? 'Uyum/doğruluk sınırı' : 'Accuracy/compliance boundary'),
        unresolved: isTr
          ? 'AI doğrulanmamış ticari, finansal veya hassas iddialar üretebilir.'
          : 'AI may generate unverified commercial, financial, or sensitive claims.',
        guardrailTitle: isTr ? 'Doğruluk Guardrail' : 'Accuracy Guardrail',
        guardrail: isTr
          ? 'Doğrulanmamış fiyat, müsaitlik, performans, tıbbi veya finansal iddia üretme.'
          : 'Do not generate unverified pricing, availability, performance, medical, or financial claims.',
      }),
    );
  }

  if (addLength || tensions.length < 3) {
    tensions.push(
      createTension({
        id: 'short-informative',
        name: isTr ? 'Kısa vs Anlamlı' : 'Short vs Meaningful',
        severity: 'Medium',
        risk: isTr
          ? 'Kısa metinler belirsiz veya jenerik hale gelebilir.'
          : 'Short copy may become vague or generic.',
        surfaces: isTr ? ['Push', 'E-posta Konusu', 'Reklamlar'] : ['Push', 'Email Subject', 'Ads'],
        why: isTr
          ? 'Kısa formatlar da minimum değer taşımalıdır.'
          : 'Short formats still need minimum useful value.',
        ambiguous: isTr
          ? 'Girdi kısalık ve bilgi/değer beklentisini birlikte taşıyor.'
          : 'The input asks for brevity while still needing value or meaning.',
        question: isTr ? 'Kısa formatlarda hangi değer bilgisi kalmalı?' : 'What value must remain in short formats?',
        defines: isTr ? 'Kısa format yoğunluğu ve minimum mesaj değeri.' : 'Short-format density and minimum message value.',
        resolution: isTr ? 'Kısa ama değerli' : 'Concise but useful',
        rule: isTr
          ? 'Kısa mesajlar bir net değer veya sonraki adım içermelidir.'
          : 'Short messages must include one clear value or next step.',
        allowed: isTr ? ['Bir fayda + bir sonraki adım'] : ['One benefit + one next step'],
        avoid: isTr ? ['Belirsiz tek satırlar', 'Boş promosyon'] : ['Vague one-liners', 'Empty promotion'],
        vague: isTr ? 'Kısa ama anlamlı' : 'Short but meaningful',
        evidence: findEvidence(input, ['short', 'brief', 'kısa', 'subject', 'konu'], isTr ? 'Kısa format beklentisi' : 'Short-format expectation'),
        unresolved: isTr
          ? 'AI jenerik, promosyonel veya anlamsız kısa metinler üretebilir.'
          : 'AI may produce generic, promotional, or empty short copy.',
        guardrailTitle: isTr ? 'Kısa Format Guardrail' : 'Short-Format Guardrail',
        guardrail: isTr
          ? 'Kısa formatlarda bir fayda veya sonraki adımı koru; boş promosyonel metin üretme.'
          : 'Preserve one benefit or next step in short formats; do not generate empty promotional copy.',
      }),
    );
  }

  const normalized = tensions
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity])
    .slice(0, 5)
    .map((tension, index) => ({ ...tension, id: tension.id || `tension-${index + 1}` }));

  const briefItems = normalized.slice(0, 5).map((tension) => ({
    title: tension.guardrailTitle,
    text: tension.guardrailContent,
  }));

  return normalizeAnalysisSurfaces({
    analysisId: `analysis_${Date.now()}`,
    source,
    provider: 'deterministic-fallback',
    signals: fallbackSignals[language] ?? fallbackSignals.en,
    tensions: normalized,
    briefItems,
    test: buildTest(language),
  }, brandInput);
}

function buildTest(language) {
  const isTr = language === 'tr';
  return {
    weakPrompt: isTr
      ? 'Geri dönen bir kullanıcı için yüksek dönüşümlü mesaj oluştur.'
      : 'Create a high-converting message for a returning user.',
    riskyOutput: isTr
      ? 'Baktığın ürün tükenmeden hemen al. En iyi fırsat burada.'
      : 'Buy the product you viewed before it sells out. Best deal here.',
    guardrailedPrompt: isTr
      ? 'Kısa, yardımcı ve güvenli bir mesaj oluştur. Takip davranışından bahsetme. Doğrulanmamış aciliyet, fiyat veya kıtlık iddiası kullanma.'
      : 'Create a short, helpful, safe message. Do not mention tracked behavior. Avoid unverified urgency, pricing, or scarcity claims.',
    saferOutput: isTr
      ? 'Hazır olduğunda seçtiğin seçenekleri inceleyebilirsin.'
      : 'Your selected options are here when you are ready.',
  };
}

function outputTextFromResponse(responseJson) {
  if (typeof responseJson.output_text === 'string') {
    return responseJson.output_text;
  }

  const textParts = [];
  for (const item of responseJson.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join('');
}

function analysisSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['signals', 'tensions', 'briefItems', 'test'],
    properties: {
      signals: {
        type: 'array',
        minItems: 3,
        maxItems: 7,
        items: { type: 'string' },
      },
      tensions: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          required: [
            'id',
            'name',
            'severity',
            'risk',
            'affectedSurfaces',
            'whyItMatters',
            'whyAmbiguous',
            'question',
            'defines',
            'resolution',
            'resolvedRule',
            'allowed',
            'avoid',
            'vagueInput',
            'evidenceFromInput',
            'riskIfUnresolved',
            'operationalRule',
            'guardrailTitle',
            'guardrailContent',
          ],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            severity: { type: 'string', enum: ['Medium', 'High', 'Critical'] },
            risk: { type: 'string' },
            affectedSurfaces: { type: 'array', items: { type: 'string' } },
            whyItMatters: { type: 'string' },
            whyAmbiguous: { type: 'string' },
            question: { type: 'string' },
            defines: { type: 'string' },
            resolution: { type: 'string' },
            resolvedRule: { type: 'string' },
            allowed: { type: 'array', items: { type: 'string' } },
            avoid: { type: 'array', items: { type: 'string' } },
            vagueInput: { type: 'string' },
            evidenceFromInput: { type: 'string' },
            riskIfUnresolved: { type: 'string' },
            operationalRule: { type: 'string' },
            guardrailTitle: { type: 'string' },
            guardrailContent: { type: 'string' },
          },
        },
      },
      briefItems: {
        type: 'array',
        minItems: 3,
        maxItems: 7,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['title', 'text'],
          properties: {
            title: { type: 'string' },
            text: { type: 'string' },
          },
        },
      },
      test: {
        type: 'object',
        additionalProperties: false,
        required: ['weakPrompt', 'riskyOutput', 'guardrailedPrompt', 'saferOutput'],
        properties: {
          weakPrompt: { type: 'string' },
          riskyOutput: { type: 'string' },
          guardrailedPrompt: { type: 'string' },
          saferOutput: { type: 'string' },
        },
      },
    },
  };
}

async function analyzeWithOpenAI({ brandInput, language, source }) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  let response;
  try {
    response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAiModel,
        input: [
          {
            role: 'system',
            content:
              'You are TensionOS, a pre-generation strategy layer for AI content systems. Analyze brand discovery notes before they become prompts. Return concise JSON only. Do not generate final marketing content except sample test outputs.',
          },
          {
            role: 'user',
            content: `Language: ${language}. Source label: ${source}.\n\nBrand discovery notes:\n${brandInput}`,
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'tensionos_analysis',
            strict: true,
            schema: analysisSchema(),
          },
        },
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const responseJson = await response.json();
  const text = outputTextFromResponse(responseJson);
  const parsed = JSON.parse(text);

  return {
    analysisId: responseJson.id ?? `analysis_${Date.now()}`,
    source,
    provider: 'openai',
    ...parsed,
  };
}

async function analyzeInput(payload) {
  const language = payload.language === 'tr' ? 'tr' : 'en';
  const brandInput = String(payload.brandInput ?? '').trim();
  const source = String(payload.source ?? 'Custom brand input');

  if (!brandInput) {
    const error = new Error('brandInput is required.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const aiAnalysis = await analyzeWithOpenAI({ brandInput, language, source });
    if (aiAnalysis) {
      return normalizeAnalysisSurfaces(aiAnalysis, brandInput);
    }
  } catch (error) {
    console.warn(error.message);
  }

  return deterministicAnalyze({ brandInput, language, source });
}

async function handleApi(request, response, url) {
  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      product: 'TensionOS',
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      model: openAiModel,
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/analyze-input') {
    const body = await readBody(request);
    const analysis = await analyzeInput(body);
    sendJson(response, 200, analysis);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/generate-questions') {
    const body = await readBody(request);
    sendJson(response, 200, {
      questions: (body.tensions ?? []).map((tension) => ({
        tensionId: tension.id,
        tension: tension.name,
        question: tension.question,
        defines: tension.defines,
      })),
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/resolve-rules') {
    const body = await readBody(request);
    sendJson(response, 200, {
      rules: (body.tensions ?? []).map((tension) => ({
        tensionId: tension.id,
        resolution: tension.resolution,
        rule: tension.resolvedRule,
        allowed: tension.allowed,
        avoid: tension.avoid,
      })),
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/create-guardrails') {
    const body = await readBody(request);
    sendJson(response, 200, {
      briefItems: (body.tensions ?? []).map((tension) => ({
        title: tension.guardrailTitle,
        text: tension.guardrailContent,
      })),
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/test-generation') {
    const body = await readBody(request);
    sendJson(response, 200, {
      test: body.language === 'tr' ? buildTest('tr') : buildTest('en'),
    });
    return;
  }

  sendJson(response, 404, { error: 'API route not found.' });
}

async function serveStatic(response, url) {
  const distDir = path.join(rootDir, 'dist');
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(distDir, pathname);

  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
    };

    response.writeHead(200, {
      'Content-Type': contentTypes[ext] ?? 'application/octet-stream',
    });
    response.end(file);
  } catch {
    try {
      const index = await readFile(path.join(distDir, 'index.html'));
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(index);
    } catch {
      response.writeHead(404);
      response.end('Build not found. Run npm run build first.');
    }
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { ok: true });
    return;
  }

  try {
    if (url.pathname.startsWith('/api')) {
      await handleApi(request, response, url);
      return;
    }

    await serveStatic(response, url);
  } catch (error) {
    console.error(error);
    sendJson(response, error.statusCode ?? 500, { error: error.message ?? 'Internal server error.' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`TensionOS API running on http://127.0.0.1:${port}`);
});
