import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
`;

const AlertRow = styled.div<{ $recent: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 8px;
  margin-bottom: 4px;
  background: ${(p) => (p.$recent ? 'rgba(239, 68, 68, 0.06)' : 'transparent')};
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Dot = styled.span<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? '#ef4444' : '#555')};
  flex-shrink: 0;
  margin-top: 5px;
`;

const Condition = styled.span`
  font-size: 12px;
  color: #ccc;
  flex: 1;
`;

const Time = styled.span`
  font-size: 10px;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
`;

function parseAlert(item: string) {
  const parts = item.split(' — ');
  const condition = parts[0] || item;
  const time = parts[1] || '';
  const recent = time.includes('ago');
  return { condition, time, recent };
}

export const AlertWidget = memo(function AlertWidget({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) => {
        const parsed = parseAlert(item);
        return (
          <AlertRow key={i} $recent={parsed.recent}>
            <Dot $active={parsed.recent} />
            <Condition>{parsed.condition}</Condition>
            {parsed.time && <Time>{parsed.time}</Time>}
          </AlertRow>
        );
      })}
    </Wrapper>
  );
});
