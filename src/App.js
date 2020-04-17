import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AnimatedSwitch} from 'react-router-transition';

import './App.scss';

import Home from './components/home';
import Navbar from './components/navbar';
import Links from './components/links';
import FAQ from './components/faq';
import PatientDB from './components/patientdb';
import DeepDive from './components/deepdive';
import Resources from './components/resources';
import State from './components/state';

function App() {
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      animationDelayForNavbar: 0.2,
      showInNavbar: true,
    },
    {
      pageLink: '/demographics',
      view: PatientDB,
      displayName: 'Demographics',
      animationDelayForNavbar: 0.3,
      showInNavbar: true,
    },
    {
      pageLink: '/deepdive',
      view: DeepDive,
      displayName: 'Deep Dive',
      animationDelayForNavbar: 0.4,
      showInNavbar: true,
    },
    {
      pageLink: '/links',
      view: Links,
      displayName: 'Helpful Links',
      animationDelayForNavbar: 0.5,
      showInNavbar: true,
    },
    {
      pageLink: '/essentials',
      view: Resources,
      displayName: 'Essentials',
      animationDelayForNavbar: 0.6,
      showInNavbar: true,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: 'FAQ',
      animationDelayForNavbar: 0.7,
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: 'State',
      animationDelayForNavbar: 0.8,
      showInNavbar: false,
    },
  ];

  return (
    <div className="App">
      <Route
        render={({location}) => (
          <div className="Almighty-Router">
            <Navbar pages={pages} />
            <Route exact path="/" render={() => <Redirect to="/" />} />
            <AnimatedSwitch
              atEnter={{opacity: 0}}
              atLeave={{opacity: 0}}
              atActive={{opacity: 1}}
              className="switch-wrapper"
              location={location}
            >
              {pages.map((page, i) => {
                return (
                  <Route
                    exact
                    path={page.pageLink}
                    component={page.view}
                    key={i}
                  />
                );
              })}
              <Redirect to="/" />
            </AnimatedSwitch>
          </div>
        )}
      />
    </div>
  );
}

export default App;
