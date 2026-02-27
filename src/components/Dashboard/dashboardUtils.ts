import type { LayoutItem } from 'react-grid-layout';
import type { WidgetType } from '../../widgets/types';
import { WIDGET_REGISTRY } from '../../widgets/registry';
import { DEFAULT_WIDGET_INSTANCES } from '../../services/mockData';

export const MAX_COLS = 12;

const BREAKPOINTS = [
  { minWidth: 1200, cols: 12 },
  { minWidth: 900, cols: 8 },
  { minWidth: 600, cols: 6 },
  { minWidth: 0, cols: 4 },
] as const;

// Sorted longest-first so "portfolio-overview" matches before "order" etc.
const WIDGET_TYPES_BY_LENGTH = (Object.keys(WIDGET_REGISTRY) as WidgetType[])
  .sort((a, b) => b.length - a.length);

export function parseWidgetType(id: string): WidgetType | null {
  for (const type of WIDGET_TYPES_BY_LENGTH) {
    if (id.startsWith(type + '-')) return type;
  }
  return null;
}

export function getResponsiveCols(width: number): number {
  for (const bp of BREAKPOINTS) {
    if (width >= bp.minWidth) return bp.cols;
  }
  return 4;
}

export function buildDefaultLayout(cols: number = MAX_COLS): LayoutItem[] {
  const items: LayoutItem[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let rowMaxH = 0;

  for (const instance of DEFAULT_WIDGET_INSTANCES) {
    const config = WIDGET_REGISTRY[instance.widgetType];
    const w = Math.min(config.defaultSize.w, cols);
    const { h } = config.defaultSize;
    const minW = Math.min(config.minSize.w, cols);
    const { h: minH } = config.minSize;

    if (cursorX + w > cols) {
      cursorX = 0;
      cursorY += rowMaxH;
      rowMaxH = 0;
    }

    items.push({
      i: instance.id,
      x: cursorX,
      y: cursorY,
      w,
      h,
      minW,
      minH,
    });

    cursorX += w;
    rowMaxH = Math.max(rowMaxH, h);
  }

  return items;
}

/** Scan the grid top-to-bottom, left-to-right for the first gap that fits w×h. */
export function findAvailablePosition(
  layouts: LayoutItem[],
  w: number,
  h: number,
  cols: number = MAX_COLS,
): { x: number; y: number } {
  const clampedW = Math.min(w, cols);
  const maxY = layouts.reduce((max, l) => Math.max(max, l.y + l.h), 0);
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= cols - clampedW; x++) {
      const overlaps = layouts.some(
        (l) => x < l.x + l.w && x + clampedW > l.x && y < l.y + l.h && y + h > l.y,
      );
      if (!overlaps) return { x, y };
    }
  }
  return { x: 0, y: maxY };
}
