import { memo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/rootReducer';
import type { AgentData } from '../../store/dashboard/types';
import {
  addAgent,
  removeAgent,
  updateAgent,
} from '../../store/dashboard/actions';
import {
  selectAgentsList,
  selectActiveAgentCount,
  selectTotalAlerts,
} from '../../store/dashboard/selectors';
import {
  Overlay,
  Panel,
  PanelHeader,
  PanelTitle,
  CreateButton,
  BackButton,
  PanelBody,
} from './AgentManager.styled';
import { AgentSummaryRow } from './AgentSummaryRow';
import { AgentList } from './AgentList';
import { CreateAgentView } from './CreateAgentView';
import { EditAgentView } from './EditAgentView';

type View =
  | { screen: 'list' }
  | { screen: 'create' }
  | { screen: 'edit'; agentId: string };

interface AgentManagerProps {
  onClose: () => void;
  onAddToDashboard: (agent: AgentData) => void;
  onRemoveFromDashboard: (agentId: string) => void;
}

export const AgentManager = memo(function AgentManager({
  onClose,
  onAddToDashboard,
  onRemoveFromDashboard,
}: AgentManagerProps) {
  const dispatch = useDispatch();
  const agents = useSelector(selectAgentsList);
  const activeCount = useSelector(selectActiveAgentCount);
  const totalAlerts = useSelector(selectTotalAlerts);
  const widgets = useSelector((state: RootState) => state.widgets);

  const [view, setView] = useState<View>({ screen: 'list' });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isOnDashboard = useCallback(
    (agentId: string) =>
      Object.values(widgets).some((w) => w.settings?.agentId === agentId),
    [widgets],
  );

  const handleToggleStatus = useCallback(
    (id: string) => {
      const agent = agents.find((a) => a.id === id);
      if (!agent) return;
      const newStatus = agent.status === 'active' ? 'stopped' : 'active';
      dispatch(updateAgent(id, { status: newStatus }));
    },
    [agents, dispatch],
  );

  const handleEdit = useCallback((id: string) => {
    setView({ screen: 'edit', agentId: id });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(removeAgent(id));
    },
    [dispatch],
  );

  const handleCreateAgent = useCallback(
    (instruction: string) => {
      const now = new Date().toISOString();
      const agent: AgentData = {
        id: `agent-${Date.now()}`,
        name: instruction.length > 40
          ? instruction.slice(0, 40) + '...'
          : instruction,
        instruction,
        status: 'active',
        alertCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      dispatch(addAgent(agent));
    },
    [dispatch],
  );

  const handleUpdateAgent = useCallback(
    (id: string, instruction: string) => {
      dispatch(
        updateAgent(id, {
          instruction,
          updatedAt: new Date().toISOString(),
        }),
      );
      setView({ screen: 'list' });
    },
    [dispatch],
  );

  const handleBack = useCallback(() => {
    setView({ screen: 'list' });
  }, []);

  const handleCreate = useCallback(() => {
    setView({ screen: 'create' });
  }, []);

  const editAgent =
    view.screen === 'edit'
      ? agents.find((a) => a.id === view.agentId)
      : undefined;

  return (
    <>
      <Overlay onClick={onClose} />
      <Panel>
        <PanelHeader>
          {view.screen === 'list' ? (
            <>
              <PanelTitle>Agent Manager</PanelTitle>
              <CreateButton onClick={handleCreate}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Agent
              </CreateButton>
            </>
          ) : (
            <>
              <BackButton onClick={handleBack}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </BackButton>
              <PanelTitle>
                {view.screen === 'create' ? 'New Agent' : 'Edit Agent'}
              </PanelTitle>
            </>
          )}
        </PanelHeader>

        {view.screen === 'list' && (
          <>
            <AgentSummaryRow
              total={agents.length}
              active={activeCount}
              alerts={totalAlerts}
            />
            <PanelBody>
              <AgentList
                agents={agents}
                isOnDashboard={isOnDashboard}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToDashboard={onAddToDashboard}
                onRemoveFromDashboard={onRemoveFromDashboard}
                onClose={onClose}
              />
            </PanelBody>
          </>
        )}

        {view.screen === 'create' && (
          <CreateAgentView onCreateAgent={handleCreateAgent} />
        )}

        {view.screen === 'edit' && editAgent && (
          <EditAgentView
            agent={editAgent}
            onUpdateAgent={handleUpdateAgent}
          />
        )}
      </Panel>
    </>
  );
});
