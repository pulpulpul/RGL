import { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { WidgetType } from '../../widgets/types';
import { WIDGET_REGISTRY } from '../../widgets/registry';
import type { RootState } from '../../store/rootReducer';

const WIDGET_TYPE_COLORS: Record<WidgetType, string> = {
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

const ALL_TYPES = Object.keys(WIDGET_REGISTRY) as WidgetType[];

interface AddWidgetPanelProps {
  onAddWidget: (widgetType: WidgetType) => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
`;

const Panel = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 480px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
  padding: 16px;
`;

const PanelTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const Card = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${(p) => (p.$disabled ? '#111122' : '#16162a')};
  border: 1px solid ${(p) => (p.$disabled ? '#1e1e2e' : '#2a2a3e')};
  border-radius: 6px;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'grab')};
  opacity: ${(p) => (p.$disabled ? 0.4 : 1)};
  transition: border-color 0.15s, background 0.15s;
  user-select: none;

  &:hover {
    border-color: ${(p) => (p.$disabled ? '#1e1e2e' : '#444')};
    background: ${(p) => (p.$disabled ? '#111122' : '#1e1e38')};
  }
`;

const Dot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #ccc;
`;

const CardMeta = styled.span`
  display: block;
  font-size: 10px;
  color: #555;
  margin-top: 2px;
`;

const AddButton = styled.button<{ $disabled: boolean }>`
  padding: 4px 10px;
  font-size: 11px;
  background: ${(p) => (p.$disabled ? '#1a1a2e' : '#646cff')};
  color: ${(p) => (p.$disabled ? '#444' : '#fff')};
  border: none;
  border-radius: 4px;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => (p.$disabled ? '#1a1a2e' : '#5558dd')};
  }
`;

export const AddWidgetPanel = memo(function AddWidgetPanel({
  onAddWidget,
  onClose,
}: AddWidgetPanelProps) {
  const widgets = useSelector((state: RootState) => state.widgets);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const existingTypes = new Set(
    Object.values(widgets).map((w) => w.widgetType),
  );

  const isDisabled = useCallback(
    (type: WidgetType) => {
      const config = WIDGET_REGISTRY[type];
      return !config.allowMultiple && existingTypes.has(type);
    },
    [existingTypes],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, type: WidgetType) => {
      if (isDisabled(type)) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', type);
      e.dataTransfer.setData(`application/x-widget-${type}`, '');
      e.dataTransfer.effectAllowed = 'copy';
      // Close the panel so the overlay doesn't block the grid from receiving drop events
      requestAnimationFrame(() => onClose());
    },
    [isDisabled, onClose],
  );

  const handleClick = useCallback(
    (type: WidgetType) => {
      if (isDisabled(type)) return;
      onAddWidget(type);
    },
    [isDisabled, onAddWidget],
  );

  return (
    <>
      <Overlay onClick={onClose} />
      <Panel>
        <PanelTitle>Add Widget</PanelTitle>
        <Grid>
          {ALL_TYPES.map((type) => {
            const config = WIDGET_REGISTRY[type];
            const disabled = isDisabled(type);
            return (
              <Card
                key={type}
                $disabled={disabled}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, type)}
              >
                <Dot $color={WIDGET_TYPE_COLORS[type]} />
                <CardInfo>
                  <CardTitle>{config.title}</CardTitle>
                  <CardMeta>
                    {config.allowMultiple ? 'Multiple' : 'Single'}
                    {' \u00b7 '}
                    {config.defaultSize.w}\u00d7{config.defaultSize.h}
                  </CardMeta>
                </CardInfo>
                <AddButton
                  $disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(type);
                  }}
                >
                  {disabled ? 'Added' : 'Add'}
                </AddButton>
              </Card>
            );
          })}
        </Grid>
      </Panel>
    </>
  );
});
