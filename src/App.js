import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';

import './App.scss';
import Home from './components/home';
import Navbar from './components/navbar';
import Links from './components/links';
import Cluster from './components/cluster';
import FAQ from './components/faq';
import Banner from './components/banner';

import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en: {
    message: 'We stand with everyone fighting on the frontlines',
    patientDb: 'Crowdsourced Patient Database ',
    telegram: 'Join Telegram to Collaborate!',
    covid19: 'covid19india',
    home: 'Home',
    cluster: 'Clusters',
    helpLinks: 'Helpful Links',
    faq: 'FAQ',
  },
  kan: {
    message: 'ಮುಂದೆ ನಿಂತು ಹೋರಾಡುತ್ತಿರುವ ಎಲ್ಲರೊಟ್ಟಿಗೆ ನಾವಿದ್ದೇವೆ',
    patientDb: 'ಸಾರ್ವಜನಿಕ ಪಾಲುದಗಾರಿಕೆಯಲ್ಲಿ ರೋಗಿ ದತ್ತ ಸಂಚಯ ',
    telegram: 'ಒಟ್ಟುಗೂಡಿ ಕೆಲಸ ಮಾದಲು ಟೆಲಿಗ್ರಾಮ್‌ ಸೇರಿ!',
    covid19: 'ಕೋವಿಡ್-‌೧೯ ಭಾರತ',
    home: 'ಮುಖಪುಟ',
    cluster: 'ಗುಛ್ಛಗಳು',
    helpLinks: 'ಸಹಾಯ ಕೊಂಡಿಗಳು',
    faq: 'ಪ್ರಶ್ನೋತ್ತರ',
  },
});

strings.setLanguage(localStorage.getItem('language'));

const history = require('history').createBrowserHistory;

function App() {
  // Add a new page simply by adding a new entry in this array.
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: strings.home,
      animationDelayForNavbar: 0.2,
    },
    {
      pageLink: '/clusters',
      view: Cluster,
      displayName: strings.cluster,
      animationDelayForNavbar: 0.3,
    },
    {
      pageLink: '/links',
      view: Links,
      displayName: strings.helpLinks,
      animationDelayForNavbar: 0.4,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: strings.faq,
      animationDelayForNavbar: 0.4,
    },
  ];

  return (
    <div className="App">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <Navbar pages={pages} />
              <Banner />
              <Route exact path="/" render={() => <Redirect to="/" />} />
              <Switch location={location}>
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
              </Switch>
            </div>
          )}
        />
      </Router>
      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        <img
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
        />
        <h5>{strings.message}</h5>
        <div className="link">
          <a href="https://github.com/covid19india">{strings.covid19}</a>
        </div>
        <div id="footerButtons">
          <a
            className="button"
            href="https://bit.ly/patientdb"
            target="_noblank"
          >
            <Icon.Database />
            <span>{strings.patientDb}</span>
          </a>
          <a
            href="https://bit.ly/covid19crowd"
            className="button telegram"
            target="_noblank"
          >
            <Icon.MessageCircle />
            <span>{strings.telegram}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
