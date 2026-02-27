import type { WidgetData, WidgetsState } from '../store/widgets/types';
import type { WidgetType } from '../widgets/types';
import { WIDGET_REGISTRY } from '../widgets/registry';

interface DefaultWidgetInstance {
  id: string;
  widgetType: WidgetType;
}

export const DEFAULT_WIDGET_INSTANCES: DefaultWidgetInstance[] = [
  { id: 'portfolio-overview-1', widgetType: 'portfolio-overview' },
  { id: 'market-watch-1', widgetType: 'market-watch' },
  { id: 'alert-1', widgetType: 'alert' },
  { id: 'chat-1', widgetType: 'chat' },
  { id: 'agent-1', widgetType: 'agent' },
  { id: 'news-feed-1', widgetType: 'news-feed' },
];

const MOCK_TABS_BY_TYPE: Record<WidgetType, WidgetData['tabs']> = {
  'portfolio-overview': [
    {
      label: 'Summary',
      content: 'Total portfolio value and allocation breakdown.',
      items: ['BTC: $42,150 (35%)', 'ETH: $18,200 (15%)', 'SOL: $12,800 (11%)', 'USDT: $47,000 (39%)'],
    },
    {
      label: 'History',
      content: 'Recent portfolio changes.',
      items: ['+2.4% today', '-0.8% this week', '+12.1% this month'],
    },
  ],
  'market-watch': [
    {
      label: 'Favorites',
      content: 'Tracked assets.',
      items: ['BTC/USD 42,150.00 +1.2%', 'ETH/USD 2,280.50 -0.3%', 'SOL/USD 98.40 +5.1%'],
    },
    {
      label: 'Gainers',
      content: 'Top gainers today.',
      items: ['PEPE +18.4%', 'ARB +12.1%', 'INJ +9.7%'],
    },
    {
      label: 'Losers',
      content: 'Top losers today.',
      items: ['DOGE -4.2%', 'SHIB -3.8%', 'ADA -2.1%'],
    },
  ],
  'recent-trades': [
    {
      label: 'My Trades',
      content: 'Your recent trade history.',
      items: ['BUY 0.5 BTC @ 41,800', 'SELL 2.0 ETH @ 2,310', 'BUY 100 SOL @ 95.20'],
    },
    {
      label: 'Open Orders',
      content: 'Currently open orders.',
      items: ['LIMIT BUY BTC @ 40,000', 'LIMIT SELL ETH @ 2,500'],
    },
  ],
  'order-book': [
    {
      label: 'BTC/USD',
      content: 'Live order book for BTC/USD.',
      items: ['ASK 42,200 (1.2)', 'ASK 42,180 (0.8)', 'ASK 42,160 (2.5)', '--- SPREAD 10 ---', 'BID 42,150 (3.1)', 'BID 42,130 (1.5)', 'BID 42,100 (4.2)'],
    },
    {
      label: 'ETH/USD',
      content: 'Live order book for ETH/USD.',
      items: ['ASK 2,285 (12)', 'ASK 2,283 (8)', 'ASK 2,281 (25)', '--- SPREAD 1 ---', 'BID 2,280 (18)', 'BID 2,278 (10)', 'BID 2,275 (30)'],
    },
  ],
  'performance-chart': [
    {
      label: '1D',
      content: 'Daily performance.',
      items: ['Open: $41,800', 'High: $42,400', 'Low: $41,600', 'Current: $42,150', 'Volume: $1.2B'],
    },
    {
      label: '1W',
      content: 'Weekly performance.',
      items: ['Start: $42,500', 'High: $43,100', 'Low: $41,200', 'Current: $42,150', 'Change: -0.8%'],
    },
    {
      label: '1M',
      content: 'Monthly performance.',
      items: ['Start: $37,600', 'High: $43,100', 'Low: $36,800', 'Current: $42,150', 'Change: +12.1%'],
    },
  ],
  'news-feed': [
    {
      label: 'Latest',
      content: 'Breaking news.',
      items: ['Bitcoin ETF inflows hit $500M daily record', 'Ethereum Dencun upgrade goes live', 'SEC delays decision on Solana ETF'],
    },
    {
      label: 'Trending',
      content: 'Most discussed topics.',
      items: ['#Bitcoin halving countdown', '#DeFi summer 2.0', '#Layer2 scaling wars'],
    },
  ],
  alert: [
    {
      label: 'Active',
      content: 'Currently triggered alerts.',
      items: ['BTC > $42,000 — triggered 2m ago', 'ETH gas < 20 gwei — triggered 15m ago', 'SOL +5% in 1h — triggered 8m ago'],
    },
    {
      label: 'History',
      content: 'Past alert triggers.',
      items: ['BTC < $40,000 — 2 days ago', 'Portfolio -3% daily — 5 days ago', 'ETH > $2,500 — 1 week ago'],
    },
  ],
  chat: [
    {
      label: 'General',
      content: 'General discussion channel.',
      items: ['alice: anyone watching BTC?', 'bob: looks bullish to me', 'charlie: volume is crazy today', 'dave: careful with leverage'],
    },
    {
      label: 'Trading',
      content: 'Trading signals and discussion.',
      items: ['signal_bot: BUY BTC 42,100 TP 43,500 SL 41,000', 'trader1: took the long, lets go', 'analyst: RSI showing overbought on 4H'],
    },
  ],
  agent: [
    {
      label: 'Status',
      content: 'Agent runtime status.',
      items: ['Status: Running', 'Uptime: 4h 23m', 'Trades executed: 12', 'P&L: +$340.50', 'Strategy: Grid Bot'],
    },
    {
      label: 'Logs',
      content: 'Recent agent activity.',
      items: ['14:23 — Opened long BTC @ 42,100', '14:18 — Closed short ETH @ 2,278 (+$45)', '14:05 — Grid level hit, placed order'],
    },
    {
      label: 'Config',
      content: 'Agent configuration.',
      items: ['Pair: BTC/USD', 'Grid range: 40,000–44,000', 'Grid levels: 20', 'Order size: 0.01 BTC', 'Take profit: 1.5%'],
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
