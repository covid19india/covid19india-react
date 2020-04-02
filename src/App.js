import React from 'react';
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';

import './App.scss';

import Home from './components/home';
/* import PatientDB from './components/patientdb';*/

const history = require('history').createBrowserHistory;

function App() {


  return (
    <div className="App">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <Home/>
              <Route exact path="/" render={() => <Redirect to="/"/>}/>
              <Route exact path="/cindex" render={() => <Redirect to="/cindex"/>}/>
            </div>
          )}
        />
      </Router>

      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        {/* <img
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
        />*/}

        <h5>DATA & APP Forked from covid19india.org</h5>
        <div className="link">
          <a href="https://github.com/covid19india">covid19india</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
