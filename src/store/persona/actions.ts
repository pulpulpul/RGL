import type { PersonaCategory, PersonaState, PersonaActionTypes } from './types';
import { TOGGLE_PERSONA_ITEM, SET_ALL_PERSONA, CLEAR_ALL_PERSONA, SET_PERSONA } from './types';

export const togglePersonaItem = (
  category: PersonaCategory,
  value: string,
): PersonaActionTypes => ({
  type: TOGGLE_PERSONA_ITEM,
  payload: { category, value },
});

export const setAllPersona = (
  category: PersonaCategory,
  values: string[],
): PersonaActionTypes => ({
  type: SET_ALL_PERSONA,
  payload: { category, values },
});

export const clearAllPersona = (
  category: PersonaCategory,
): PersonaActionTypes => ({
  type: CLEAR_ALL_PERSONA,
  payload: { category },
});

export const setPersona = (state: PersonaState): PersonaActionTypes => ({
  type: SET_PERSONA,
  payload: state,
});
