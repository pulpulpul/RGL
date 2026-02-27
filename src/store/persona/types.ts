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

export const TOGGLE_PERSONA_ITEM = 'TOGGLE_PERSONA_ITEM' as const;
export const SET_ALL_PERSONA = 'SET_ALL_PERSONA' as const;
export const CLEAR_ALL_PERSONA = 'CLEAR_ALL_PERSONA' as const;
export const SET_PERSONA = 'SET_PERSONA' as const;

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

export type PersonaActionTypes =
  | TogglePersonaItemAction
  | SetAllPersonaAction
  | ClearAllPersonaAction
  | SetPersonaAction;
