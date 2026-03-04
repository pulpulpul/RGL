import { memo } from 'react';
import type { DealerScore } from '../../../services/bondAlerts/types';
import {
  ExpandedSection,
  DealerSectionTitle,
  DealerRow,
  DealerRank,
  DealerInfo,
  DealerName,
  DealerStats,
  ScoreBarContainer,
  ScoreBar,
  ScoreBarFill,
  ScoreValue,
  ActionButtonRow,
  PlaceholderButton,
  QuoteTypeBadge,
} from './MarketAlerts.styled';

interface DealerScoreSectionProps {
  dealers: DealerScore[];
}

export const DealerScoreSection = memo(function DealerScoreSection({
  dealers,
}: DealerScoreSectionProps) {
  return (
    <ExpandedSection>
      <DealerSectionTitle>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-8 4 4 6-10" />
        </svg>
        Dealer Selection Score
      </DealerSectionTitle>
      {dealers.map((dealer) => (
        <DealerRow key={dealer.rank}>
          <DealerRank $top={dealer.rank === 1}>{dealer.rank}</DealerRank>
          <DealerInfo>
            <DealerName>
              {dealer.name}
              <QuoteTypeBadge $type={dealer.quoteType}>{dealer.quoteType}</QuoteTypeBadge>
            </DealerName>
            <DealerStats>
              Resp: {dealer.responseTime} | Vol: {dealer.volume} | Hit: {dealer.hitRate}%
            </DealerStats>
          </DealerInfo>
          <ScoreBarContainer>
            <ScoreBar>
              <ScoreBarFill $score={dealer.score} />
            </ScoreBar>
            <ScoreValue $score={dealer.score}>{dealer.score}</ScoreValue>
          </ScoreBarContainer>
        </DealerRow>
      ))}
      <ActionButtonRow>
        <PlaceholderButton>Create Ticket</PlaceholderButton>
        <PlaceholderButton $primary>Add to List</PlaceholderButton>
      </ActionButtonRow>
    </ExpandedSection>
  );
});
