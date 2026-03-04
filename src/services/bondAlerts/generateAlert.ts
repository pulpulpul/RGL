import type { BondAlert, DealerScore, DealerQuoteType, SpreadDirection } from './types';

// ─── Constant pools ─────────────────────────────────────────────────────────

const ISSUERS = [
  'Microsoft Corp', 'Apple Inc', 'Goldman Sachs', 'JPMorgan Chase',
  'Amazon.com Inc', 'Berkshire Hathaway', 'Google LLC', 'Meta Platforms',
  'Bank of America', 'Morgan Stanley', 'Citigroup', 'Wells Fargo',
  'Johnson & Johnson', 'Pfizer Inc', 'UnitedHealth', 'Visa Inc',
  'Procter & Gamble', 'Chevron Corp', 'ExxonMobil', 'AT&T Inc',
];

const DEALERS = [
  'JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'Citi',
  'BofA Securities', 'Barclays', 'UBS', 'Deutsche Bank',
  'HSBC', 'Wells Fargo',
];

const RATINGS = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB'];
const COUPONS = [2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.65, 4.85, 5.0, 5.25, 5.3, 5.5];
const MATURITIES = [2027, 2028, 2029, 2030, 2031, 2033, 2034, 2037, 2042, 2044, 2053];
const QUOTE_TYPES: DealerQuoteType[] = ['TWO-WAY', 'BID', 'OFFER'];
const RESPONSE_TIMES = ['<1 min', '1-3 min', '3-5 min', '5-10 min', '10-15 min'];
const VOLUMES = ['$5M', '$8M', '$10M', '$12M', '$15M', '$20M', '$25M', '$50M'];

// ─── Helpers ────────────────────────────────────────────────────────────────

let alertCounter = 0;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDealers(): DealerScore[] {
  const shuffled = [...DEALERS].sort(() => Math.random() - 0.5);
  const count = randInt(4, 6);
  const selected = shuffled.slice(0, count);

  return selected
    .map((name, i) => {
      const score = Math.max(3, 10 - i - randInt(0, 1));
      return {
        rank: i + 1,
        name,
        quoteType: pick(QUOTE_TYPES),
        responseTime: pick(RESPONSE_TIMES),
        volume: pick(VOLUMES),
        hitRate: randInt(65, 95),
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((d, i) => ({ ...d, rank: i + 1 }));
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function generateRandomAlert(agentId: string): BondAlert {
  const direction: SpreadDirection = Math.random() > 0.45 ? 'wider' : 'tighter';
  const spreadChangeBps = randInt(3, 20) * (direction === 'wider' ? 1 : -1);
  const spreadFrom = randInt(60, 180);
  const spreadTo = spreadFrom + spreadChangeBps;
  const dealers = generateDealers();
  const best = dealers[0];

  return {
    id: `alert-${Date.now()}-${++alertCounter}`,
    agentId,
    issuer: pick(ISSUERS),
    coupon: pick(COUPONS),
    maturity: pick(MATURITIES),
    rating: pick(RATINGS),
    spreadFrom,
    spreadTo,
    spreadChangeBps,
    direction,
    bestDealer: best.name,
    bestDealerScore: `${best.score}/10`,
    bestDealerQuoteType: best.quoteType,
    dealers,
    timestamp: Date.now() - randInt(0, 5000),
    watched: Math.random() > 0.6,
  };
}

export function generateInitialAlerts(agentId: string, count: number): BondAlert[] {
  const alerts: BondAlert[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const alert = generateRandomAlert(agentId);
    // Stagger timestamps so initial batch looks historical
    alert.timestamp = now - (count - i) * randInt(15000, 90000);
    alerts.push(alert);
  }
  return alerts;
}
