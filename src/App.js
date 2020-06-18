import './App.scss';
import Blog from './components/Blog';
import Navbar from './components/Navbar';

import React, {lazy, useState, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {Route, Redirect, Switch, useLocation} from 'react-router-dom';
import {useTransition, animated, config} from 'react-spring';
import useDarkMode from 'use-dark-mode';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Demographics = lazy(() => import('./components/Demographics'));
const State = lazy(() => import('./components/State'));
const Essentials = lazy(() => import('./components/Essentials'));
const LanguageSwitcher = lazy(() => import('./components/LanguageSwitcher'));

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
  const location = useLocation();

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
      view: About,
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

      <Navbar
        pages={pages}
        {...{darkMode}}
        {...{showLanguageSwitcher, setShowLanguageSwitcher}}
      />
      <Suspense fallback={<div />}>
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
      </Suspense>
    </div>
  );
}

export default App;
