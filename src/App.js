import React, {lazy, Suspense} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';
import Spinner from './components/spinner';
import './App.scss';
const Home = lazy(() => import('./components/home'));
const Navbar = lazy(() => import('./components/navbar'));
const Links = lazy(() => import('./components/links'));
const Summary = lazy(() => import('./components/summary'));
const Cluster = lazy(() => import('./components/cluster'));
const FAQ = lazy(() => import('./components/faq'));
const Banner = lazy(() => import('./components/banner'));
const history = require('history').createBrowserHistory;

function App() {
  return (
    <div className="App">
      <Suspense
        fallback={
          <div
            style={{
              width: '90vw',
              height: '100vh',
            }}
          >
            <Spinner />
          </div>
        }
      >
        <Router history={history}>
          <Route
            render={({location}) => (
              <div className="Almighty-Router">
                <Navbar />
                <Banner />
                <Route exact path="/" render={() => <Redirect to="/" />} />
                <Switch location={location}>
                  <Route
                    exact
                    path="/"
                    render={(props) => <Home {...props} />}
                  />
                  <Route
                    exact
                    path="/links"
                    render={(props) => <Links {...props} />}
                  />
                  <Route
                    exact
                    path="/summary"
                    render={(props) => <Summary {...props} />}
                  />
                  <Route
                    exact
                    path="/clusters"
                    render={(props) => <Cluster {...props} />}
                  />
                  <Route
                    exact
                    path="/faq"
                    render={(props) => <FAQ {...props} />}
                  />
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
