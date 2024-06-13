import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './index.scss';
import { Provider } from 'react-redux';
import store from './services/store';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
