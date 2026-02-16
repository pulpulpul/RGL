import { SET_WIDGETS_DATA, UPDATE_WIDGET_DATA, ADD_WIDGET, REMOVE_WIDGET } from './types';
import type { WidgetsState, WidgetsActionTypes } from './types';

const initialState: WidgetsState = {};

export const widgetsReducer = (
  state = initialState,
  action: WidgetsActionTypes,
): WidgetsState => {
  switch (action.type) {
    case SET_WIDGETS_DATA:
      return action.payload;
    case UPDATE_WIDGET_DATA: {
      const { id, data } = action.payload;
      const existing = state[id];
      if (!existing) return state;
      return {
        ...state,
        [id]: { ...existing, ...data },
      };
    }
    case ADD_WIDGET:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_WIDGET: {
      const next = { ...state };
      delete next[action.payload];
      return next;
    }
    default:
      return state;
  }
};
