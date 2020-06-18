// import './wdyr';
import * as serviceWorker from './serviceWorker';
import './i18n';

import React, {Suspense, lazy} from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

const App = lazy(() => import('./App'));
const rootElement = document.getElementById('root');

render(
  <Suspense fallback={<div />}>
    <Router>
      <App />
    </Router>
  </Suspense>,
  rootElement
);

serviceWorker.register();
