import { memo, useCallback } from 'react';
import type { AgentData } from '../../store/dashboard/types';
import {
  CardContainer,
  CardDot,
  CardInfo,
  CardName,
  CardDesc,
  CardMeta,
  AlertBadge,
  CardActions,
  ActionBtn,
  DashboardBtn,
} from './AgentManager.styled';

interface AgentCardProps {
  agent: AgentData;
  isOnDashboard: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToDashboard: (agent: AgentData) => void;
  onRemoveFromDashboard: (agentId: string) => void;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export const AgentCard = memo(function AgentCard({
  agent,
  isOnDashboard,
  onToggleStatus,
  onEdit,
  onDelete,
  onAddToDashboard,
  onRemoveFromDashboard,
  onClose,
}: AgentCardProps) {
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', 'agent');
      e.dataTransfer.setData('application/x-widget-agent', '');
      e.dataTransfer.setData(
        'application/x-agent-id',
        JSON.stringify({ id: agent.id, name: agent.name }),
      );
      e.dataTransfer.effectAllowed = 'copy';
      requestAnimationFrame(() => onClose());
    },
    [agent.id, agent.name, onClose],
  );

  const handleDashboardClick = useCallback(() => {
    if (isOnDashboard) {
      onRemoveFromDashboard(agent.id);
    } else {
      onAddToDashboard(agent);
    }
  }, [agent, isOnDashboard, onAddToDashboard, onRemoveFromDashboard]);

  return (
    <CardContainer draggable onDragStart={handleDragStart}>
      <CardDot $active={agent.status === 'active'} />
      <CardInfo>
        <CardName>{agent.name}</CardName>
        <CardDesc>{agent.instruction}</CardDesc>
        <CardMeta>
          <span>{formatDate(agent.updatedAt)}</span>
          <AlertBadge>{agent.alertCount} alerts</AlertBadge>
        </CardMeta>
      </CardInfo>
      <CardActions draggable={false} onDragStart={(e) => e.preventDefault()}>
        <DashboardBtn
          $onDashboard={isOnDashboard}
          onClick={(e) => { e.stopPropagation(); handleDashboardClick(); }}
          title={isOnDashboard ? 'Remove from dashboard' : 'Add to dashboard'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isOnDashboard ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </DashboardBtn>
        <ActionBtn
          onClick={(e) => { e.stopPropagation(); onToggleStatus(agent.id); }}
          title={agent.status === 'active' ? 'Stop agent' : 'Start agent'}
        >
          {agent.status === 'active' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </ActionBtn>
        <ActionBtn
          onClick={(e) => { e.stopPropagation(); onEdit(agent.id); }}
          title="Edit agent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </ActionBtn>
        <ActionBtn
          $danger
          onClick={(e) => { e.stopPropagation(); onDelete(agent.id); }}
          title="Delete agent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </ActionBtn>
      </CardActions>
    </CardContainer>
  );
});
