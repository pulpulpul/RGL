import type { BondAlert } from './types';
import { generateRandomAlert } from './generateAlert';

type AlertCallback = (alert: BondAlert) => void;

class BondAlertSimulator {
  private intervals = new Map<string, ReturnType<typeof setTimeout>>();
  private listeners = new Map<string, Set<AlertCallback>>();

  subscribe(agentId: string, callback: AlertCallback): () => void {
    if (!this.listeners.has(agentId)) {
      this.listeners.set(agentId, new Set());
    }
    this.listeners.get(agentId)!.add(callback);

    if (!this.intervals.has(agentId)) {
      this.scheduleNext(agentId);
    }

    return () => {
      this.listeners.get(agentId)?.delete(callback);
      if (this.listeners.get(agentId)?.size === 0) {
        const timer = this.intervals.get(agentId);
        if (timer) clearTimeout(timer);
        this.intervals.delete(agentId);
        this.listeners.delete(agentId);
      }
    };
  }

  private scheduleNext(agentId: string) {
    const delay = 3000 + Math.random() * 2000; // 3-5s
    const timer = setTimeout(() => {
      const subs = this.listeners.get(agentId);
      if (!subs || subs.size === 0) {
        this.intervals.delete(agentId);
        return;
      }
      const alert = generateRandomAlert(agentId);
      subs.forEach((cb) => cb(alert));
      this.scheduleNext(agentId);
    }, delay);
    this.intervals.set(agentId, timer);
  }
}

export const bondAlertSimulator = new BondAlertSimulator();
