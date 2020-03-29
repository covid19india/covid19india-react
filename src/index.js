import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from 'react-i18next';

import App from './App';
import i18n from './i18n';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Suspense fallback={'Loading...'}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
