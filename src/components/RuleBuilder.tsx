import type { BehaviorTrigger } from '../types';

interface RuleBuilderProps {
  trigger: BehaviorTrigger;
}

function RuleBuilder({ trigger }: RuleBuilderProps) {
  return (
    <section className="panel rule-panel">
      <div>
        <p className="section-kicker">Kural oluşturucu</p>
        <h2>{trigger.shortName}</h2>
      </div>

      <div className="field-stack">
        <label>
          Davranış koşulu
          <textarea readOnly value={trigger.behavior} />
        </label>
        <label>
          Çıkarılan niyet
          <input readOnly value={trigger.inferredIntent} />
        </label>
        <label>
          İçerik aksiyonu
          <textarea readOnly value={trigger.contentAction} />
        </label>
        <label>
          Güvenlik koruma kuralı
          <textarea readOnly value={trigger.safetyGuardrail} />
        </label>
      </div>

      <div className="rule-meta">
        <div>
          <span>İnceleme modu</span>
          <strong>{trigger.reviewMode}</strong>
        </div>
        <div>
          <span>Risk seviyesi</span>
          <strong>{trigger.riskLevel}</strong>
        </div>
        <div>
          <span>Güven düzeyi</span>
          <strong>{trigger.confidenceLevel}%</strong>
        </div>
      </div>
    </section>
  );
}

export default RuleBuilder;
