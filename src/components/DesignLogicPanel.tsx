import type { Language } from '../i18n';

interface DesignLogicPanelProps {
  language?: Language;
}

function DesignLogicPanel({ language = 'tr' }: DesignLogicPanelProps) {
  const isTr = language === 'tr';

  return (
    <section className="panel design-logic">
      <p className="section-kicker">{isTr ? 'Tasarım mantığı' : 'Design logic'}</p>
      <h2>{isTr ? 'Daha güvenli kişiselleştirme modeli' : 'A safer personalization model'}</h2>
      <p>
        {isTr
          ? 'Bu prototip, AI kişiselleştirmeye daha güvenli bir yaklaşımı gösterir. Sistem, her kullanıcı için rastgele varyasyonlar üretmek yerine davranış sinyallerini çıkarılan niyet, kontrollü içerik aksiyonları ve açık güvenlik koruma kurallarıyla ilişkilendirir. Amaç, kişiselleştirmenin kafa karıştırıcı, baskıcı veya yanıltıcı olmadan faydalı hissettirmesidir.'
          : 'This prototype demonstrates a safer approach to AI personalization. Instead of generating random variations for every user, the system connects behavior signals to inferred intent, controlled content actions, and explicit safety guardrails. The goal is to make personalization feel useful without becoming confusing, pushy, or misleading.'}
      </p>
    </section>
  );
}

export default DesignLogicPanel;
