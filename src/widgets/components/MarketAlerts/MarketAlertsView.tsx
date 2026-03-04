import { memo } from 'react';
import type { AgentData } from '../../../store/dashboard/types';
import { useBondAlerts } from '../../../hooks/useBondAlerts';
import { AlertHeader } from './AlertHeader';
import { BondAlertCard } from './BondAlertCard';
import { AlertListContainer } from './MarketAlerts.styled';

interface MarketAlertsViewProps {
  agentId: string;
  agent: AgentData;
}

export const MarketAlertsView = memo(function MarketAlertsView({
  agentId,
  agent,
}: MarketAlertsViewProps) {
  const isActive = agent.status === 'active';
  const { alerts, filter, setFilter, counts, expandedId, toggleExpanded } =
    useBondAlerts(agentId, isActive);

  return (
    <>
      <AlertHeader
        instruction={agent.instruction}
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />
      <AlertListContainer>
        {alerts.map((alert) => (
          <BondAlertCard
            key={alert.id}
            alert={alert}
            isExpanded={expandedId === alert.id}
            onToggle={toggleExpanded}
          />
        ))}
      </AlertListContainer>
    </>
  );
});
