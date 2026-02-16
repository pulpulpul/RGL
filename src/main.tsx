import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { GlobalStyle } from './styles/GlobalStyle';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <App />
    </Provider>
  </StrictMode>,
);
