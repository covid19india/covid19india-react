import './wdyr';
import * as serviceWorker from './serviceWorker';
import './i18n';

import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

const App = lazy(() => import('./App' /* webpackChunkName: "App" */));
const rootElement = document.getElementById('root');

ReactDOM.unstable_createRoot(rootElement).render(
  <Suspense fallback={<div />}>
    <Router>
      <App />
    </Router>
  </Suspense>
);

serviceWorker.register();
