import type { RootState } from '../rootReducer';
import type { AgentData } from './types';

export const selectAgents = (state: RootState) => state.agents;

export const selectAgentsList = (state: RootState): AgentData[] =>
  Object.values(state.agents);

export const selectAgentById = (state: RootState, id: string): AgentData | undefined =>
  state.agents[id];

export const selectActiveAgentCount = (state: RootState): number =>
  Object.values(state.agents).filter((a) => a.status === 'active').length;

export const selectTotalAlerts = (state: RootState): number =>
  Object.values(state.agents).reduce((sum, a) => sum + a.alertCount, 0);

export const selectIsAgentOnDashboard = (state: RootState, agentId: string): boolean =>
  Object.values(state.widgets).some((w) => w.settings?.agentId === agentId);
