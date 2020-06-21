import './App.scss';
import './dark-theme.scss';
import Blog from './components/blog';
import Navbar from './components/navbar';
import ThemeChooser from './components/themechooser';
import {PRIMARY_COLORS, BACKGROUND_COLORS} from './constants';
import ScrollToTop from './utils/ScrollToTop';

import React, {lazy, useState, Suspense, useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

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

const colorKeys = Object.freeze({
  P_COLOR: 'p-color',
  BG_COLOR: 'bg-color',
});

function App() {
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [showThemeChooser, setShowThemeChooser] = useState(false);
  const [pColor, setPColor] = useState('');
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    const cachedPColor =
      localStorage?.getItem(colorKeys.P_COLOR) ?? PRIMARY_COLORS[0];
    const cachedBgColor =
      localStorage?.getItem(colorKeys.BG_COLOR) ??
      BACKGROUND_COLORS.DEFAULT.color;

    setPColor(cachedPColor);
    setBgColor(cachedBgColor);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', pColor);
  }, [pColor]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-color', bgColor);
    let className;

    if (bgColor === BACKGROUND_COLORS.LIGHTS_OUT.color) {
      className = 'dark-mode dim';
    } else if (bgColor === BACKGROUND_COLORS.DIM.color) {
      className = 'dark-mode lights-out';
    } else {
      className = 'light-theme';
    }

    document.getElementsByTagName('body')[0].className = className;
  }, [bgColor]);

  const cacheColor = (key, color) => {
    localStorage.setItem(key, color);
  };

  const handleOnPColorChange = useCallback(
    (newColor) => {
      setPColor(newColor);
      cacheColor(colorKeys.P_COLOR, newColor);
    },
    [setPColor]
  );

  const handleOnBgColorChange = useCallback(
    (newColor) => {
      setBgColor(newColor);
      cacheColor(colorKeys.BG_COLOR, newColor);
    },
    [setBgColor]
  );

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
    <>
      {showThemeChooser && (
        <ThemeChooser
          isOpen={showThemeChooser}
          onClose={() => setShowThemeChooser(false)}
          onPColorChange={handleOnPColorChange}
          onBgColorChange={handleOnBgColorChange}
          {...{pColor, bgColor}}
        />
      )}
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
              setShowThemeChooser={setShowThemeChooser}
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
    </>
  );
}

export default App;
