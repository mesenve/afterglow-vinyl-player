import { useMemo, useState } from 'react';
import { localizeLevel, localizeStatus, type Language } from '../i18n';
import type { BehaviorEvent, BehaviorTrigger, Level, PersonalizationDecision } from '../types';
import ContentPreview from './ContentPreview';
import GuardrailLog from './GuardrailLog';
import ProductCardPreview from './ProductCardPreview';
import SafetyReview from './SafetyReview';

type PipelineStepId = 'signal' | 'intent' | 'action' | 'guardrail' | 'preview' | 'review';

interface PipelineWorkspaceProps {
  triggers: BehaviorTrigger[];
  selectedTrigger: BehaviorTrigger;
  selectedTriggerId: string;
  productOptions: Array<{ id: string; name: string }>;
  selectedProductId: string;
  activeDescription: string;
  defaultDescription: string;
  productName: string;
  isEditing: boolean;
  liveRisk: Level;
  statusMessage: string;
  behaviorEvent: BehaviorEvent;
  backendDecision: PersonalizationDecision;
  language: Language;
  onSelectTrigger: (triggerId: string) => void;
  onSelectProduct: (productId: string) => void;
  onChangeDescription: (value: string) => void;
  onAction: (action: 'Onayla' | 'Düzenle' | 'Tetikleyiciyi Duraklat') => void;
}

const stepsTr: Array<{ id: PipelineStepId; label: string; description: string }> = [
  { id: 'signal', label: '1. Sinyal', description: 'Davranış event’i yakalanır.' },
  { id: 'intent', label: '2. Niyet', description: 'Kural motoru olası niyeti çıkarır.' },
  { id: 'action', label: '3. Aksiyon', description: 'İzinli içerik alanı seçilir.' },
  { id: 'guardrail', label: '4. Guardrail', description: 'Riskli ifade kalıpları kontrol edilir.' },
  { id: 'preview', label: '5. Önizleme', description: 'Onaylı varyant ürün yüzeyinde gösterilir.' },
  { id: 'review', label: '6. İnceleme', description: 'Ekip onaylar, düzenler veya duraklatır.' },
];

const stepsEn: Array<{ id: PipelineStepId; label: string; description: string }> = [
  { id: 'signal', label: '1. Signal', description: 'Behavior event is captured.' },
  { id: 'intent', label: '2. Intent', description: 'The rule engine infers likely intent.' },
  { id: 'action', label: '3. Action', description: 'An allowed content slot is selected.' },
  { id: 'guardrail', label: '4. Guardrail', description: 'Risky language patterns are checked.' },
  { id: 'preview', label: '5. Preview', description: 'Approved copy appears on the product surface.' },
  { id: 'review', label: '6. Review', description: 'The team approves, edits, or pauses.' },
];

const signalChipsTr: Record<string, string> = {
  'repeated-product-view': '3+ görüntüleme',
  'price-filter-used': 'Fiyat filtresi',
  'reviews-opened': 'Yorum',
  'similar-products-compared': 'Karşılaştırma',
  'cart-abandoned': 'Sepet',
};

const signalChipsEn: Record<string, string> = {
  'repeated-product-view': '3+ views',
  'price-filter-used': 'Price',
  'reviews-opened': 'Reviews',
  'similar-products-compared': 'Compare',
  'cart-abandoned': 'Cart',
};

