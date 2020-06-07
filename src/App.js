import './App.scss';
import LanguageSwitcher from './components/languageswitcher';
import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';

import React, {lazy, useState} from 'react';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import useDarkMode from 'use-dark-mode';

const Home = lazy(() =>
  import('./components/home' /* webpackChunkName: "Home" */)
);
const FAQ = lazy(() =>
  import('./components/faq' /* webpackChunkName: "About" */)
);
const Demographics = lazy(() =>
  import('./components/demographics' /* webpackChunkName: "Demographics" */)
);
const State = lazy(() =>
  import('./components/state' /* webpackChunkName: "State" */)
);
const Essentials = lazy(() =>
  import('./components/essentials' /* webpackChunkName: "Essentials" */)
);

const schemaMarkup = {
  '@context': 'http://schema.org/',
  '@type': 'NGO',
  name: 'Coronavirus Outbreak in India: Latest Map and Case Count',
  alternateName: 'COVID-19 Tracker',
  url: 'https://www.covid19india.org/',
  image: 'https://www.covid19india.org/thumbnail.png',
};

function App() {
  const {t} = useTranslation();
  const darkMode = useDarkMode(false);
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);

  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      showInNavbar: true,
    },
    {
      pageLink: '/demographics',
      view: Demographics,
      displayName: t('Demographics'),
      showInNavbar: true,
    },
    {
      pageLink: '/essentials',
      view: Essentials,
      displayName: t('Essentials'),
      showInNavbar: true,
    },
    {
      pageLink: '/about',
      view: FAQ,
      displayName: t('About'),
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: t('State'),
      showInNavbar: false,
    },
  ];

  return (
    <div className="App">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <LanguageSwitcher {...{showLanguageSwitcher, setShowLanguageSwitcher}} />

      <Router>
        <ScrollToTop />
        <Route
          render={({location}) => (
            <React.Fragment>
              <Navbar
                pages={pages}
                {...{darkMode}}
                {...{showLanguageSwitcher, setShowLanguageSwitcher}}
              />

              <Switch location={location}>
                {pages.map((page, index) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      render={({match}) => (
                        <page.view key={match.params.stateCode || index} />
                      )}
                      key={index}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </React.Fragment>
          )}
        />
      </Router>
    </div>
  );
}

export default App;
