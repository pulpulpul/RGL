import { memo } from 'react';
import type { AgentData } from '../../store/dashboard/types';
import { AgentCard } from './AgentCard';
import { EmptyState } from './AgentManager.styled';

interface AgentListProps {
  agents: AgentData[];
  isOnDashboard: (agentId: string) => boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToDashboard: (agent: AgentData) => void;
  onRemoveFromDashboard: (agentId: string) => void;
  onClose: () => void;
}

export const AgentList = memo(function AgentList({
  agents,
  isOnDashboard,
  onToggleStatus,
  onEdit,
  onDelete,
  onAddToDashboard,
  onRemoveFromDashboard,
  onClose,
}: AgentListProps) {
  if (agents.length === 0) {
    return <EmptyState>No agents yet. Create one to get started.</EmptyState>;
  }

  return (
    <>
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isOnDashboard={isOnDashboard(agent.id)}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddToDashboard={onAddToDashboard}
          onRemoveFromDashboard={onRemoveFromDashboard}
          onClose={onClose}
        />
      ))}
    </>
  );
});
