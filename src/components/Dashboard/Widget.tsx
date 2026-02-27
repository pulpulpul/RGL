import { memo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../store/rootReducer';
import type { WidgetType } from '../../widgets/types';
import { WIDGET_REGISTRY } from '../../widgets/registry';
import { WIDGET_COMPONENTS } from '../../widgets/components';

interface WidgetProps {
  widgetId: string;
  onDelete: (widgetId: string) => void;
}

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #16162a;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  overflow: hidden;
  contain: strict;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a3e;
  cursor: grab;
  flex-shrink: 0;
  user-select: none;
`;

const TitleText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const TYPE_COLORS: Record<WidgetType, string> = {
  'portfolio-overview': '#4ade80',
  'market-watch': '#60a5fa',
  'recent-trades': '#f59e0b',
  'order-book': '#a78bfa',
  'performance-chart': '#f472b6',
  'news-feed': '#38bdf8',
  alert: '#ef4444',
  chat: '#34d399',
  agent: '#fb923c',
};

const TypeBadge = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  margin-right: 8px;
  flex-shrink: 0;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #2a2a3e;
  flex-shrink: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  font-size: 11px;
  background: ${(p) => (p.$active ? '#1e1e38' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#666')};
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? '#646cff' : 'transparent')};
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #aaa;
  }
`;

export const Widget = memo(function Widget({ widgetId, onDelete }: WidgetProps) {
  const widget = useSelector((state: RootState) => state.widgets[widgetId]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleDelete = useCallback(() => {
    onDelete(widgetId);
  }, [onDelete, widgetId]);

  if (!widget) return null;

  const config = WIDGET_REGISTRY[widget.widgetType];
  const currentTab = widget.tabs[activeTab] ?? widget.tabs[0];

  return (
    <WidgetContainer>
      <TitleBar className="widget-drag-handle">
        <TypeBadge $color={TYPE_COLORS[widget.widgetType]} />
        <TitleText>{widget.title}</TitleText>
        {config.deletable && (
          <DeleteButton
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Delete widget"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </DeleteButton>
        )}
      </TitleBar>
      {widget.tabs.length > 1 && (
        <TabBar>
          {widget.tabs.map((tab, i) => (
            <Tab
              key={tab.label}
              $active={i === activeTab}
              onClick={() => handleTabClick(i)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabBar>
      )}
      {currentTab && (() => {
        const TypeComponent = WIDGET_COMPONENTS[widget.widgetType];
        return <TypeComponent tab={currentTab} widget={widget} />;
      })()}
    </WidgetContainer>
  );
});
