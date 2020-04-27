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
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage} from 'react-use';

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

  if (window.innerWidth < 769) {
    let prevScrollpos = window.pageYOffset;
    let scrolling = false;
    window.onscroll = function () {
      scrolling = true;
    };
    setInterval(() => {
      if (scrolling) {
        const currentScrollPos = window.pageYOffset;
        const patientsDbFilter = document.querySelector('.PatientsDB .filters');
        const HomeTableThead = document.querySelectorAll(
          '.Home #table-head-sticky-row th'
        );
        const navbar = document.getElementById('navbar');
        if (currentScrollPos > 30) {
          navbar.classList.add('Navbar-box-shadow');
        } else {
          navbar.classList.remove('Navbar-box-shadow');
        }
        if (prevScrollpos > currentScrollPos) {
          navbar.style.top = '0';
          if (patientsDbFilter) {
            patientsDbFilter.style.paddingTop = '4.5rem';
          }
          if (HomeTableThead.length) {
            HomeTableThead.forEach((head) => (head.style.top = '4.2rem'));
          }
        } else {
          navbar.style.top = '-5rem';
          if (patientsDbFilter) {
            patientsDbFilter.style.paddingTop = '0.5rem';
          }
          if (HomeTableThead.length) {
            HomeTableThead.forEach((head) => (head.style.top = '0.25rem'));
          }
        }
        prevScrollpos = currentScrollPos;
        scrolling = false;
      }
    }, 250);
  }

  React.useEffect(() => {
    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
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
