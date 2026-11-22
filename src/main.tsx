//src/main.tsx
import HawkCatcher from '@hawk.so/javascript';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import { store } from './store/index';

import './scss/styles.scss';

if (!import.meta.hot) {
  new HawkCatcher({ token: import.meta.env.VITE_HAWK_TOKEN });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
