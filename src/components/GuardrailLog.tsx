import { localizeLevel, type Language } from '../i18n';
import type { BehaviorTrigger, Level } from '../types';

interface GuardrailLogProps {
  trigger: BehaviorTrigger;
  editedDescription: string;
  liveRisk: Level;
  language?: Language;
}

const riskyTerms = ['hemen', 'tükenmeden', 'en ucuz', 'herkes', 'kaçırma', 'buy now', 'cheapest'];

function GuardrailLog({ trigger, editedDescription, liveRisk, language = 'tr' }: GuardrailLogProps) {
  const isTr = language === 'tr';
  const detectedTerms = riskyTerms.filter((term) => editedDescription.toLocaleLowerCase('tr-TR').includes(term));

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{isTr ? 'Guardrail karar günlüğü' : 'Guardrail decision log'}</p>
          <h2>{isTr ? 'Deterministik güvenlik kontrolü' : 'Deterministic safety check'}</h2>
        </div>
        <span className={`risk-chip risk-${String(liveRisk).includes('Y') ? 'high' : String(liveRisk).includes('O') ? 'medium' : 'low'}`}>
          {isTr ? 'Canlı risk' : 'Live risk'}: {localizeLevel(liveRisk, language)}
        </span>
      </div>

      <div className="guardrail-list">
        {trigger.guardrailChecks.map((check) => (
          <div className="guardrail-item pass" key={check}>
            <span aria-label={isTr ? 'Geçti' : 'Passed'} title={isTr ? 'Geçti' : 'Passed'}>
              ✓
            </span>
            <p>{check}</p>
          </div>
        ))}
        <div className={`guardrail-item ${detectedTerms.length ? 'warn' : 'pass'}`}>
          <span
            aria-label={detectedTerms.length ? (isTr ? 'Uyarı' : 'Warning') : isTr ? 'Geçti' : 'Passed'}
            title={detectedTerms.length ? (isTr ? 'Uyarı' : 'Warning') : isTr ? 'Geçti' : 'Passed'}
          >
            {detectedTerms.length ? '!' : '✓'}
          </span>
          <p>
            {detectedTerms.length
              ? isTr
                ? `Düzenlenen metinde riskli ifade bulundu: ${detectedTerms.join(', ')}.`
                : `Risky language found in edited copy: ${detectedTerms.join(', ')}.`
              : isTr
                ? 'Düzenlenen metinde baskı, sahte aciliyet veya desteksiz iddia bulunmadı.'
                : 'No pressure, fake urgency, or unsupported claim was found in the edited copy.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default GuardrailLog;
