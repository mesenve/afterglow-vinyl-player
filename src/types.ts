export type TriggerStatus = 'Aktif' | 'İnceleme Gerekli' | 'Duraklatıldı' | 'Onaylandı';
export type Level = 'Yüksek' | 'Orta' | 'Düşük';
export type SurfaceFit = 'İyi' | 'İnceleme gerekli';
export type SuggestedAction = 'Onayla' | 'Düzenle' | 'Duraklat';

export interface SafetyReviewData {
  brandFit: Level;
  clarity: Level;
  risk: Level;
  surfaceFit: SurfaceFit;
  suggestedAction: SuggestedAction;
}

export interface BehaviorTrigger {
  id: string;
  shortName: string;
  journeyStep: string;
  behavior: string;
  inferredIntent: string;
  contentAction: string;
  safetyGuardrail: string;
  personalizedOutput: string;
  status: TriggerStatus;
  reviewMode: string;
  riskLevel: Level;
  confidenceLevel: number;
  review: SafetyReviewData;
  guardrailChecks: string[];
}

export interface OutputExample {
  bad: string;
  reason: string;
  safe: string;
}

export interface BehaviorEvent {
  eventName: string;
  sessionId: string;
  userId: string | null;
  productId: string;
  consentStatus: 'analytics_allowed' | 'personalization_allowed';
  timestamp: string;
  metadata: Record<string, string | number | boolean>;
}

export interface PersonalizationDecision {
  endpoint: string;
  triggerId: string;
  intentKey: string;
  contentSlot: string;
  decisionSource: 'rule_engine';
  storageLayer: string;
  approved: boolean;
}
