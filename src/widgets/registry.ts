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
  alert: {
    type: 'alert',
    title: 'All Alerts',
    allowMultiple: false,
    deletable: false,
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
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
