import type { Language } from '../i18n';
import type { BehaviorTrigger } from '../types';

interface ApprovalQueueProps {
  triggers: BehaviorTrigger[];
  language?: Language;
}

function ApprovalQueue({ triggers, language = 'tr' }: ApprovalQueueProps) {
  const isTr = language === 'tr';
  const reviewStatus = triggers.find((trigger) => trigger.id === 'reviews-opened')?.status;
  const approvedStatus = triggers.find((trigger) => trigger.id === 'price-filter-used')?.status;
  const pausedStatus = triggers.find((trigger) => trigger.id === 'cart-abandoned')?.status;
  const reviewItems = triggers.filter((trigger) => trigger.status === reviewStatus);
  const approvedItems = triggers.filter((trigger) => trigger.status === approvedStatus);
  const pausedItems = triggers.filter((trigger) => trigger.status === pausedStatus);

  return (
    <section className="panel">
      <div>
        <p className="section-kicker">{isTr ? 'İnceleme kuyruğu' : 'Review queue'}</p>
        <h2>{isTr ? 'Operasyon görünümü' : 'Operations view'}</h2>
      </div>

      <div className="queue-grid">
        <article>
          <span>{isTr ? 'Bekleyen' : 'Pending'}</span>
          <strong>{reviewItems.length}</strong>
          <p>{reviewItems.map((item) => item.shortName).join(', ') || (isTr ? 'Bekleyen varyant yok' : 'No pending variants')}</p>
        </article>
        <article>
          <span>{isTr ? 'Onaylanan' : 'Approved'}</span>
          <strong>{approvedItems.length}</strong>
          <p>{approvedItems.map((item) => item.shortName).join(', ') || (isTr ? 'Onaylı varyant yok' : 'No approved variants')}</p>
        </article>
        <article>
          <span>{isTr ? 'Duraklatılan' : 'Paused'}</span>
          <strong>{pausedItems.length}</strong>
          <p>{pausedItems.map((item) => item.shortName).join(', ') || (isTr ? 'Duraklatılan tetikleyici yok' : 'No paused triggers')}</p>
        </article>
      </div>
    </section>
  );
}

export default ApprovalQueue;
