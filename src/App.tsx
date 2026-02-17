import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { WidgetType } from './widgets/types';
import { WIDGET_REGISTRY } from './widgets/registry';
import { setWidgetsData, addWidget, removeWidget } from './store/widgets/actions';
import { fetchMockWidgetsData, createWidgetData } from './services/mockData';
import { Header } from './components/Header/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { buildDefaultLayout, findAvailablePosition, getResponsiveCols } from './components/Dashboard/dashboardUtils';
import { useLayoutPersistence } from './hooks/useLayoutPersistence';

import { AppContainer } from './App.styled';

const LAYOUT_STORAGE_KEY = 'now-dashboard-layout-v2';

let widgetCounter = Date.now();

function App() {
  const dispatch = useDispatch();
  const defaultLayout = useMemo(() => buildDefaultLayout(), []);
  const { layouts, saveLayout, resetLayout, addLayoutItem, removeLayoutItem } =
    useLayoutPersistence(LAYOUT_STORAGE_KEY, defaultLayout);

  const handleResetLayout = useCallback(() => {
    fetchMockWidgetsData().then((defaults) => {
      dispatch(setWidgetsData(defaults));
      resetLayout();
    });
  }, [resetLayout, dispatch]);

  const handleAddWidget = useCallback(
    (widgetType: WidgetType) => {
      const config = WIDGET_REGISTRY[widgetType];
      const id = `${widgetType}-${++widgetCounter}`;
      const cols = getResponsiveCols(window.innerWidth);
      const { x, y } = findAvailablePosition(layouts, config.defaultSize.w, config.defaultSize.h, cols);
      dispatch(addWidget(createWidgetData(id, widgetType)));
      addLayoutItem({
        i: id,
        x,
        y,
        w: config.defaultSize.w,
        h: config.defaultSize.h,
        minW: config.minSize.w,
        minH: config.minSize.h,
      });
    },
    [dispatch, addLayoutItem, layouts],
  );

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      dispatch(removeWidget(widgetId));
      removeLayoutItem(widgetId);
    },
    [dispatch, removeLayoutItem],
  );

  const handleAddWidgetFromHeader = useCallback(
    (widgetType: WidgetType) => {
      handleAddWidget(widgetType);
    },
    [handleAddWidget],
  );

  return (
    <AppContainer>
      <Header
        onResetLayout={handleResetLayout}
        onAddWidget={handleAddWidgetFromHeader}
      />
      <Dashboard
        layouts={layouts}
        onLayoutChange={saveLayout}
        onDeleteWidget={handleDeleteWidget}
      />
    </AppContainer>
  );
}

export default App;