function PipelineWorkspace({
  triggers,
  selectedTrigger,
  selectedTriggerId,
  productOptions,
  selectedProductId,
  activeDescription,
  defaultDescription,
  productName,
  isEditing,
  liveRisk,
  statusMessage,
  behaviorEvent,
  backendDecision,
  language,
  onSelectTrigger,
  onSelectProduct,
  onChangeDescription,
  onAction,
}: PipelineWorkspaceProps) {
  const [activeStep, setActiveStep] = useState<PipelineStepId>('signal');
  const isTr = language === 'tr';
  const steps = isTr ? stepsTr : stepsEn;
  const chipLabels = isTr ? signalChipsTr : signalChipsEn;

  const text = {
    sourceKicker: isTr ? 'Sinyal kaynağı' : 'Signal source',
    sourceTitle: isTr ? 'Ürün ve davranış' : 'Product and behavior',
    product: isTr ? 'Ürün' : 'Product',
    signal: isTr ? 'Davranış sinyali' : 'Behavior signal',
    selectedSignal: isTr ? 'Seçilen sinyal' : 'Selected signal',
    pipelineKicker: isTr ? 'Adım adım pipeline' : 'Step-by-step pipeline',
    previous: isTr ? 'Önceki adım' : 'Previous step',
    next: isTr ? 'Sonraki adım' : 'Next step',
    signalCard: isTr ? 'Müşteri sinyali' : 'Customer signal',
    eventContext: isTr ? 'Event bağlamı' : 'Event context',
    eventCopy: isTr
      ? 'Event session ve ürün ID ile backend event collector’a gönderilir.'
      : 'The event is sent to the backend collector with session and product ID.',
    intent: isTr ? 'Çıkarılan niyet' : 'Inferred intent',
    intentCopy: isTr
      ? 'Bu sonuç kesin kullanıcı profili değil, davranış sinyalinden türetilen olasılıklı bir niyettir.'
      : 'This is not a fixed user profile; it is a likely intent inferred from behavior.',
    confidenceCopy: isTr
      ? 'Belirsizlik arttıkça review mode daha kontrollü hale gelir.'
      : 'Higher uncertainty moves the rule into a stricter review mode.',
    action: isTr ? 'İçerik aksiyonu' : 'Content action',
    actionCopy: isTr
      ? 'Sistem serbest üretim yapmaz; yalnızca izin verilen slot için onaylı veya review bekleyen varyant seçer.'
      : 'The system does not generate freely; it selects an approved or review-pending variant for an allowed slot.',
    controls: isTr ? 'İnceleme kontrolleri' : 'Review controls',
    controlsTitle: isTr ? 'Onayla veya duraklat' : 'Approve or pause',
    approve: isTr ? 'Onayla' : 'Approve',
    edit: isTr ? 'Düzenle' : 'Edit',
    pause: isTr ? 'Duraklat' : 'Pause',
    inspector: 'Inspector',
    status: isTr ? 'Durum' : 'Status',
    risk: 'Risk',
    confidence: 'Confidence',
    reviewMode: isTr ? 'Review modu' : 'Review mode',
    decision: isTr ? 'Karar' : 'Decision',
    backendEvent: 'Backend event',
  };

  const activeStepIndex = useMemo(() => steps.findIndex((step) => step.id === activeStep), [activeStep, steps]);

  const goToStep = (direction: -1 | 1) => {
    const nextIndex = Math.min(Math.max(activeStepIndex + direction, 0), steps.length - 1);
    setActiveStep(steps[nextIndex].id);
  };

  const renderStage = () => {
    if (activeStep === 'signal') {
      return (
        <div className="stage-grid">
          <article className="stage-card">
            <span>{text.signalCard}</span>
            <h3>{behaviorEvent.eventName}</h3>
            <p>{selectedTrigger.behavior}</p>
          </article>
          <article className="stage-card">
            <span>{text.eventContext}</span>
            <h3>{behaviorEvent.consentStatus}</h3>
            <p>{text.eventCopy}</p>
          </article>
        </div>
      );
    }

    if (activeStep === 'intent') {
      return (
        <div className="stage-grid">
          <article className="stage-card">
            <span>{text.intent}</span>
            <h3>{selectedTrigger.inferredIntent}</h3>
            <p>{text.intentCopy}</p>
          </article>
          <article className="stage-card">
            <span>Confidence</span>
            <h3>{selectedTrigger.confidenceLevel}%</h3>
            <p>{text.confidenceCopy}</p>
          </article>
        </div>
      );
    }

    if (activeStep === 'action') {
      return (
        <div className="stage-grid">
          <article className="stage-card wide">
            <span>{text.action}</span>
            <h3>{selectedTrigger.contentAction}</h3>
            <p>{text.actionCopy}</p>
          </article>
          <article className="stage-card">
            <span>Content slot</span>
            <h3>{backendDecision.contentSlot}</h3>
            <p>{backendDecision.endpoint}</p>
          </article>
        </div>
      );
    }

    if (activeStep === 'guardrail') {
      return <GuardrailLog trigger={selectedTrigger} editedDescription={activeDescription} liveRisk={liveRisk} language={language} />;
    }

    if (activeStep === 'preview') {
      return (
        <div className="stage-preview-grid">
          <ContentPreview
            productName={productName}
            defaultDescription={defaultDescription}
            personalizedDescription={activeDescription}
            triggerName={selectedTrigger.shortName}
            isEditing={isEditing}
            onChangeDescription={onChangeDescription}
            language={language}
          />
          <ProductCardPreview
            productName={productName}
            description={activeDescription}
            triggerName={selectedTrigger.shortName}
            language={language}
          />
        </div>
      );
    }

    return (
      <div className="stage-preview-grid">
        <SafetyReview trigger={selectedTrigger} liveRisk={liveRisk} language={language} />
        <section className="action-card">
          <div>
            <p className="section-kicker">{text.controls}</p>
            <h2>{text.controlsTitle}</h2>
          </div>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={() => onAction('Onayla')}>
              {text.approve}
            </button>
            <button type="button" onClick={() => onAction('Düzenle')}>
              {text.edit}
            </button>
            <button type="button" className="danger-button" onClick={() => onAction('Tetikleyiciyi Duraklat')}>
              {text.pause}
            </button>
          </div>
          <p className="status-message" role="status">
            {statusMessage}
          </p>
        </section>
      </div>
    );
  };

  return (
    <section className="pipeline-shell">
      <aside className="pipeline-left panel">
        <div>
          <p className="section-kicker">{text.sourceKicker}</p>
          <h2>{text.sourceTitle}</h2>
        </div>

        <div className="source-controls">
          <label>
            {text.product}
            <select value={selectedProductId} onChange={(event) => onSelectProduct(event.target.value)}>
              {productOptions.map((product) => (
                <option value={product.id} key={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            {text.signal}
            <select value={selectedTriggerId} onChange={(event) => onSelectTrigger(event.target.value)}>
              {triggers.map((trigger) => (
                <option value={trigger.id} key={trigger.id}>
                  {trigger.shortName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="signal-summary">
          <span>{text.selectedSignal}</span>
          <strong>{selectedTrigger.shortName}</strong>
          <p>{selectedTrigger.behavior}</p>
          <small>{selectedTrigger.inferredIntent}</small>
        </div>

        <div className="signal-chips" aria-label={isTr ? 'Hızlı sinyal seçimi' : 'Quick signal selection'}>
          {triggers.map((trigger) => (
            <button
              type="button"
              className={selectedTriggerId === trigger.id ? 'selected' : ''}
              key={trigger.id}
              onClick={() => onSelectTrigger(trigger.id)}
              title={trigger.journeyStep}
            >
              {chipLabels[trigger.id] ?? trigger.shortName}
            </button>
          ))}
        </div>
      </aside>

      <section className="pipeline-main panel">
        <div className="pipeline-header">
          <div>
            <p className="section-kicker">{text.pipelineKicker}</p>
            <h2>{selectedTrigger.shortName}</h2>
          </div>
          <span className={`risk-chip risk-${String(liveRisk).includes('Y') ? 'high' : String(liveRisk).includes('O') ? 'medium' : 'low'}`}>
            {text.risk}: {localizeLevel(liveRisk, language)}
          </span>
        </div>

        <div className="pipeline-nodes" role="tablist" aria-label={isTr ? 'Pipeline adımları' : 'Pipeline steps'}>
          {steps.map((step) => (
            <button
              type="button"
              className={`pipeline-node ${activeStep === step.id ? 'selected' : ''}`}
              key={step.id}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="node-dot" aria-hidden="true" />
              <strong>{step.label}</strong>
              <span>{step.description}</span>
            </button>
          ))}
        </div>

        <div className="stage-panel">{renderStage()}</div>

        <div className="pipeline-controls">
          <button type="button" onClick={() => goToStep(-1)} disabled={activeStepIndex === 0}>
            {text.previous}
          </button>
          <button type="button" className="primary-button" onClick={() => goToStep(1)} disabled={activeStepIndex === steps.length - 1}>
            {text.next}
          </button>
        </div>
      </section>

      <aside className="pipeline-right inspector-panel panel">
        <div>
          <p className="section-kicker">{text.inspector}</p>
          <h2>{selectedTrigger.shortName}</h2>
        </div>

        <dl className="inspector-list">
          <div>
            <dt>{text.status}</dt>
            <dd>{localizeStatus(selectedTrigger.status, language)}</dd>
          </div>
          <div>
            <dt>{text.risk}</dt>
            <dd>{localizeLevel(liveRisk, language)}</dd>
          </div>
          <div>
            <dt>{text.confidence}</dt>
            <dd>{selectedTrigger.confidenceLevel}%</dd>
          </div>
          <div>
            <dt>{text.reviewMode}</dt>
            <dd>{selectedTrigger.reviewMode}</dd>
          </div>
        </dl>

        <section className="inspector-section">
          <span>{text.signalCard}</span>
          <p>{selectedTrigger.behavior}</p>
        </section>

        <section className="inspector-section">
          <span>{text.decision}</span>
          <p>{selectedTrigger.inferredIntent}</p>
          <p>{selectedTrigger.contentAction}</p>
        </section>

        <section className="inspector-section">
          <span>{text.backendEvent}</span>
          <code>{behaviorEvent.eventName}</code>
          <code>{backendDecision.intentKey}</code>
        </section>
      </aside>
    </section>
  );
}

export default PipelineWorkspace;
