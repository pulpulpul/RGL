import type { WidgetData, WidgetsState, AgentData, AgentsState } from '../store/dashboard/types';
import type { WidgetType } from '../widgets/types';
import { WIDGET_REGISTRY } from '../widgets/registry';

interface DefaultWidgetInstance {
  id: string;
  widgetType: WidgetType;
}

export const DEFAULT_WIDGET_INSTANCES: DefaultWidgetInstance[] = [
  { id: 'alert-1', widgetType: 'alert' },
];

const MOCK_TABS_BY_TYPE: Record<WidgetType, WidgetData['tabs']> = {
  alert: [
    {
      label: 'Alerts',
      content: 'Active and recent alerts across all agents.',
      items: [
        'AAPL 4.50% 2030 spread widened +15bps — triggered 3m ago',
        'New issue: MSFT 5.25% 2034 priced at T+85 — triggered 12m ago',
        'JPM 3.75% 2028 downgraded to A- by S&P — triggered 45m ago',
        'IG CDX spread breached 75bps threshold — triggered 1h ago',
        'TSLA 5.30% 2029 bid dropped 2pts — 3 hours ago',
        'Treasury 10Y yield crossed 4.50% — 5 hours ago',
        'GS 4.00% 2031 block trade $50M detected — yesterday',
        'Portfolio duration exceeded 6.2yr limit — 2 days ago',
      ],
    },
  ],
  chat: [
    {
      label: 'Chat',
      content: 'Trading desk discussion.',
      items: [
        'sarah: new MSFT deal looks tight, anyone bidding?',
        'mike: we lifted the 5yr at T+82, decent concession',
        'desk_bot: ALERT — IG primary pipeline $8.2B expected this week',
        'jenny: seeing heavy selling in HY energy names',
        'tom: JPM downgrade just hit, CDS widening fast',
        'sarah: swapping out of AAPL 30s into GOOGL 29s',
        'risk_monitor: portfolio DV01 at $42,300, within limits',
        'mike: anyone have a bid on $10M GS 4s of 31?',
      ],
    },
  ],
  agent: [
    {
      label: 'Status',
      content: 'Agent runtime status.',
      items: ['Status: Running', 'Uptime: 4h 23m', 'Bonds monitored: 128', 'Alerts sent: 24', 'Strategy: Spread Monitor'],
    },
    {
      label: 'Logs',
      content: 'Recent agent activity.',
      items: ['14:23 — New issue detected: MSFT 5.25% 2034', '14:18 — Spread alert: AAPL 4.50% 2030 +15bps', '14:05 — Rating change: JPM downgraded to A-'],
    },
    {
      label: 'Config',
      content: 'Agent configuration.',
      items: ['Universe: USD IG Corporate', 'Spread threshold: 10bps', 'Rating filter: A- and above', 'Sectors: Financials, Tech', 'Tenor: 2yr–10yr'],
    },
  ],
};

export function createWidgetData(id: string, widgetType: WidgetType): WidgetData {
  const config = WIDGET_REGISTRY[widgetType];
  return {
    id,
    widgetType,
    title: config.title,
    tabs: MOCK_TABS_BY_TYPE[widgetType],
    settings: { ...config.defaultSettings },
  };
}

export function buildDefaultWidgetsData(): WidgetsState {
  const state: WidgetsState = {};
  for (const instance of DEFAULT_WIDGET_INSTANCES) {
    state[instance.id] = createWidgetData(instance.id, instance.widgetType);
  }
  return state;
}

export const fetchMockWidgetsData = (): Promise<WidgetsState> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(buildDefaultWidgetsData()), 100);
  });

// ─── Mock Agents ──────────────────────────────────────────────────────────────

const MOCK_AGENTS: AgentData[] = [
  {
    id: 'agent-1001',
    name: 'IG New Issues Monitor',
    instruction: 'Monitor all new USD investment-grade corporate bond issues. Alert when concession exceeds 10bps or deal is upsized. Focus on A-rated and above issuers in Technology and Financials sectors.',
    status: 'active',
    alertCount: 245,
    createdAt: '2025-12-10T08:00:00Z',
    updatedAt: '2026-02-28T14:23:00Z',
  },
  {
    id: 'agent-1002',
    name: 'Spread Widening Alert',
    instruction: 'Track OAS spread movements on my watchlist bonds. Alert when any position widens more than 10bps intraday or 25bps over 5 business days. Include CDX IG and HY index levels for context.',
    status: 'active',
    alertCount: 180,
    createdAt: '2025-12-15T10:30:00Z',
    updatedAt: '2026-02-27T09:15:00Z',
  },
  {
    id: 'agent-1003',
    name: 'Rating Change Detector',
    instruction: 'Monitor S&P, Moody\'s, and Fitch rating actions on all bonds in my portfolio. Alert on downgrades, negative outlook changes, and CreditWatch placements. Include fallen angel risk for BBB- names.',
    status: 'active',
    alertCount: 156,
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-02-26T18:45:00Z',
  },
  {
    id: 'agent-1004',
    name: 'EBITDA Coverage Screener',
    instruction: 'Screen new bond issues with EBITDA interest coverage ratio above 4x. Focus on 2yr–10yr maturities in investment-grade corporates. Flag any issuer with declining coverage trend over last 4 quarters.',
    status: 'stopped',
    alertCount: 144,
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-02-25T11:30:00Z',
  },
];

export function buildDefaultAgents(): AgentsState {
  const state: AgentsState = {};
  for (const agent of MOCK_AGENTS) {
    state[agent.id] = agent;
  }
  return state;
}

export function createAgentWidgetData(widgetId: string, agent: AgentData): WidgetData {
  return createWidgetData(widgetId, 'agent');
}
