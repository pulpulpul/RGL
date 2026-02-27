import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
`;

const Row = styled.div<{ $side?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
  background: ${(p) =>
    p.$side === 'BUY'
      ? 'rgba(74, 222, 128, 0.06)'
      : p.$side === 'SELL'
        ? 'rgba(239, 68, 68, 0.06)'
        : 'transparent'};
`;

const Side = styled.span<{ $buy: boolean }>`
  font-size: 10px;
  font-weight: 700;
  color: ${(p) => (p.$buy ? '#4ade80' : '#ef4444')};
  min-width: 30px;
`;

const Detail = styled.span`
  font-size: 12px;
  color: #ccc;
  flex: 1;
`;

function parseTrade(item: string) {
  const match = item.match(/^(BUY|SELL|LIMIT\s+BUY|LIMIT\s+SELL)\s+(.+)$/i);
  if (!match) return { side: '', detail: item, isBuy: false };
  const side = match[1].toUpperCase();
  return { side, detail: match[2], isBuy: side.includes('BUY') };
}

export const RecentTrades = memo(function RecentTrades({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) => {
        const parsed = parseTrade(item);
        return (
          <Row key={i} $side={parsed.side.includes('BUY') ? 'BUY' : parsed.side.includes('SELL') ? 'SELL' : undefined}>
            {parsed.side && <Side $buy={parsed.isBuy}>{parsed.side}</Side>}
            <Detail>{parsed.detail || item}</Detail>
          </Row>
        );
      })}
    </Wrapper>
  );
});
