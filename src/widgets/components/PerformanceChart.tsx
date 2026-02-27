import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 10px 12px;
  overflow-y: auto;
  flex: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const StatCard = styled.div<{ $highlight?: boolean }>`
  padding: 8px 10px;
  background: ${(p) => (p.$highlight ? 'rgba(100, 108, 255, 0.1)' : '#1a1a2e')};
  border-radius: 4px;
  border: 1px solid ${(p) => (p.$highlight ? 'rgba(100, 108, 255, 0.25)' : '#2a2a3e')};
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.$color || '#fff'};
`;

function parseStat(item: string) {
  const match = item.match(/^(.+?):\s*(.+)$/);
  if (!match) return { label: item, value: '' };
  return { label: match[1], value: match[2] };
}

function getValueColor(label: string, value: string): string | undefined {
  if (label.toLowerCase() === 'change') {
    return value.startsWith('+') ? '#4ade80' : value.startsWith('-') ? '#ef4444' : undefined;
  }
  return undefined;
}

function isHighlight(label: string): boolean {
  const l = label.toLowerCase();
  return l === 'current' || l === 'change';
}

export const PerformanceChart = memo(function PerformanceChart({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      <StatsGrid>
        {tab.items.map((item, i) => {
          const parsed = parseStat(item);
          return (
            <StatCard key={i} $highlight={isHighlight(parsed.label)}>
              <StatLabel>{parsed.label}</StatLabel>
              <StatValue $color={getValueColor(parsed.label, parsed.value)}>
                {parsed.value}
              </StatValue>
            </StatCard>
          );
        })}
      </StatsGrid>
    </Wrapper>
  );
});
