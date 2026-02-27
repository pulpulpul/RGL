import type { WidgetType } from '../../widgets/types';

// ─── Widget types ────────────────────────────────────────────────────────────

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

// ─── Persona types ───────────────────────────────────────────────────────────

export const SECTORS = [
  'Financials',
  'Technology',
  'Healthcare',
  'Energy',
  'Consumer',
  'Industrials',
  'Utilities',
  'Telecom',
] as const;

export const CREDIT_RATINGS = [
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
] as const;

export const TENOR_PREFERENCES = [
  'Less than 2 year',
  '2yr to 10Yr',
  '20 and 30 year',
] as const;

export type PersonaCategory = 'sectors' | 'creditRatings' | 'tenorPreferences';

export interface PersonaState {
  sectors: string[];
  creditRatings: string[];
  tenorPreferences: string[];
}

// ─── Combined state ──────────────────────────────────────────────────────────

export interface DashboardState {
  widgets: WidgetsState;
  persona: PersonaState;
}

// ─── Action constants ────────────────────────────────────────────────────────

export const SET_WIDGETS_DATA = 'SET_WIDGETS_DATA';
export const UPDATE_WIDGET_DATA = 'UPDATE_WIDGET_DATA';
export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';

export const TOGGLE_PERSONA_ITEM = 'TOGGLE_PERSONA_ITEM' as const;
export const SET_ALL_PERSONA = 'SET_ALL_PERSONA' as const;
export const CLEAR_ALL_PERSONA = 'CLEAR_ALL_PERSONA' as const;
export const SET_PERSONA = 'SET_PERSONA' as const;

// ─── Action interfaces ──────────────────────────────────────────────────────

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

interface TogglePersonaItemAction {
  type: typeof TOGGLE_PERSONA_ITEM;
  payload: { category: PersonaCategory; value: string };
  [key: string]: unknown;
}

interface SetAllPersonaAction {
  type: typeof SET_ALL_PERSONA;
  payload: { category: PersonaCategory; values: string[] };
  [key: string]: unknown;
}

interface ClearAllPersonaAction {
  type: typeof CLEAR_ALL_PERSONA;
  payload: { category: PersonaCategory };
  [key: string]: unknown;
}

interface SetPersonaAction {
  type: typeof SET_PERSONA;
  payload: PersonaState;
  [key: string]: unknown;
}

export type DashboardActionTypes =
  | SetWidgetsDataAction
  | UpdateWidgetDataAction
  | AddWidgetAction
  | RemoveWidgetAction
  | TogglePersonaItemAction
  | SetAllPersonaAction
  | ClearAllPersonaAction
  | SetPersonaAction;
