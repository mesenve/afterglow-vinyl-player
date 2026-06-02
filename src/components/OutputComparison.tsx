import type { Language } from '../i18n';
import type { OutputExample } from '../types';

interface OutputComparisonProps {
  examples: OutputExample[];
  language?: Language;
}

function OutputComparison({ examples, language = 'tr' }: OutputComparisonProps) {
  const isTr = language === 'tr';

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            {isTr ? 'Kötü ve güvenli çıktı karşılaştırması' : 'Bad vs safe output comparison'}
          </p>
          <h2>{isTr ? 'Reddedilen ifade kalıpları' : 'Rejected language patterns'}</h2>
        </div>
      </div>

      <div className="comparison-grid">
        {examples.map((example) => (
          <article className="comparison-card" key={example.bad}>
            <div>
              <span className="bad-label">{isTr ? 'Reddedildi' : 'Rejected'}</span>
              <p>{example.bad}</p>
            </div>
            <div>
              <span>{isTr ? 'Gerekçe' : 'Reason'}</span>
              <p>{example.reason}</p>
            </div>
            <div>
              <span className="safe-label">{isTr ? 'Güvenli alternatif' : 'Safe alternative'}</span>
              <p>{example.safe}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OutputComparison;
