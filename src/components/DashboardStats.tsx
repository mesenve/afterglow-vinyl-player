import { useMemo, useState } from 'react';
import type { BehaviorTrigger, TriggerStatus } from '../types';
import type { Language } from '../i18n';

interface DashboardStatsProps {
  triggers: BehaviorTrigger[];
  language: Language;
  onSelectTrigger: (triggerId: string) => void;
}

function DashboardStats({ triggers, language, onSelectTrigger }: DashboardStatsProps) {
  const [selectedStatId, setSelectedStatId] = useState('active');
  const statusById = {
    active: triggers.find((trigger) => trigger.id === 'repeated-product-view')?.status,
    review: triggers.find((trigger) => trigger.id === 'reviews-opened')?.status,
    paused: triggers.find((trigger) => trigger.id === 'cart-abandoned')?.status,
    approved: triggers.find((trigger) => trigger.id === 'price-filter-used')?.status,
  } as Record<string, TriggerStatus | undefined>;

  const statLabels = [
    {
      id: 'active',
      label: language === 'tr' ? 'Aktif tetikleyici' : 'Active triggers',
      helper:
        language === 'tr'
          ? 'Şu anda çalışmasına izin verilen davranış kuralları'
          : 'Behavior rules currently allowed to run',
      status: statusById.active,
    },
    {
      id: 'low-risk',
      label: language === 'tr' ? 'Düşük riskli karar' : 'Low-risk decisions',
      helper:
        language === 'tr'
          ? 'Guardrail kontrolünden güvenli geçen içerik kararları'
          : 'Content decisions that pass guardrail checks',
    },
    {
      id: 'review',
      label: language === 'tr' ? 'İnceleme bekleyen' : 'Needs review',
      helper:
        language === 'tr'
          ? 'Yayınlanmadan önce insan onayı isteyen varyantlar'
          : 'Variants requiring human approval before publishing',
      status: statusById.review,
    },
    {
      id: 'paused',
      label: language === 'tr' ? 'Duraklatılan' : 'Paused',
      helper:
        language === 'tr'
          ? 'Risk veya politika nedeniyle kapatılan tetikleyiciler'
          : 'Triggers stopped because of policy or risk',
      status: statusById.paused,
    },
    {
      id: 'approved',
      label: language === 'tr' ? 'Onaylı varyant' : 'Approved variants',
      helper:
        language === 'tr'
          ? 'Ürün yüzeyinde gösterilebilecek onaylı metinler'
          : 'Approved copy that can appear on product surfaces',
      status: statusById.approved,
    },
  ];

  const selectedStat = statLabels.find((stat) => stat.id === selectedStatId) ?? statLabels[0];

  const selectedItems = useMemo(() => {
    if (selectedStat.id === 'low-risk') {
      return triggers.filter((trigger) => String(trigger.riskLevel).includes('D'));
    }

    return triggers.filter((trigger) => trigger.status === selectedStat.status);
  }, [selectedStat, triggers]);

  const getValue = (id: string, status?: TriggerStatus) => {
    if (id === 'low-risk') {
      return triggers.filter((trigger) => String(trigger.riskLevel).includes('D')).length;
    }

    return triggers.filter((trigger) => trigger.status === status).length;
  };

  return (
    <section className="stats-panel" aria-label={language === 'tr' ? 'Panel özeti' : 'Dashboard summary'}>
      <div className="stats-grid">
        {statLabels.map((stat) => (
          <button
            type="button"
            className={`stat-card ${selectedStatId === stat.id ? 'selected' : ''}`}
            key={stat.id}
            onClick={() => setSelectedStatId(stat.id)}
          >
            <p>{stat.label}</p>
            <span>{stat.helper}</span>
            <strong>{getValue(stat.id, stat.status)}</strong>
          </button>
        ))}
      </div>

      <div className="stat-drawer" aria-live="polite">
        <div>
          <p className="section-kicker">
            {selectedStat.label} {language === 'tr' ? 'listesi' : 'list'}
          </p>
          <span>{selectedStat.helper}</span>
        </div>
        <div className="stat-result-list">
          {selectedItems.map((trigger) => (
            <button type="button" key={trigger.id} onClick={() => onSelectTrigger(trigger.id)}>
              <strong>{trigger.shortName}</strong>
              <span>{trigger.behavior}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardStats;
