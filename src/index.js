import './wdyr';
import * as serviceWorker from './serviceWorker';
import './i18n';

import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

const App = lazy(() => import('./App' /* webpackChunkName: "App" */));

ReactDOM.render(
  <Suspense fallback={<div />}>
    <Router>
      <App />
    </Router>
  </Suspense>,
  document.getElementById('root')
);

serviceWorker.register();
