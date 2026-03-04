import { memo, useMemo } from 'react';
import type { BondAlert } from '../../../services/bondAlerts/types';
import { DealerScoreSection } from './DealerScoreSection';
import {
  CardWrapper,
  CardCollapsed,
  CardTopRow,
  IssuerName,
  SpreadBadge,
  Timestamp,
  BondDetailsRow,
  BestDealerRow,
  DealerScoreBadge,
  QuoteTypeBadge,
  ChevronIcon,
} from './MarketAlerts.styled';

interface BondAlertCardProps {
  alert: BondAlert;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function formatRelativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export const BondAlertCard = memo(function BondAlertCard({
  alert,
  isExpanded,
  onToggle,
}: BondAlertCardProps) {
  const relTime = useMemo(() => formatRelativeTime(alert.timestamp), [alert.timestamp]);
  const arrow = alert.direction === 'wider' ? '\u2197' : '\u2198';
  const bpsText = `${arrow} ${alert.spreadChangeBps > 0 ? '+' : ''}${alert.spreadChangeBps} bps`;

  return (
    <CardWrapper $direction={alert.direction}>
      <CardCollapsed onClick={() => onToggle(alert.id)}>
        <CardTopRow>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
            <IssuerName>{alert.issuer}</IssuerName>
            <SpreadBadge $direction={alert.direction}>{bpsText}</SpreadBadge>
          </div>
          <Timestamp>{relTime}</Timestamp>
          <ChevronIcon $expanded={isExpanded}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </ChevronIcon>
        </CardTopRow>
        <BondDetailsRow>
          {alert.coupon}% {alert.maturity} | {alert.rating} | {alert.spreadFrom} &rarr; {alert.spreadTo} bps
        </BondDetailsRow>
        <BestDealerRow>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
          Best: {alert.bestDealer}
          <DealerScoreBadge>{alert.bestDealerScore}</DealerScoreBadge>
          <QuoteTypeBadge $type={alert.bestDealerQuoteType}>
            {alert.bestDealerQuoteType}
          </QuoteTypeBadge>
        </BestDealerRow>
      </CardCollapsed>
      {isExpanded && <DealerScoreSection dealers={alert.dealers} />}
    </CardWrapper>
  );
});
