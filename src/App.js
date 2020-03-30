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
import {useTranslation} from 'react-i18next';

const history = require('history').createBrowserHistory;

function App() {
  const {t} = useTranslation();
  // Add a new page simply by adding a new entry in this array.
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      animationDelayForNavbar: 0.2,
    },
    {
      pageLink: '/clusters',
      view: Cluster,
      displayName: 'Clusters',
      animationDelayForNavbar: 0.3,
    },
    {
      pageLink: '/links',
      view: Links,
      displayName: 'Helpful Links',
      animationDelayForNavbar: 0.4,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: 'FAQ',
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
        <h5>{t('We stand with everyone fighting on the frontlines')}</h5>
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
            <span>{t('Crowdsourced Patient Database')}</span>
          </a>
          <a
            href="https://bit.ly/covid19crowd"
            className="button telegram"
            target="_noblank"
          >
            <Icon.MessageCircle />
            <span>{t('Join Telegram to Collaborate!')}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
