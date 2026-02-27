import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #1e1e38;

  &:last-child {
    border-bottom: none;
  }
`;

const Symbol = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`;

const Price = styled.span`
  font-size: 12px;
  color: #aaa;
  text-align: right;
`;

const Change = styled.span<{ $positive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$positive ? '#4ade80' : '#ef4444')};
  min-width: 50px;
  text-align: right;
`;

function parseMarketItem(item: string) {
  const parts = item.split(/\s+/);
  const change = parts[parts.length - 1] || '';
  const positive = change.startsWith('+');
  const symbol = parts[0] || item;
  const price = parts.slice(1, -1).join(' ');
  return { symbol, price, change, positive };
}

export const MarketWatch = memo(function MarketWatch({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) => {
        const parsed = parseMarketItem(item);
        return (
          <Row key={i}>
            <Symbol>{parsed.symbol}</Symbol>
            <Price>{parsed.price}</Price>
            <Change $positive={parsed.positive}>{parsed.change}</Change>
          </Row>
        );
      })}
    </Wrapper>
  );
});
