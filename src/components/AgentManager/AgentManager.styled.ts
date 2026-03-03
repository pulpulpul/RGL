import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
`;

export const Panel = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 480px;
  min-height: 500px;
  max-height: calc(100vh - 80px);
  overflow: hidden;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2a3e;
  flex-shrink: 0;
`;

export const PanelTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 11px;
  background: #646cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #5558dd;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #fff;
  }
`;

export const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2a3e;
    border-radius: 2px;
  }
`;

// ─── Summary Row ──────────────────────────────────────────────────────────────

export const SummaryContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid #2a2a3e;
  font-size: 11px;
  color: #888;
`;

export const SummaryItem = styled.span`
  & strong {
    color: #ccc;
    font-weight: 600;
  }
`;

// ─── Agent Card ───────────────────────────────────────────────────────────────

export const CardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #1e1e2e;
  cursor: grab;
  transition: background 0.15s;
  user-select: none;

  &:hover {
    background: #16162a;
  }
`;

export const CardDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? '#4ade80' : '#555')};
  flex-shrink: 0;
  margin-top: 4px;
`;

export const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 2px;
`;

export const CardDesc = styled.div`
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 10px;
  color: #555;
`;

export const AlertBadge = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

export const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${(p) => (p.$danger ? '#ef4444' : '#666')};
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => (p.$danger ? '#ff6666' : '#ccc')};
    border-color: #2a2a3e;
    background: #1e1e38;
  }
`;

export const DashboardBtn = styled.button<{ $onDashboard: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${(p) => (p.$onDashboard ? '#646cff' : '#666')};
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => (p.$onDashboard ? '#8888ff' : '#ccc')};
    border-color: #2a2a3e;
    background: #1e1e38;
  }
`;

// ─── Create/Edit view ─────────────────────────────────────────────────────────

export const ChatWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #555;
  font-size: 12px;
`;
