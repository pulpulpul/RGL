import { memo } from 'react';
import type { AlertFilter } from '../../../services/bondAlerts/types';
import {
  HeaderWrapper,
  InstructionQuote,
  FilterChipBar,
  FilterChip,
} from './MarketAlerts.styled';

interface AlertHeaderProps {
  instruction: string;
  filter: AlertFilter;
  onFilterChange: (filter: AlertFilter) => void;
  counts: { wider: number; tighter: number; watched: number };
}

export const AlertHeader = memo(function AlertHeader({
  instruction,
  filter,
  onFilterChange,
  counts,
}: AlertHeaderProps) {
  return (
    <HeaderWrapper>
      <InstructionQuote>&ldquo;{instruction}&rdquo;</InstructionQuote>
      <FilterChipBar>
        <FilterChip
          $active={filter === 'wider'}
          $color="#ef4444"
          onClick={() => onFilterChange(filter === 'wider' ? 'all' : 'wider')}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="7 17 12 12 17 17" />
            <polyline points="7 11 12 6 17 11" />
          </svg>
          {counts.wider} Wider
        </FilterChip>
        <FilterChip
          $active={filter === 'tighter'}
          $color="#4ade80"
          onClick={() => onFilterChange(filter === 'tighter' ? 'all' : 'tighter')}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="7 7 12 12 17 7" />
            <polyline points="7 13 12 18 17 13" />
          </svg>
          {counts.tighter} Tighter
        </FilterChip>
        <FilterChip
          $active={filter === 'watched'}
          $color="#facc15"
          onClick={() => onFilterChange(filter === 'watched' ? 'all' : 'watched')}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
          {counts.watched} Watched
        </FilterChip>
      </FilterChipBar>
    </HeaderWrapper>
  );
});
