import { TOGGLE_PERSONA_ITEM, SET_ALL_PERSONA, CLEAR_ALL_PERSONA, SET_PERSONA } from './types';
import type { PersonaState, PersonaActionTypes } from './types';

const STORAGE_KEY = 'now-persona';

function loadFromStorage(): PersonaState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PersonaState;
  } catch {
    // ignore
  }
  return null;
}

function persist(state: PersonaState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const initialState: PersonaState = loadFromStorage() ?? {
  sectors: [],
  creditRatings: [],
  tenorPreferences: [],
};

export const personaReducer = (
  state = initialState,
  action: PersonaActionTypes,
): PersonaState => {
  let next: PersonaState;

  switch (action.type) {
    case TOGGLE_PERSONA_ITEM: {
      const { category, value } = action.payload;
      const current = state[category];
      const has = current.includes(value);
      next = {
        ...state,
        [category]: has ? current.filter((v) => v !== value) : [...current, value],
      };
      break;
    }
    case SET_ALL_PERSONA: {
      const { category, values } = action.payload;
      next = { ...state, [category]: values };
      break;
    }
    case CLEAR_ALL_PERSONA: {
      const { category } = action.payload;
      next = { ...state, [category]: [] };
      break;
    }
    case SET_PERSONA:
      next = action.payload;
      break;
    default:
      return state;
  }

  persist(next);
  return next;
};
