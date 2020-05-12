import Home from './components/home';
import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';

import React, {Suspense, lazy} from 'react';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage, useEffectOnce} from 'react-use';

import './App.scss';

const DeepDive = lazy(() => import('./components/deepdive'));
const FAQ = lazy(() => import('./components/faq'));
const PatientDB = lazy(() => import('./components/patientdb'));
const State = lazy(() => import('./components/state'));
const Essentials = lazy(() => import('./components/essentials'));

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
      displayName: t('Demographics'),
      animationDelayForNavbar: 0.3,
      showInNavbar: true,
    },
    {
      pageLink: '/deepdive',
      view: DeepDive,
      displayName: t('Deep Dive'),
      animationDelayForNavbar: 0.4,
      showInNavbar: true,
    },
    {
      pageLink: '/essentials',
      view: Essentials,
      displayName: t('Essentials'),
      animationDelayForNavbar: 0.5,
      showInNavbar: true,
    },
    {
      pageLink: '/about',
      view: FAQ,
      displayName: t('About'),
      animationDelayForNavbar: 0.6,
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: t('State'),
      animationDelayForNavbar: 0.7,
      showInNavbar: false,
    },
  ];

  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [isThemeSet] = useLocalStorage('isThemeSet', false);

  useEffectOnce(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !isThemeSet
    ) {
      setDarkMode(true);
    } else if (
      window.matchMedia &&
      !window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !isThemeSet
    ) {
      setDarkMode(false);
    }
  });

  React.useEffect(() => {
    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="lazy"></div>}>
          <Route
            render={({location}) => (
              <div className="Almighty-Router">
                <Navbar
                  pages={pages}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
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
              </div>
            )}
          />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
