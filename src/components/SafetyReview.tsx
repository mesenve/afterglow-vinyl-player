import { localizeAction, localizeLevel, type Language } from '../i18n';
import type { BehaviorTrigger, Level } from '../types';

interface SafetyReviewProps {
  trigger: BehaviorTrigger;
  liveRisk: Level;
  language?: Language;
}

function SafetyReview({ trigger, liveRisk, language = 'tr' }: SafetyReviewProps) {
  const isTr = language === 'tr';
  const reviewRows = [
    [isTr ? 'Marka uyumu' : 'Brand fit', localizeLevel(trigger.review.brandFit, language)],
    [isTr ? 'Netlik' : 'Clarity', localizeLevel(trigger.review.clarity, language)],
    ['Risk', localizeLevel(liveRisk, language)],
    [
      isTr ? 'Yüzey uyumu' : 'Surface fit',
      isTr ? trigger.review.surfaceFit : String(trigger.review.surfaceFit).includes('yi') ? 'Good' : 'Needs review',
    ],
    [
      isTr ? 'Önerilen aksiyon' : 'Suggested action',
      String(liveRisk).includes('Y') ? (isTr ? 'Duraklat' : 'Pause') : localizeAction(trigger.review.suggestedAction, language),
    ],
  ];

  return (
    <section className="panel">
      <div>
        <p className="section-kicker">{isTr ? 'Çıktı güvenlik incelemesi' : 'Output safety review'}</p>
        <h2>{isTr ? 'Koruma kuralı sonucu' : 'Guardrail result'}</h2>
      </div>

      <dl className="review-list">
        {reviewRows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default SafetyReview;
