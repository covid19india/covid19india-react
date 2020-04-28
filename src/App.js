import './App.scss';

import DeepDive from './components/deepdive';
import FAQ from './components/faq';
import Home from './components/home';
import Navbar from './components/navbar';
import PatientDB from './components/patientdb';
import Resources from './components/resources';
import State from './components/state';
import ScrollToTop from './utils/ScrollToTop';

import React from 'react';
import {Helmet} from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage, useEffectOnce} from 'react-use';

const schemaMarkup = {
  '@context': 'http://schema.org/',
  '@type': 'NGO',
  name: 'Coronavirus Outbreak in India: Latest Map and Case Count',
  alternateName: 'COVID-19 Tracker',
  url: 'https://www.covid19india.org/',
  image: 'https://www.covid19india.org/thumbnail.png',
};

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
      pageLink: '/essentials',
      view: Resources,
      displayName: 'Essentials',
      animationDelayForNavbar: 0.5,
      showInNavbar: true,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: 'FAQ',
      animationDelayForNavbar: 0.6,
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: 'State',
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
      </Router>
    </div>
  );
}

export default App;
