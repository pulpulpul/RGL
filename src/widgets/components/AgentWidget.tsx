import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 10px 12px;
  overflow-y: auto;
  flex: 1;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const MetricCard = styled.div<{ $accent?: string }>`
  padding: 8px 10px;
  background: #1a1a2e;
  border-radius: 4px;
  border-left: 3px solid ${(p) => p.$accent || '#2a2a3e'};
`;

const MetricLabel = styled.div`
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const MetricValue = styled.div<{ $color?: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.$color || '#fff'};
`;

const LogRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #1e1e38;
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

const LogTime = styled.span`
  color: #555;
  flex-shrink: 0;
  font-size: 11px;
`;

const LogText = styled.span`
  color: #ccc;
  flex: 1;
`;

function getMetricAccent(label: string): string {
  const l = label.toLowerCase();
  if (l === 'status') return '#4ade80';
  if (l === 'p&l') return '#f59e0b';
  if (l === 'strategy') return '#a78bfa';
  return '#2a2a3e';
}

function getMetricColor(label: string, value: string): string | undefined {
  if (label.toLowerCase() === 'status' && value.toLowerCase() === 'running') return '#4ade80';
  if (label.toLowerCase() === 'p&l') return value.startsWith('+') ? '#4ade80' : value.startsWith('-') ? '#ef4444' : undefined;
  return undefined;
}

function isLogFormat(item: string): boolean {
  return /^\d{1,2}:\d{2}/.test(item);
}

function parseMetric(item: string) {
  const match = item.match(/^(.+?):\s*(.+)$/);
  if (!match) return { label: item, value: '' };
  return { label: match[1], value: match[2] };
}

function parseLog(item: string) {
  const match = item.match(/^(\d{1,2}:\d{2})\s*—\s*(.+)$/);
  if (!match) return { time: '', text: item };
  return { time: match[1], text: match[2] };
}

export const AgentWidget = memo(function AgentWidget({ tab }: WidgetTypeProps) {
  const hasLogs = tab.items.some(isLogFormat);

  if (hasLogs) {
    return (
      <Wrapper>
        {tab.items.map((item, i) => {
          const parsed = parseLog(item);
          return (
            <LogRow key={i}>
              {parsed.time && <LogTime>{parsed.time}</LogTime>}
              <LogText>{parsed.text}</LogText>
            </LogRow>
          );
        })}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <MetricGrid>
        {tab.items.map((item, i) => {
          const parsed = parseMetric(item);
          return (
            <MetricCard key={i} $accent={getMetricAccent(parsed.label)}>
              <MetricLabel>{parsed.label}</MetricLabel>
              <MetricValue $color={getMetricColor(parsed.label, parsed.value)}>
                {parsed.value}
              </MetricValue>
            </MetricCard>
          );
        })}
      </MetricGrid>
    </Wrapper>
  );
});
