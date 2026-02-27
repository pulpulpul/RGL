import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
  font-size: 12px;
`;

const Row = styled.div<{ $type: 'ask' | 'bid' | 'spread' }>`
  display: flex;
  justify-content: space-between;
  padding: 3px 6px;
  border-radius: 2px;
  margin-bottom: 1px;
  background: ${(p) =>
    p.$type === 'ask'
      ? 'rgba(239, 68, 68, 0.08)'
      : p.$type === 'bid'
        ? 'rgba(74, 222, 128, 0.08)'
        : 'transparent'};
`;

const PriceCell = styled.span<{ $type: 'ask' | 'bid' | 'spread' }>`
  font-weight: 600;
  color: ${(p) =>
    p.$type === 'ask' ? '#ef4444' : p.$type === 'bid' ? '#4ade80' : '#555'};
`;

const SizeCell = styled.span`
  color: #888;
`;

const SpreadRow = styled.div`
  text-align: center;
  padding: 4px 0;
  font-size: 10px;
  color: #555;
  border-top: 1px solid #2a2a3e;
  border-bottom: 1px solid #2a2a3e;
  margin: 2px 0;
`;

function parseOrderRow(item: string): { type: 'ask' | 'bid' | 'spread'; price: string; size: string; raw: string } {
  const spreadMatch = item.match(/SPREAD\s+(\d+)/i);
  if (spreadMatch) return { type: 'spread', price: spreadMatch[1], size: '', raw: item };

  const match = item.match(/^(ASK|BID)\s+([\d,.]+)\s+\(([\d.]+)\)$/i);
  if (!match) return { type: 'spread', price: '', size: '', raw: item };
  return { type: match[1].toLowerCase() as 'ask' | 'bid', price: match[2], size: match[3], raw: item };
}

export const OrderBook = memo(function OrderBook({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) => {
        const parsed = parseOrderRow(item);
        if (parsed.type === 'spread') {
          return <SpreadRow key={i}>{parsed.raw}</SpreadRow>;
        }
        return (
          <Row key={i} $type={parsed.type}>
            <PriceCell $type={parsed.type}>{parsed.price}</PriceCell>
            <SizeCell>{parsed.size}</SizeCell>
          </Row>
        );
      })}
    </Wrapper>
  );
});
