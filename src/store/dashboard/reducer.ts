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
import type { DashboardState, PersonaState, DashboardActionTypes } from './types';

const PERSONA_STORAGE_KEY = 'now-persona';

function loadPersona(): PersonaState {
  try {
    const stored = localStorage.getItem(PERSONA_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PersonaState;
  } catch {
    // ignore
  }
  return { sectors: [], creditRatings: [], tenorPreferences: [] };
}

function persistPersona(state: PersonaState) {
  localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(state));
}

const initialState: DashboardState = {
  widgets: {},
  persona: loadPersona(),
};

export const dashboardReducer = (
  state = initialState,
  action: DashboardActionTypes,
): DashboardState => {
  switch (action.type) {
    // ── Widgets ────────────────────────────────────────────────────────────
    case SET_WIDGETS_DATA:
      return { ...state, widgets: action.payload };

    case UPDATE_WIDGET_DATA: {
      const { id, data } = action.payload;
      const existing = state.widgets[id];
      if (!existing) return state;
      return {
        ...state,
        widgets: { ...state.widgets, [id]: { ...existing, ...data } },
      };
    }

    case ADD_WIDGET:
      return {
        ...state,
        widgets: { ...state.widgets, [action.payload.id]: action.payload },
      };

    case REMOVE_WIDGET: {
      const next = { ...state.widgets };
      delete next[action.payload];
      return { ...state, widgets: next };
    }

    // ── Persona ────────────────────────────────────────────────────────────
    case TOGGLE_PERSONA_ITEM: {
      const { category, value } = action.payload;
      const current = state.persona[category];
      const has = current.includes(value);
      const persona = {
        ...state.persona,
        [category]: has ? current.filter((v) => v !== value) : [...current, value],
      };
      persistPersona(persona);
      return { ...state, persona };
    }

    case SET_ALL_PERSONA: {
      const { category, values } = action.payload;
      const persona = { ...state.persona, [category]: values };
      persistPersona(persona);
      return { ...state, persona };
    }

    case CLEAR_ALL_PERSONA: {
      const { category } = action.payload;
      const persona = { ...state.persona, [category]: [] };
      persistPersona(persona);
      return { ...state, persona };
    }

    case SET_PERSONA:
      persistPersona(action.payload);
      return { ...state, persona: action.payload };

    default:
      return state;
  }
};
