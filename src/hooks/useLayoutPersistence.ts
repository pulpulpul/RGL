import { useState, useCallback, useRef, useEffect } from 'react';
import type { LayoutItem } from 'react-grid-layout';

const SAVE_DEBOUNCE_MS = 300;

export function useLayoutPersistence(
  key: string,
  defaultLayout: LayoutItem[],
) {
  const [layouts, setLayouts] = useState<LayoutItem[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as LayoutItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore corrupt data
    }
    return defaultLayout;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistNow = useCallback(
    (items: LayoutItem[]) => {
      localStorage.setItem(key, JSON.stringify(items));
    },
    [key],
  );

  const saveLayout = useCallback(
    (newLayout: readonly LayoutItem[]) => {
      const mutable = [...newLayout];
      setLayouts(mutable);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        persistNow(mutable);
      }, SAVE_DEBOUNCE_MS);
    },
    [persistNow],
  );

  const resetLayout = useCallback((override?: LayoutItem[]) => {
    localStorage.removeItem(key);
    setLayouts(override ?? defaultLayout);
  }, [key, defaultLayout]);

  const addLayoutItem = useCallback(
    (item: LayoutItem) => {
      setLayouts((prev) => {
        const next = [...prev, item];
        persistNow(next);
        return next;
      });
    },
    [persistNow],
  );

  const removeLayoutItem = useCallback(
    (id: string) => {
      setLayouts((prev) => {
        const next = prev.filter((l) => l.i !== id);
        persistNow(next);
        return next;
      });
    },
    [persistNow],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { layouts, saveLayout, resetLayout, addLayoutItem, removeLayoutItem };
}
