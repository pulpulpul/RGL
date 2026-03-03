import { useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { WidgetType } from './widgets/types';
import type { AgentData } from './store/dashboard/types';
import { WIDGET_REGISTRY } from './widgets/registry';
import { setWidgetsData, addWidget, removeWidget, setAgents } from './store/dashboard/actions';
import { buildDefaultWidgetsData, createWidgetData, buildDefaultAgents } from './services/mockData';
import type { RootState } from './store/rootReducer';
import { Header } from './components/Header/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { buildDefaultLayout, findAvailablePosition, getResponsiveCols } from './components/Dashboard/dashboardUtils';
import { useLayoutPersistence } from './hooks/useLayoutPersistence';

import { AppContainer } from './App.styled';

const LAYOUT_STORAGE_KEY = 'now-dashboard-layout-v2';
const AGENTS_SEEDED_KEY = 'now-agents-seeded';

let widgetCounter = Date.now();

function seedAgentsOnce(dispatch: ReturnType<typeof useDispatch>) {
  if (localStorage.getItem(AGENTS_SEEDED_KEY)) return;
  dispatch(setAgents(buildDefaultAgents()));
  localStorage.setItem(AGENTS_SEEDED_KEY, '1');
}

function App() {
  const dispatch = useDispatch();
  const widgets = useSelector((state: RootState) => state.widgets);
  const defaultLayout = useMemo(() => buildDefaultLayout(getResponsiveCols(window.innerWidth)), []);
  const { layouts, saveLayout, resetLayout, addLayoutItem, removeLayoutItem } =
    useLayoutPersistence(LAYOUT_STORAGE_KEY, defaultLayout);

  // Seed mock agents on first visit
  useEffect(() => {
    seedAgentsOnce(dispatch);
  }, [dispatch]);

  const handleResetLayout = useCallback(() => {
    dispatch(setWidgetsData(buildDefaultWidgetsData()));
    resetLayout(buildDefaultLayout(getResponsiveCols(window.innerWidth)));
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

  const handleAddAgentToDashboard = useCallback(
    (agent: AgentData) => {
      const config = WIDGET_REGISTRY.agent;
      const id = `agent-${++widgetCounter}`;
      const cols = getResponsiveCols(window.innerWidth);
      const { x, y } = findAvailablePosition(layouts, config.defaultSize.w, config.defaultSize.h, cols);
      const data = createWidgetData(id, 'agent');
      data.settings = { ...data.settings, agentId: agent.id };
      data.title = agent.name;
      dispatch(addWidget(data));
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

  const handleRemoveAgentFromDashboard = useCallback(
    (agentId: string) => {
      const entry = Object.entries(widgets).find(
        ([, w]) => w.settings?.agentId === agentId,
      );
      if (entry) {
        dispatch(removeWidget(entry[0]));
        removeLayoutItem(entry[0]);
      }
    },
    [dispatch, removeLayoutItem, widgets],
  );

  return (
    <AppContainer>
      <Header
        onResetLayout={handleResetLayout}
        onAddWidget={handleAddWidgetFromHeader}
        onAddAgentToDashboard={handleAddAgentToDashboard}
        onRemoveAgentFromDashboard={handleRemoveAgentFromDashboard}
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
