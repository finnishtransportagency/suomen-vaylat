import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './resources/css/custom.scss';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { BrowserRouter } from 'react-router-dom';
import { DialogStackProvider } from './state/DialogStackContext';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <DialogStackProvider>
          <App />
        </DialogStackProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
