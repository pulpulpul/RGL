import { SET_WIDGETS_DATA, UPDATE_WIDGET_DATA, ADD_WIDGET, REMOVE_WIDGET } from './types';
import type { WidgetsState, WidgetData, WidgetsActionTypes } from './types';

export const setWidgetsData = (data: WidgetsState): WidgetsActionTypes => ({
  type: SET_WIDGETS_DATA,
  payload: data,
});

export const updateWidgetData = (
  id: string,
  data: Partial<WidgetData>,
): WidgetsActionTypes => ({
  type: UPDATE_WIDGET_DATA,
  payload: { id, data },
});

export const addWidget = (widget: WidgetData): WidgetsActionTypes => ({
  type: ADD_WIDGET,
  payload: widget,
});

export const removeWidget = (id: string): WidgetsActionTypes => ({
  type: REMOVE_WIDGET,
  payload: id,
});
