import './App.scss';

import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';

import React, {Suspense, lazy, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage} from 'react-use';

const DeepDive = lazy(() =>
  import(
    /* webpackChunkName: "DeepDive" */
    /* webpackPrefetch: true */
    './components/deepdive'
  )
);

const FAQ = lazy(() =>
  import(
    /* webpackChunkName: "DeepDive" */
    './components/faq'
  )
);

const Home = lazy(() =>
  import(
    /* webpackChunkName: "Home" */
    './components/home'
  )
);

const PatientDB = lazy(() =>
  import(
    /* webpackChunkName: "PatientDB" */
    './components/patientdb'
  )
);

const State = lazy(() =>
  import(
    /* webpackChunkName: "State" */
    './components/state'
  )
);

const Resources = lazy(() =>
  import(
    /* webpackChunkName: "Resources" */
    './components/resources'
  )
);

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

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Suspense fallback={<div>Loading...</div>}>
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
                        component={page.view}
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
      </Suspense>
    </div>
  );
}

export default App;
