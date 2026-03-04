// ─── Agent type system ──────────────────────────────────────────────────────
export type AgentType = 'market-alerts' | 'generic';

// ─── Bond alert domain types ────────────────────────────────────────────────
export type SpreadDirection = 'wider' | 'tighter';
export type DealerQuoteType = 'TWO-WAY' | 'BID' | 'OFFER';
export type AlertFilter = 'all' | 'wider' | 'tighter' | 'watched';

export interface DealerScore {
  rank: number;
  name: string;
  quoteType: DealerQuoteType;
  responseTime: string;
  volume: string;
  hitRate: number;
  score: number;
}

export interface BondAlert {
  id: string;
  agentId: string;
  issuer: string;
  coupon: number;
  maturity: number;
  rating: string;
  spreadFrom: number;
  spreadTo: number;
  spreadChangeBps: number;
  direction: SpreadDirection;
  bestDealer: string;
  bestDealerScore: string;
  bestDealerQuoteType: DealerQuoteType;
  dealers: DealerScore[];
  timestamp: number;
  watched: boolean;
}
