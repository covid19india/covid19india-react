import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import './App.scss';
import Home from './components/home';
import Navbar from './components/navbar';
import Links from './components/links';

const history = require('history').createBrowserHistory;

function App() {
  return (
    <div className="App">

      <Router history={history}>
        <Route render={({location}) => (
          <div className="Almighty-Router">
            <Navbar />
            <Route exact path="/" render={() => <Redirect to="/" />} />
            <Switch location={location}>
              <Route exact path="/" render={(props) => <Home {...props}/>} />
              <Route exact path="/links" render={(props) => <Links {...props}/>} />
            </Switch>
          </div>
        )}
        />
      </Router>

    </div>
  );
}

export default App;
