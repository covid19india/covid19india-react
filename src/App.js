import './App.scss';
import Blog from './components/blog';
import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';

import React, {lazy, useState, Suspense} from 'react';
import {Helmet} from 'react-helmet';
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

const LanguageSwitcher = lazy(() =>
  import(
    './components/languageswitcher' /* webpackChunkName: "LanguageSwitcher" */
  )
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
      displayName: 'Demographics',
      showInNavbar: true,
    },
    {
      pageLink: '/essentials',
      view: Essentials,
      displayName: 'Essentials',
      showInNavbar: true,
    },
    {
      pageLink: '/about',
      view: FAQ,
      displayName: 'About',
      showInNavbar: true,
    },
    {
      pageLink: '/blog',
      view: Blog,
      displayName: 'Blog',
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: 'State',
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

      <Suspense fallback={<div />}>
        <LanguageSwitcher
          {...{showLanguageSwitcher, setShowLanguageSwitcher}}
        />
      </Suspense>

      <Suspense fallback={<div />}>
        <Router>
          <ScrollToTop />
          <Navbar
            pages={pages}
            {...{darkMode}}
            {...{showLanguageSwitcher, setShowLanguageSwitcher}}
          />
          <Route
            render={({location}) => (
              <React.Fragment>
                <Switch location={location}>
                  {pages.map((page, index) => {
                    return (
                      <Route
                        exact
                        path={page.pageLink}
                        render={({match}) => <page.view />}
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
      </Suspense>
    </div>
  );
}

export default App;
