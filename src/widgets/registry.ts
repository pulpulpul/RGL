import type { WidgetType } from './types';

export interface WidgetTypeConfig {
  type: WidgetType;
  title: string;
  allowMultiple: boolean;
  deletable: boolean;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  defaultSettings: Record<string, unknown>;
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetTypeConfig> = {
  'portfolio-overview': {
    type: 'portfolio-overview',
    title: 'Portfolio Overview',
    allowMultiple: false,
    deletable: false,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
    defaultSettings: {},
  },
  'market-watch': {
    type: 'market-watch',
    title: 'Market Watch',
    allowMultiple: false,
    deletable: false,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 3 },
    defaultSettings: {},
  },
  'recent-trades': {
    type: 'recent-trades',
    title: 'Recent Trades',
    allowMultiple: true,
    deletable: true,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 3 },
    defaultSettings: { pair: 'BTC/USD' },
  },
  'order-book': {
    type: 'order-book',
    title: 'Order Book',
    allowMultiple: true,
    deletable: true,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 2, h: 4 },
    defaultSettings: { pair: 'BTC/USD', depth: 10 },
  },
  'performance-chart': {
    type: 'performance-chart',
    title: 'Performance Chart',
    allowMultiple: false,
    deletable: true,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
    defaultSettings: { interval: '1D' },
  },
  'news-feed': {
    type: 'news-feed',
    title: 'News Feed',
    allowMultiple: false,
    deletable: true,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 2, h: 3 },
    defaultSettings: {},
  },
  alert: {
    type: 'alert',
    title: 'Alerts',
    allowMultiple: true,
    deletable: true,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 2, h: 2 },
    defaultSettings: { severity: 'all' },
  },
  chat: {
    type: 'chat',
    title: 'Chat',
    allowMultiple: true,
    deletable: true,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
    defaultSettings: { channel: 'general' },
  },
  agent: {
    type: 'agent',
    title: 'Agent',
    allowMultiple: true,
    deletable: true,
    defaultSize: { w: 6, h: 6 },
    minSize: { w: 4, h: 4 },
    defaultSettings: { agentId: null, autoRestart: false },
  },
};

export function getWidgetConfig(type: WidgetType): WidgetTypeConfig {
  return WIDGET_REGISTRY[type];
}
