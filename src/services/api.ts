import type { BehaviorEvent, BehaviorTrigger, PersonalizationDecision } from '../types';

interface RulesResponse {
  product: {
    id: string;
    name: string;
    defaultDescription: string;
  };
  rules: BehaviorTrigger[];
}

export interface PersonalizationResponse extends PersonalizationDecision {
  contentVariant: {
    productId: string;
    title: string;
    description: string;
  };
  safety: {
    risk: string;
    brandFit: string;
    status: string;
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getRules() {
  return requestJson<RulesResponse>('/api/rules');
}

export function getEvents() {
  return requestJson<{ events: BehaviorEvent[] }>('/api/events');
}

export function trackEvent(event: BehaviorEvent) {
  return requestJson<{ event: BehaviorEvent }>('/api/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export function getPersonalization(productId: string, ruleId: string) {
  return requestJson<PersonalizationResponse>(
    `/api/personalization?productId=${encodeURIComponent(productId)}&ruleId=${encodeURIComponent(ruleId)}`,
  );
}

export function updateRuleStatus(ruleId: string, status: BehaviorTrigger['status']) {
  return requestJson<{ rule: BehaviorTrigger }>(`/api/rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
