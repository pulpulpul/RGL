import {
  SET_WIDGETS_DATA,
  UPDATE_WIDGET_DATA,
  ADD_WIDGET,
  REMOVE_WIDGET,
  TOGGLE_PERSONA_ITEM,
  SET_ALL_PERSONA,
  CLEAR_ALL_PERSONA,
  SET_PERSONA,
} from './types';
import type {
  WidgetsState,
  WidgetData,
  PersonaCategory,
  PersonaState,
  DashboardActionTypes,
} from './types';

// ─── Widget actions ──────────────────────────────────────────────────────────

export const setWidgetsData = (data: WidgetsState): DashboardActionTypes => ({
  type: SET_WIDGETS_DATA,
  payload: data,
});

export const updateWidgetData = (
  id: string,
  data: Partial<WidgetData>,
): DashboardActionTypes => ({
  type: UPDATE_WIDGET_DATA,
  payload: { id, data },
});

export const addWidget = (widget: WidgetData): DashboardActionTypes => ({
  type: ADD_WIDGET,
  payload: widget,
});

export const removeWidget = (id: string): DashboardActionTypes => ({
  type: REMOVE_WIDGET,
  payload: id,
});

// ─── Persona actions ─────────────────────────────────────────────────────────

export const togglePersonaItem = (
  category: PersonaCategory,
  value: string,
): DashboardActionTypes => ({
  type: TOGGLE_PERSONA_ITEM,
  payload: { category, value },
});

export const setAllPersona = (
  category: PersonaCategory,
  values: string[],
): DashboardActionTypes => ({
  type: SET_ALL_PERSONA,
  payload: { category, values },
});

export const clearAllPersona = (
  category: PersonaCategory,
): DashboardActionTypes => ({
  type: CLEAR_ALL_PERSONA,
  payload: { category },
});

export const setPersona = (state: PersonaState): DashboardActionTypes => ({
  type: SET_PERSONA,
  payload: state,
});
