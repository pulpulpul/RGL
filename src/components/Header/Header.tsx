import { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import type { WidgetType } from '../../widgets/types';
import { SettingsMenu } from './SettingsMenu';
import { AddWidgetPanel } from './AddWidgetPanel';

interface HeaderProps {
  onResetLayout: () => void;
  onAddWidget: (widgetType: WidgetType) => void;
}

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a3e;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddWidgetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: none;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: #fff;
    border-color: #444;
  }
`;

const AddWidgetWrapper = styled.div`
  position: relative;
`;

const SettingsWrapper = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: #fff;
    border-color: #444;
  }
`;

export const Header = memo(function Header({
  onResetLayout,
  onAddWidget,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
    setPanelOpen(false);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleReset = useCallback(() => {
    onResetLayout();
    setMenuOpen(false);
  }, [onResetLayout]);

  const handlePanelToggle = useCallback(() => {
    setPanelOpen((prev) => !prev);
    setMenuOpen(false);
  }, []);

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      onAddWidget(type);
      setPanelOpen(false);
    },
    [onAddWidget],
  );

  return (
    <HeaderBar>
      <Title>Now</Title>
      <Controls>
        <AddWidgetWrapper>
          <AddWidgetButton onClick={handlePanelToggle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Widget
          </AddWidgetButton>
          {panelOpen && (
            <AddWidgetPanel
              onAddWidget={handleAddWidget}
              onClose={handlePanelClose}
            />
          )}
        </AddWidgetWrapper>
        <SettingsWrapper>
          <IconButton onClick={handleMenuToggle} aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </IconButton>
          {menuOpen && (
            <SettingsMenu onResetLayout={handleReset} onClose={handleMenuClose} />
          )}
        </SettingsWrapper>
      </Controls>
    </HeaderBar>
  );
});
