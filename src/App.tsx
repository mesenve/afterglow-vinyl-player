import { useState } from 'react';
import bgtsLogo from './assets/bgts-logo-positive.png';

type EaseRating = 'easy' | 'mostly-easy' | 'sometimes-hard' | 'hard';

type FormState = {
  ease: EaseRating | '';
  betterInfo: string[];
  contentFormats: string[];
  clearerAnnouncement: string[];
  missingPoint: string[];
  suggestion: string;
};

const totalQuestions = 6;

const easeOptions: Array<{ value: EaseRating; label: string; face: string; tone: string }> = [
  { value: 'easy', label: 'Çok kolay', face: ':)', tone: 'green' },
  { value: 'mostly-easy', label: 'Genelde kolay', face: ':)', tone: 'lime' },
  { value: 'sometimes-hard', label: 'Bazen zor', face: ':|', tone: 'amber' },
  { value: 'hard', label: 'Zor', face: ':(', tone: 'rose' },
];

const betterInfoOptions = [
  'Stratejik öncelikler',
  'Ekip duyuruları',
  'Proje gelişmeleri',
  'Etkinlikler',
  'Kariyer ve gelişim fırsatları',
  'Global ekiplerden haberler',
];

const contentFormatOptions = [
  'Kısa bülten',
  'Görsel özet',
  'Video mesajı',
  'Aylık recap',
  'Ekip bazlı duyurular',
  'Çalışan hikayeleri',
];

const announcementOptions = [
  'Kısa ve net başlık',
  'Kimin için olduğu açıkça belirtilmesi',
  'Ne yapılması gerektiğinin net olması',
  'Tarih / deadline bilgisinin görünür olması',
  'Görsel özet veya ikon kullanımı',
  'Tek bir yerde kolayca bulunabilmesi',
];

const missingPointOptions = [
  'Öncelikler',
  'Sorumluluklar',
  'Takvim ve etkinlikler',
  'Kariyer / gelişim fırsatları',
  'Proje güncellemeleri',
  'Başarıların ve katkıların görünürlüğü',
];

