import { combineReducers } from 'redux';
import { widgetsReducer } from './widgets/reducer';
import { personaReducer } from './persona/reducer';

export const rootReducer = combineReducers({
  widgets: widgetsReducer,
  persona: personaReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
