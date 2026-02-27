import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
`;

const Card = styled.div`
  padding: 8px 10px;
  margin-bottom: 6px;
  background: #1a1a2e;
  border-radius: 4px;
  border-left: 3px solid #38bdf8;
  cursor: default;
  transition: background 0.15s;

  &:hover {
    background: #1e1e38;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Headline = styled.div`
  font-size: 12px;
  color: #ddd;
  line-height: 1.4;
`;

const Tag = styled.div`
  padding: 6px 10px;
  margin-bottom: 6px;
  background: rgba(56, 189, 248, 0.08);
  border-radius: 4px;
  font-size: 12px;
  color: #38bdf8;
  font-weight: 600;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const NewsFeed = memo(function NewsFeed({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) =>
        item.startsWith('#') ? (
          <Tag key={i}>{item}</Tag>
        ) : (
          <Card key={i}>
            <Headline>{item}</Headline>
          </Card>
        ),
      )}
    </Wrapper>
  );
});
