import React, { useState, useEffect } from 'react';
// import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { Router } from '@reach/router';
import * as Icon from 'react-feather';

import './App.scss';
import Home from './components/home';
import Navbar from './components/navbar';
import Links from './components/links';
import Summary from './components/summary';
import Cluster from './components/cluster';
import FAQ from './components/faq';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Home path="/" />
        <Links path="links" />
        <Summary path="summary" />
        <Cluster path="clusters" />
        <FAQ path="faq" />
      </Router>
      <footer className="fadeInUp" style={{ animationDelay: '2s' }}>
        <img src="/icon.png" alt="logo" />
        <h5>We stand with everyone fighting on the frontlines</h5>
        <div className="link">
          <a href="https://github.com/covid19india">covid19india</a>
        </div>
        <div id="footerButtons">
          <a
            className="button"
            href="https://bit.ly/patientdb"
            target="_noblank"
          >
            <Icon.Database />
            <span>Crowdsourced Patient Database&nbsp;</span>
          </a>
          <a
            href="https://bit.ly/covid19crowd"
            className="button telegram"
            target="_noblank"
          >
            <Icon.MessageCircle />
            <span>Join Telegram to Collaborate!</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
