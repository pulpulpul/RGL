import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { GridLayout, useContainerWidth, verticalCompactor } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import type { RootState } from '../../store/rootReducer';
import type { WidgetType } from '../../widgets/types';
import { WIDGET_REGISTRY } from '../../widgets/registry';
import { setWidgetsData, addWidget } from '../../store/widgets/actions';
import { fetchMockWidgetsData, createWidgetData } from '../../services/mockData';
import { Widget } from './Widget';
import { getResponsiveCols, parseWidgetType } from './dashboardUtils';

const GRID_ROWS = 12;
const MARGIN_LG: [number, number] = [6, 6];
const MARGIN_SM: [number, number] = [4, 4];
const RESIZE_HANDLES: ('se' | 'sw')[] = ['se', 'sw'];

const DashboardWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0f0f1a;
`;

let dropCounter = Date.now();

interface DashboardProps {
  layouts: LayoutItem[];
  onLayoutChange: (layout: readonly LayoutItem[]) => void;
  onDeleteWidget: (widgetId: string) => void;
}

export function Dashboard({
  layouts,
  onLayoutChange,
  onDeleteWidget,
}: DashboardProps) {
  const dispatch = useDispatch();
  const { width, containerRef, mounted } = useContainerWidth();
  const [animated, setAnimated] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const widgets = useSelector((state: RootState) => state.widgets);
  const widgetIds = useMemo(() => Object.keys(widgets), [widgets]);

  // Keep refs so callbacks can read current values without extra deps.
  const widgetsRef = useRef(widgets);
  widgetsRef.current = widgets;
  const layoutsRef = useRef(layouts);
  layoutsRef.current = layouts;
  const dropPendingRef = useRef(false);

  // Sync widget store with the persisted layout on initial load.
  // Only include defaults that have a layout item; create data for
  // dynamically added widgets whose IDs are in the layout.
  useEffect(() => {
    const layoutIds = new Set(layoutsRef.current.map((l) => l.i));
    fetchMockWidgetsData().then((defaults) => {
      const synced = { ...defaults };
      // Remove defaults that were deleted (no layout item)
      for (const id of Object.keys(synced)) {
        if (!layoutIds.has(id)) delete synced[id];
      }
      // Create data for dynamic widgets present in layout but not in defaults
      for (const id of layoutIds) {
        if (!synced[id]) {
          const widgetType = parseWidgetType(id);
          if (widgetType) synced[id] = createWidgetData(id, widgetType);
        }
      }
      dispatch(setWidgetsData(synced));
      setDataLoaded(true);
    });
  }, [dispatch]);

  const cols = getResponsiveCols(width);
  const margin: [number, number] = width < 600 ? MARGIN_SM : MARGIN_LG;

  // Enrich layout items with minW/minH from the registry and
  // clamp widths to the current responsive column count.
  const enrichedLayouts = useMemo(() =>
    layouts.map((item) => {
      const widget = widgets[item.i];
      if (!widget) return { ...item, w: Math.min(item.w, cols) };
      const config = WIDGET_REGISTRY[widget.widgetType];
      const minW = Math.min(config.minSize.w, cols);
      return {
        ...item,
        minW,
        minH: config.minSize.h,
        w: Math.min(Math.max(item.w, minW), cols),
        h: Math.max(item.h, config.minSize.h),
      };
    }),
    [layouts, widgets, cols],
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout) => {
      // After a drop we already saved the authoritative layout —
      // skip the grid's next compacted report to avoid overwriting it.
      if (dropPendingRef.current) {
        dropPendingRef.current = false;
        return;
      }
      // Filter out any temporary drop placeholders and re-apply
      // minW/minH from the registry before persisting.
      const withConstraints = newLayout
        .filter((item) => !item.i.startsWith('__'))
        .map((item) => {
          const widget = widgetsRef.current[item.i];
          if (!widget) return item;
          const config = WIDGET_REGISTRY[widget.widgetType];
          return {
            ...item,
            w: Math.max(item.w, config.minSize.w),
            h: Math.max(item.h, config.minSize.h),
            minW: config.minSize.w,
            minH: config.minSize.h,
          };
        });
      // Break infinite update loops: skip save if layout hasn't actually changed.
      const current = layoutsRef.current;
      const currentMap = new Map(current.map((l) => [l.i, l]));
      const isSame =
        withConstraints.length === current.length &&
        withConstraints.every((item) => {
          const prev = currentMap.get(item.i);
          return (
            prev &&
            prev.x === item.x &&
            prev.y === item.y &&
            prev.w === item.w &&
            prev.h === item.h
          );
        });

      if (!isSame) {
        onLayoutChange(withConstraints);
      }
    },
    [onLayoutChange],
  );

  // Track user interaction for animation (use drag/resize start, not onLayoutChange).
  const handleDragOrResize = useCallback(() => {
    if (!animated) setAnimated(true);
  }, [animated]);

  const handleDrop = useCallback(
    (dropLayout: Layout, item: LayoutItem | undefined, e: Event) => {
      const dragEvent = e as DragEvent;
      const widgetType = dragEvent.dataTransfer?.getData('text/plain') as WidgetType | undefined;
      if (!widgetType || !WIDGET_REGISTRY[widgetType] || !item) return;

      const config = WIDGET_REGISTRY[widgetType];
      const id = `${widgetType}-${++dropCounter}`;

      // Read the drop position from the grid's temp item.
      const droppedAt = dropLayout.find((l) => l.i === item.i);
      if (!droppedAt) return;

      // Add widget data to the store
      dispatch(addWidget(createWidgetData(id, widgetType)));

      // Build layout from our stored layout (original sizes) + the new item.
      // This prevents the grid's intermediate compaction from shrinking
      // existing widgets that were displaced during drag-over.
      const newItem: LayoutItem = {
        i: id,
        x: droppedAt.x,
        y: droppedAt.y,
        w: config.defaultSize.w,
        h: config.defaultSize.h,
        minW: config.minSize.w,
        minH: config.minSize.h,
      };

      // Skip the next handleLayoutChange so the grid's compacted report
      // doesn't overwrite our authoritative layout.
      dropPendingRef.current = true;
      onLayoutChange([...layoutsRef.current, newItem]);
    },
    [dispatch, onLayoutChange],
  );

  const handleDropDragOver = useCallback(
    (e: React.DragEvent) => {
      const types = Array.from(e.dataTransfer?.types ?? []);
      const entry = types.find((t) => t.startsWith('application/x-widget-'));
      if (entry) {
        const widgetType = entry.replace('application/x-widget-', '') as WidgetType;
        const config = WIDGET_REGISTRY[widgetType];
        if (config) {
          return { w: Math.min(config.defaultSize.w, cols), h: config.defaultSize.h };
        }
      }
      return false;
    },
    [cols],
  );

  const containerHeight =
    containerRef.current?.clientHeight ?? window.innerHeight - 48;
  const rowHeight = Math.max(
    Math.floor((containerHeight - margin[1] * (GRID_ROWS + 1)) / GRID_ROWS),
    30,
  );

  return (
    <DashboardWrapper ref={containerRef}>
      {mounted && dataLoaded && width > 0 && (
        <GridLayout
          className={animated ? 'rgl-animated' : undefined}
          layout={enrichedLayouts}
          width={width}
          gridConfig={{
            cols,
            rowHeight,
            margin,
          }}
          dragConfig={{
            enabled: true,
            handle: '.widget-drag-handle',
            bounded: true,
          }}
          resizeConfig={{
            enabled: true,
            handles: RESIZE_HANDLES,
          }}
          onDragStart={handleDragOrResize}
          onResizeStart={handleDragOrResize}
          dropConfig={{
            enabled: true,
            defaultItem: { w: Math.min(4, cols), h: 4 },
          }}
          compactor={verticalCompactor}
          onLayoutChange={handleLayoutChange}
          onDrop={handleDrop}
          onDropDragOver={handleDropDragOver}
        >
          {widgetIds.map((id) => (
            <div key={id}>
              <Widget widgetId={id} onDelete={onDeleteWidget} />
            </div>
          ))}
        </GridLayout>
      )}
    </DashboardWrapper>
  );
}
