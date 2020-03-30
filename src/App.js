import React, {lazy, Suspense} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';
import Spinner from './components/spinner';
import Navbar from './components/navbar';
import './App.scss';
const Home = lazy(() => import('./components/home'));
const Links = lazy(() => import('./components/links'));
const Summary = lazy(() => import('./components/summary'));
const Cluster = lazy(() => import('./components/cluster'));
const FAQ = lazy(() => import('./components/faq'));
const Banner = lazy(() => import('./components/banner'));

const history = require('history').createBrowserHistory;

function App() {
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
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        <img
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
        />
        <h5>We stand with everyone fighting on the frontlines</h5>
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
            <span>Crowdsourced Patient Database&nbsp;</span>
          </a>
          <a
            href="https://bit.ly/covid19crowd"
            className="button telegram"
            target="_noblank"
          >
            <Icon.MessageCircle />
            <span>Join Telegram to Collaborate!</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
