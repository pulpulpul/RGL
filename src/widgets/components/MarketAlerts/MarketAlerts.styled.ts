import styled, { keyframes, css } from 'styled-components';

// ─── Alert Header ───────────────────────────────────────────────────────────

export const HeaderWrapper = styled.div`
  padding: 8px 12px 0;
  flex-shrink: 0;
`;

export const InstructionQuote = styled.div`
  font-size: 11px;
  font-style: italic;
  color: #777;
  line-height: 1.4;
  margin-bottom: 8px;
`;

export const FilterChipBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
`;

export const FilterChip = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  border: 1px solid ${(p) => (p.$active ? p.$color : '#2a2a3e')};
  background: ${(p) => (p.$active ? p.$color + '18' : 'transparent')};
  color: ${(p) => (p.$active ? p.$color : '#888')};

  &:hover {
    border-color: ${(p) => p.$color};
    color: ${(p) => p.$color};
  }
`;

// ─── Alert List ─────────────────────────────────────────────────────────────

export const AlertListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  contain: content;
  padding: 0 12px 8px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2a3e;
    border-radius: 2px;
  }
`;

// ─── Bond Alert Card ────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CardWrapper = styled.div<{ $direction: 'wider' | 'tighter'; $isNew?: boolean }>`
  border-left: 3px solid ${(p) => (p.$direction === 'wider' ? '#ef4444' : '#4ade80')};
  background: #1a1a2e;
  border-radius: 6px;
  margin-bottom: 6px;
  overflow: hidden;
  animation: ${(p) => (p.$isNew ? css`${fadeIn} 0.3s ease-out` : 'none')};
`;

export const CardCollapsed = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #1e1e36;
  }
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const IssuerName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ddd;
`;

export const SpreadBadge = styled.span<{ $direction: 'wider' | 'tighter' }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  background: ${(p) => (p.$direction === 'wider' ? '#ef444425' : '#4ade8025')};
  color: ${(p) => (p.$direction === 'wider' ? '#ef4444' : '#4ade80')};
`;

export const Timestamp = styled.span`
  font-size: 10px;
  color: #555;
  flex-shrink: 0;
`;

export const BondDetailsRow = styled.div`
  font-size: 11px;
  color: #777;
  margin-bottom: 3px;
`;

export const BestDealerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #888;
`;

export const DealerScoreBadge = styled.span`
  font-weight: 600;
  color: #4ade80;
`;

export const QuoteTypeBadge = styled.span<{ $type: string }>`
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  ${(p) => {
    switch (p.$type) {
      case 'TWO-WAY':
        return 'background: #4ade8025; color: #4ade80;';
      case 'BID':
        return 'background: #646cff25; color: #646cff;';
      case 'OFFER':
        return 'background: #ef444425; color: #ef4444;';
      default:
        return 'background: #333; color: #888;';
    }
  }}
`;

export const ChevronIcon = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  transition: transform 0.2s;
  transform: rotate(${(p) => (p.$expanded ? '180deg' : '0deg')});
  color: #555;
  margin-left: auto;
`;

// ─── Expanded / Dealer Score Section ────────────────────────────────────────

export const ExpandedSection = styled.div`
  padding: 0 12px 10px;
  border-top: 1px solid #2a2a3e;
`;

export const DealerSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  padding: 10px 0 8px;
`;

export const DealerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 4px;
  background: #16162a;
  border-radius: 4px;
`;

export const DealerRank = styled.span<{ $top?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${(p) => (p.$top ? '#4ade8030' : '#2a2a3e')};
  color: ${(p) => (p.$top ? '#4ade80' : '#888')};
`;

export const DealerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DealerName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DealerStats = styled.div`
  font-size: 10px;
  color: #666;
  margin-top: 2px;
`;

export const ScoreBarContainer = styled.div`
  width: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ScoreBar = styled.div`
  flex: 1;
  height: 4px;
  background: #2a2a3e;
  border-radius: 2px;
  overflow: hidden;
`;

export const ScoreBarFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${(p) => p.$score * 10}%;
  border-radius: 2px;
  background: ${(p) => {
    if (p.$score >= 8) return '#4ade80';
    if (p.$score >= 6) return '#facc15';
    if (p.$score >= 4) return '#fb923c';
    return '#ef4444';
  }};
`;

export const ScoreValue = styled.span<{ $score: number }>`
  font-size: 11px;
  font-weight: 700;
  min-width: 12px;
  text-align: right;
  color: ${(p) => {
    if (p.$score >= 8) return '#4ade80';
    if (p.$score >= 6) return '#facc15';
    if (p.$score >= 4) return '#fb923c';
    return '#ef4444';
  }};
`;

export const ActionButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

export const PlaceholderButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid ${(p) => (p.$primary ? '#4ade80' : '#2a2a3e')};
  background: ${(p) => (p.$primary ? '#4ade8018' : '#16162a')};
  color: ${(p) => (p.$primary ? '#4ade80' : '#888')};

  &:hover {
    background: ${(p) => (p.$primary ? '#4ade8028' : '#1e1e38')};
  }
`;
