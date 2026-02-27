import type { ComponentType } from 'react';
import type { WidgetType } from '../types';
import type { WidgetTypeProps } from './types';
import { PortfolioOverview } from './PortfolioOverview';
import { MarketWatch } from './MarketWatch';
import { RecentTrades } from './RecentTrades';
import { OrderBook } from './OrderBook';
import { PerformanceChart } from './PerformanceChart';
import { NewsFeed } from './NewsFeed';
import { AlertWidget } from './AlertWidget';
import { ChatWidget } from './ChatWidget';
import { AgentWidget } from './AgentWidget';

export const WIDGET_COMPONENTS: Record<WidgetType, ComponentType<WidgetTypeProps>> = {
  'portfolio-overview': PortfolioOverview,
  'market-watch': MarketWatch,
  'recent-trades': RecentTrades,
  'order-book': OrderBook,
  'performance-chart': PerformanceChart,
  'news-feed': NewsFeed,
  alert: AlertWidget,
  chat: ChatWidget,
  agent: AgentWidget,
};
