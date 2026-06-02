import type { BehaviorEvent, BehaviorTrigger, PersonalizationDecision } from '../types';

const eventNameByTriggerId: Record<string, string> = {
  'repeated-product-view': 'product_viewed',
  'price-filter-used': 'filter_applied',
  'reviews-opened': 'reviews_opened',
  'similar-products-compared': 'product_compared',
  'cart-abandoned': 'checkout_not_completed',
};

const intentKeyByTriggerId: Record<string, string> = {
  'repeated-product-view': 'interested_but_undecided',
  'price-filter-used': 'price_sensitive_comparison',
  'reviews-opened': 'needs_trust_reassurance',
  'similar-products-compared': 'evaluating_alternatives',
  'cart-abandoned': 'purchase_intent_with_hesitation',
};

export function buildMockBehaviorEvent(trigger: BehaviorTrigger): BehaviorEvent {
  return {
    eventName: eventNameByTriggerId[trigger.id],
    sessionId: 'anon_session_42f8',
    userId: null,
    productId: 'aerorun-daily-shoe',
    consentStatus: 'personalization_allowed',
    timestamp: '2026-05-13T10:30:00Z',
    metadata: {
      triggerId: trigger.id,
      source: 'product_detail_page',
      windowHours: trigger.id === 'repeated-product-view' ? 48 : 24,
      eventCount: trigger.id === 'repeated-product-view' ? 3 : 1,
    },
  };
}

export function buildMockDecision(trigger: BehaviorTrigger): PersonalizationDecision {
  return {
    endpoint: 'GET /api/personalization/product-copy?productId=aerorun-daily-shoe',
    triggerId: trigger.id,
    intentKey: intentKeyByTriggerId[trigger.id],
    contentSlot: 'product.description',
    decisionSource: 'rule_engine',
    storageLayer: 'events table + approved_variants table',
    approved: trigger.status !== 'Duraklatıldı',
  };
}
