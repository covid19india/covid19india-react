import './App.scss';
import './dark-theme.scss';

import Blog from './components/Blog';
import Navbar from './components/Navbar';
import ThemeChooser from './components/themechooser';
import {PRIMARY_COLORS, BACKGROUND_COLORS} from './constants';

import React, {lazy, useState, Suspense, useEffect, useCallback} from 'react';
import {Route, Redirect, Switch, useLocation} from 'react-router-dom';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const State = lazy(() => import('./components/State'));
const LanguageSwitcher = lazy(() => import('./components/LanguageSwitcher'));

const colorKeys = Object.freeze({
  P_COLOR: 'p-color',
  BG_COLOR: 'bg-color',
});

const App = () => {
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const location = useLocation();

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
      pageLink: '/blog',
      view: Blog,
      displayName: 'Blog',
      showInNavbar: true,
    },
    {
      pageLink: '/about',
      view: About,
      displayName: 'About',
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
        <Suspense fallback={<div />}>
          <LanguageSwitcher
            {...{showLanguageSwitcher, setShowLanguageSwitcher}}
          />
        </Suspense>

        <Navbar
          pages={pages}
          setShowThemeChooser={setShowThemeChooser}
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
    </>
  );
};

export default App;
