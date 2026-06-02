import type { Language } from '../i18n';
import type { BehaviorEvent, PersonalizationDecision } from '../types';

interface BackendRealityPanelProps {
  event: BehaviorEvent;
  decision: PersonalizationDecision;
  language?: Language;
}

function BackendRealityPanel({ event, decision, language = 'tr' }: BackendRealityPanelProps) {
  const isTr = language === 'tr';
  const payloadRows = [
    [isTr ? 'Event adı' : 'Event name', event.eventName],
    ['Session', event.sessionId],
    [isTr ? 'İzin durumu' : 'Consent status', event.consentStatus],
    [isTr ? 'Ürün ID' : 'Product ID', event.productId],
  ];

  const decisionRows = [
    ['Endpoint', decision.endpoint],
    [isTr ? 'Niyet anahtarı' : 'Intent key', decision.intentKey],
    [isTr ? 'İçerik alanı' : 'Content slot', decision.contentSlot],
    [isTr ? 'Karar kaynağı' : 'Decision source', decision.decisionSource],
  ];

  const backendSteps = isTr
    ? [
        { title: '1. Sinyal gönderilir', detail: 'Frontend kullanıcı davranışını event olarak yollar.' },
        { title: '2. Event kaydedilir', detail: 'Backend bu olayı session, ürün ve izin bilgisiyle saklar.' },
        { title: '3. Kural karar verir', detail: 'Rule engine sinyalden olası niyeti ve güvenli aksiyonu seçer.' },
        { title: '4. Onaylı metin seçilir', detail: 'Sadece guardrail’den geçen varyant frontend’e döner.' },
      ]
    : [
        { title: '1. Signal is sent', detail: 'The frontend sends shopper behavior as an event.' },
        { title: '2. Event is stored', detail: 'The backend stores session, product, and consent context.' },
        { title: '3. Rule decides', detail: 'The rule engine selects likely intent and a safe action.' },
        { title: '4. Approved copy returns', detail: 'Only guardrail-approved variants return to the frontend.' },
      ];

  return (
    <section className="panel backend-panel">
      <div>
        <p className="section-kicker">{isTr ? 'Gerçek backend modeli' : 'Real backend model'}</p>
        <h2>{isTr ? 'Davranıştan içerik kararına' : 'From behavior to content decision'}</h2>
      </div>

      <div className="pipeline-steps" aria-label={isTr ? 'Backend veri hattı' : 'Backend data pipeline'}>
        {backendSteps.map((step) => (
          <span key={step.title}>
            <strong>{step.title}</strong>
            <small>{step.detail}</small>
          </span>
        ))}
      </div>

      <div className="backend-grid">
        <article>
          <span className="mini-title">POST /api/events</span>
          {payloadRows.map(([label, value]) => (
            <p key={label}>
              <strong>{label}</strong>
              <code>{value}</code>
            </p>
          ))}
        </article>

        <article>
          <span className="mini-title">{isTr ? 'Karar yanıtı' : 'Decision response'}</span>
          {decisionRows.map(([label, value]) => (
            <p key={label}>
              <strong>{label}</strong>
              <code>{value}</code>
            </p>
          ))}
        </article>
      </div>

      <p className="privacy-note">
        {isTr
          ? 'Üretimde bu veri çerez/KVKK izniyle, veri minimizasyonu ve onaylı içerik varyantları üzerinden çalışır.'
          : 'In production, this flow depends on consent, data minimization, and approved content variants.'}
      </p>
    </section>
  );
}

export default BackendRealityPanel;
