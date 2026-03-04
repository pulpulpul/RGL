import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { BondAlert, AlertFilter } from '../services/bondAlerts/types';
import { bondAlertSimulator } from '../services/bondAlerts/BondAlertSimulator';
import { generateInitialAlerts } from '../services/bondAlerts/generateAlert';

const MAX_ALERTS = 50;
const INITIAL_COUNT = 8;

export function useBondAlerts(agentId: string, isActive: boolean) {
  const [alerts, setAlerts] = useState<BondAlert[]>(() =>
    generateInitialAlerts(agentId, INITIAL_COUNT),
  );
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const alertCountRef = useRef(alerts.length);

  useEffect(() => {
    if (!isActive) return;
    const unsub = bondAlertSimulator.subscribe(agentId, (alert) => {
      setAlerts((prev) => {
        const next = [alert, ...prev];
        return next.length > MAX_ALERTS ? next.slice(0, MAX_ALERTS) : next;
      });
    });
    return unsub;
  }, [agentId, isActive]);

  // Track total count for title bar badge
  alertCountRef.current = alerts.length;

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    if (filter === 'watched') return alerts.filter((a) => a.watched);
    return alerts.filter((a) => a.direction === filter);
  }, [alerts, filter]);

  const counts = useMemo(
    () => ({
      wider: alerts.filter((a) => a.direction === 'wider').length,
      tighter: alerts.filter((a) => a.direction === 'tighter').length,
      watched: alerts.filter((a) => a.watched).length,
    }),
    [alerts],
  );

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    alerts: filteredAlerts,
    totalCount: alerts.length,
    filter,
    setFilter,
    counts,
    expandedId,
    toggleExpanded,
  };
}
