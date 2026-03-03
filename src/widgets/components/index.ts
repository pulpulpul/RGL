import type { ComponentType } from 'react';
import type { WidgetType } from '../types';
import type { WidgetTypeProps } from './types';
import { AlertWidget } from './AlertWidget';
import { ChatWidget } from './ChatWidget';
import { AgentWidget } from './AgentWidget';

export const WIDGET_COMPONENTS: Record<WidgetType, ComponentType<WidgetTypeProps>> = {
  alert: AlertWidget,
  chat: ChatWidget,
  agent: AgentWidget,
};
