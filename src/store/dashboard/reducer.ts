import {
  SET_WIDGETS_DATA,
  UPDATE_WIDGET_DATA,
  ADD_WIDGET,
  REMOVE_WIDGET,
  TOGGLE_PERSONA_ITEM,
  SET_ALL_PERSONA,
  CLEAR_ALL_PERSONA,
  SET_PERSONA,
  ADD_AGENT,
  UPDATE_AGENT,
  REMOVE_AGENT,
  SET_AGENT_STATUS,
  SET_AGENTS,
} from './types';
import type { DashboardState, PersonaState, AgentsState, DashboardActionTypes } from './types';

const PERSONA_STORAGE_KEY = 'now-persona';
const AGENTS_STORAGE_KEY = 'now-agents';

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

function loadAgents(): AgentsState {
  try {
    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AgentsState;
  } catch {
    // ignore
  }
  return {};
}

function persistAgents(state: AgentsState) {
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(state));
}

const initialState: DashboardState = {
  widgets: {},
  persona: loadPersona(),
  agents: loadAgents(),
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

    // ── Agents ─────────────────────────────────────────────────────────────
    case ADD_AGENT: {
      const agents = { ...state.agents, [action.payload.id]: action.payload };
      persistAgents(agents);
      return { ...state, agents };
    }

    case UPDATE_AGENT: {
      const { id, data } = action.payload;
      const existing = state.agents[id];
      if (!existing) return state;
      const agents = { ...state.agents, [id]: { ...existing, ...data } };
      persistAgents(agents);
      return { ...state, agents };
    }

    case REMOVE_AGENT: {
      const agents = { ...state.agents };
      delete agents[action.payload];
      // Also remove any dashboard widget linked to this agent
      const widgets = { ...state.widgets };
      for (const [wid, w] of Object.entries(widgets)) {
        if (w.settings?.agentId === action.payload) {
          delete widgets[wid];
        }
      }
      persistAgents(agents);
      return { ...state, agents, widgets };
    }

    case SET_AGENT_STATUS: {
      const { id, status } = action.payload;
      const agent = state.agents[id];
      if (!agent) return state;
      const agents = { ...state.agents, [id]: { ...agent, status } };
      persistAgents(agents);
      return { ...state, agents };
    }

    case SET_AGENTS:
      persistAgents(action.payload);
      return { ...state, agents: action.payload };

    default:
      return state;
  }
};
