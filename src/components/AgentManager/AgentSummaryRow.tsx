import { memo } from 'react';
import { SummaryContainer, SummaryItem } from './AgentManager.styled';

interface AgentSummaryRowProps {
  total: number;
  active: number;
  alerts: number;
}

export const AgentSummaryRow = memo(function AgentSummaryRow({
  total,
  active,
  alerts,
}: AgentSummaryRowProps) {
  return (
    <SummaryContainer>
      <SummaryItem>
        <strong>{total}</strong> agents
      </SummaryItem>
      <SummaryItem>
        <strong>{active}</strong> active
      </SummaryItem>
      <SummaryItem>
        <strong>{alerts}</strong> total alerts
      </SummaryItem>
    </SummaryContainer>
  );
});
