import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import './App.scss';

import CHome from './components/chome';
/* import PatientDB from './components/patientdb';*/

const history = require('history').createBrowserHistory;

function CApp() {
  const pages = [
    {
      pageLink: '/cindex',
      view: Home,
      displayName: 'Home',
      animationDelayForNavbar: 0.2,
    },
  ];

  return (
    <div className="CApp">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <CHome/>


            </div>
          )}
        />
      </Router>


    </div>
  );
}

export default CApp;
