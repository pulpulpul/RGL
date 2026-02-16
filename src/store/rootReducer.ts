import { combineReducers } from 'redux';
import { widgetsReducer } from './widgets/reducer';

export const rootReducer = combineReducers({
  widgets: widgetsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