function toggleValue(values: string[], value: string, max?: number) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  if (max && values.length >= max) {
    return [...values.slice(1), value];
  }

  return [...values, value];
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    ease: '',
    betterInfo: [],
    contentFormats: [],
    clearerAnnouncement: [],
    missingPoint: [],
    suggestion: '',
  });

  const progress = Math.round(((activeStep + 1) / totalQuestions) * 100);
  const isLastStep = activeStep === totalQuestions - 1;

  const goBack = () => setActiveStep((current) => Math.max(0, current - 1));
  const goNext = () => setActiveStep((current) => Math.min(totalQuestions - 1, current + 1));

  return (
    <main className="clarity-shell">
      <section className="hero-panel" aria-labelledby="survey-title">
        <div className="brand-mark">
          <img src={bgtsLogo} alt="BGTS" />
        </div>

        <div className="hero-copy">
          <h1 id="survey-title">BGTS Clarity Check</h1>
          <p>
            Bilgiyi daha net, daha erişilebilir ve daha faydalı paylaşmak için
            senin içgörüne ihtiyacımız var.
          </p>
        </div>
      </section>

      {!submitted ? (
      <section className="survey-status" aria-label="Anket ilerlemesi">
        <div>
          <strong>Soru {activeStep + 1}/{totalQuestions}</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>
      ) : null}

      {!submitted ? (
      <form className="survey-stage">
        {activeStep === 0 ? (
          <section className="question-card question-page rating-card">
            <QuestionHeading
              number="1"
              title="Takip Kolaylığı"
              helper="Şirket içi gelişmeleri takip etmek senin için ne kadar kolay?"
            />

            <div className="rating-row" role="radiogroup" aria-label="Takip kolaylığı">
              {easeOptions.map((option) => (
                <button
                  className={`rating-button ${option.tone} ${form.ease === option.value ? 'selected' : ''}`}
                  key={option.value}
                  onClick={() => setForm((current) => ({ ...current, ease: option.value }))}
                  type="button"
                  aria-pressed={form.ease === option.value}
                >
                  <span className="face">{option.face}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

          </section>
        ) : null}

        {activeStep === 1 ? (
          <OptionSection
            number="2"
            title="Hangi bilgiler daha net paylaşılırsa iş deneyimini güçlendirir?"
            helper="Birden fazla seçebilirsin."
            options={betterInfoOptions}
            values={form.betterInfo}
            onToggle={(value) => setForm((current) => ({
              ...current,
              betterInfo: toggleValue(current.betterInfo, value),
            }))}
          />
        ) : null}

        {activeStep === 2 ? (
          <OptionSection
            number="3"
            title="İç iletişim içerikleri hangi formatta senin için daha faydalı olur?"
            helper="Birden fazla seçebilirsin."
            options={contentFormatOptions}
            values={form.contentFormats}
            onToggle={(value) => setForm((current) => ({
              ...current,
              contentFormats: toggleValue(current.contentFormats, value),
            }))}
          />
        ) : null}

        {activeStep === 3 ? (
          <ChecklistSection
            number="4"
            title="Bir duyuruyu daha anlaşılır yapan şey nedir?"
            helper="Birden fazla seçebilirsin."
            options={announcementOptions}
            values={form.clearerAnnouncement}
            onToggle={(value) => setForm((current) => ({
              ...current,
              clearerAnnouncement: toggleValue(current.clearerAnnouncement, value),
            }))}
          />
        ) : null}

        {activeStep === 4 ? (
          <OptionSection
            number="5"
            title="Şirket içi iletişimde en çok hangi noktada netliğe ihtiyaç duyuyorsun?"
            helper="En önemli 2 seçeneği işaretleyebilirsin."
            options={missingPointOptions}
            values={form.missingPoint}
            max={2}
            onToggle={(value) => setForm((current) => ({
              ...current,
              missingPoint: toggleValue(current.missingPoint, value, 2),
            }))}
          />
        ) : null}

        {activeStep === 5 ? (
          <section className="question-card question-page response-card">
            <QuestionHeading
              number="6"
              title="BGTS'te iç iletişimi daha net hale getirmek için tek bir şey değiştirebilseydin, ne olurdu?"
              helper="Fikrin bizim için çok değerli."
            />

            <label className="text-answer">
              <span>Yanıtın</span>
              <textarea
                value={form.suggestion}
                onChange={(event) => setForm((current) => ({ ...current, suggestion: event.target.value }))}
                placeholder="Örneğin: duyuruların tek bir haftalık özetle gelmesi..."
                rows={7}
              />
            </label>
          </section>
        ) : null}
      </form>
      ) : null}

      {!submitted ? (
      <section className="survey-actions" aria-label="Anket sayfa kontrolleri">
        <button className="nav-button secondary" disabled={activeStep === 0} onClick={goBack} type="button">
          Geri
        </button>
        <div className="step-dots" aria-hidden="true">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <span className={index === activeStep ? 'active' : ''} key={index} />
          ))}
        </div>
        <button className="nav-button primary" onClick={isLastStep ? () => setSubmitted(true) : goNext} type="button">
          {isLastStep ? 'Anketi tamamla' : 'İleri'}
        </button>
      </section>
      ) : null}

      {submitted ? (
        <section className="closing-panel">
          <div className="thanks-card">
            <span className="send-icon" aria-hidden="true">✓</span>
            <div>
              <strong>Senin cevabın, daha iyi bir BGTS deneyimi yaratmamıza yardımcı olur.</strong>
              <p>Teşekkürler!</p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function QuestionHeading({ number, title, helper }: { number: string; title: string; helper: string }) {
  return (
    <div className="question-heading">
      <span className="question-number">{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{helper}</p>
      </div>
    </div>
  );
}

function OptionSection({
  number,
  title,
  helper,
  options,
  values,
  max,
  onToggle,
}: {
  number: string;
  title: string;
  helper: string;
  options: string[];
  values: string[];
  max?: number;
  onToggle: (value: string) => void;
}) {
  return (
    <section className="question-card question-page">
      <QuestionHeading number={number} title={title} helper={helper} />

      <div className="option-grid">
        {options.map((option) => {
          const selected = values.includes(option);

          return (
            <button
              className={`option-tile ${selected ? 'selected' : ''}`}
              key={option}
              onClick={() => onToggle(option)}
              type="button"
              aria-pressed={selected}
            >
              <span className="tile-icon" aria-hidden="true">{selected ? '✓' : ''}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {max ? <p className="limit-copy">{values.length}/{max} seçildi</p> : null}
    </section>
  );
}

function ChecklistSection({
  number,
  title,
  helper,
  options,
  values,
  onToggle,
}: {
  number: string;
  title: string;
  helper: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section className="question-card question-page checklist-card">
      <QuestionHeading number={number} title={title} helper={helper} />

      <div className="checklist">
        {options.map((option) => {
          const selected = values.includes(option);

          return (
            <label className={`check-row ${selected ? 'selected' : ''}`} key={option}>
              <input
                checked={selected}
                onChange={() => onToggle(option)}
                type="checkbox"
              />
              <span className="fake-check" aria-hidden="true">{selected ? '✓' : ''}</span>
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

export default App;
