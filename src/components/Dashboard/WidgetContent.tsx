import { memo } from 'react';
import styled from 'styled-components';
import type { TabData } from '../../store/widgets/types';
import type { WidgetType } from '../../widgets/types';

interface WidgetContentProps {
  tab: TabData;
  widgetType: WidgetType;
}

const ContentWrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
`;

const Description = styled.p`
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  padding: 6px 0;
  font-size: 12px;
  color: #ccc;
  border-bottom: 1px solid #2a2a3e;

  &:last-child {
    border-bottom: none;
  }
`;

export const WidgetContent = memo(function WidgetContent({
  tab,
}: WidgetContentProps) {
  return (
    <ContentWrapper>
      <Description>{tab.content}</Description>
      <ItemList>
        {tab.items.map((item, i) => (
          <Item key={i}>{item}</Item>
        ))}
      </ItemList>
    </ContentWrapper>
  );
});
