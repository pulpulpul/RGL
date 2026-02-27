import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 10px 12px;
  overflow-y: auto;
  flex: 1;
`;

const SectionTitle = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

const Label = styled.span`
  font-size: 12px;
  color: #ccc;
`;

const Value = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`;

const Bar = styled.div<{ $pct: number; $color: string }>`
  height: 4px;
  border-radius: 2px;
  background: #2a2a3e;
  margin-top: 2px;
  margin-bottom: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: ${(p) => p.$color};
    border-radius: 2px;
  }
`;

const COLORS = ['#4ade80', '#60a5fa', '#a78bfa', '#f59e0b'];

function parseItem(item: string) {
  const match = item.match(/^(.+?):\s*(.+?)(?:\s*\((\d+)%\))?$/);
  if (!match) return { label: item, value: '', pct: 0 };
  return { label: match[1], value: match[2], pct: parseInt(match[3] || '0', 10) };
}

export const PortfolioOverview = memo(function PortfolioOverview({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      <SectionTitle>{tab.label}</SectionTitle>
      {tab.items.map((item, i) => {
        const parsed = parseItem(item);
        return (
          <div key={i}>
            <Row>
              <Label>{parsed.label}</Label>
              <Value>{parsed.value}</Value>
            </Row>
            {parsed.pct > 0 && <Bar $pct={parsed.pct} $color={COLORS[i % COLORS.length]} />}
          </div>
        );
      })}
    </Wrapper>
  );
});
