import type { WidgetType } from '../../widgets/types';

export const SET_WIDGETS_DATA = 'SET_WIDGETS_DATA';
export const UPDATE_WIDGET_DATA = 'UPDATE_WIDGET_DATA';
export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';

export interface TabData {
  label: string;
  content: string;
  items: string[];
}

export interface WidgetData {
  id: string;
  widgetType: WidgetType;
  title: string;
  tabs: TabData[];
  settings: Record<string, unknown>;
}

export type WidgetsState = Record<string, WidgetData>;

interface SetWidgetsDataAction {
  type: typeof SET_WIDGETS_DATA;
  payload: WidgetsState;
  [key: string]: unknown;
}

interface UpdateWidgetDataAction {
  type: typeof UPDATE_WIDGET_DATA;
  payload: { id: string; data: Partial<WidgetData> };
  [key: string]: unknown;
}

interface AddWidgetAction {
  type: typeof ADD_WIDGET;
  payload: WidgetData;
  [key: string]: unknown;
}

interface RemoveWidgetAction {
  type: typeof REMOVE_WIDGET;
  payload: string;
  [key: string]: unknown;
}

export type WidgetsActionTypes =
  | SetWidgetsDataAction
  | UpdateWidgetDataAction
  | AddWidgetAction
  | RemoveWidgetAction;
