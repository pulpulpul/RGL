import { dashboardReducer } from './dashboard/reducer';

export const rootReducer = dashboardReducer;

export type RootState = ReturnType<typeof rootReducer>;
