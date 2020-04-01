import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import * as Icon from 'react-feather';

import LanguageSwitcher from './languageswitcher';

function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);
  const {t} = useTranslation();

  // HTML Properties for each of the links in UI
  const navLinkProps = (path, animationDelay) => ({
    className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
    style: {
      animationDelay: `${animationDelay}s`,
    },
  });

  if (window.location.pathname !== '/summary') {
    return (
      <React.Fragment>
        <div
          className="Navbar"
          style={{
            animationDelay: '0.5s',
            height: window.location.pathname === '/clusters' ? '2.5rem' : '',
            transition: 'all 0.3s ease-in-out',
          }}
        />
        {sidebar && (
          <div className="side-navbar fadeRight">
            <div className="fadeInUp">
              <Icon.ArrowLeftCircle
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              />
            </div>
            {props.pages.map((page, i) => {
              return (
                <Link to={page.pageLink} key={i}>
                  <span
                    {...navLinkProps(
                      page.pageLink,
                      page.animationDelayForNavbar
                    )}
                  >
                    {t(page.displayName)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div
          className="navbar-burger fadeInUp"
          onClick={() => {
            setSidebar(!sidebar);
          }}
        >
          {!sidebar && window.innerWidth < 769 && <Icon.Menu />}
        </div>

        <img
          className="fadeInUp logo"
          alt={t('India COVID-19 Tracker')}
          src="/icon.png"
          style={{
            animationDelay: '0.0s',
            width: window.location.pathname === '/clusters' ? '1.5rem' : '',
            height: window.location.pathname === '/clusters' ? '1.5rem' : '',
            transition: 'all 0.3s ease-in-out',
            display: window.innerWidth < 769 ? 'none' : '',
          }}
        />
        {sidebar && (
          <div className="side-navbar fadeRight">
            <div className="fadeInUp">
              <Icon.ArrowLeftCircle
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              />
            </div>
            {props.pages.map((page, i) => {
              return (
                <Link to={page.pageLink} key={i}>
                  <span
                    {...navLinkProps(
                      page.pageLink,
                      page.animationDelayForNavbar
                    )}
                  >
                    {t(page.displayName)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div
          className="navbar-left"
          style={{display: window.innerWidth < 769 ? 'none' : ''}}
        >
          {props.pages.map((page, i) => {
            return (
              <Link to={page.pageLink} key={i}>
                <span
                  {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
                >
                  {t(page.displayName)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="navbar-right fadeInUp" style={{animationDelay: '0.8s'}}>
          <LanguageSwitcher />
        </div>
      </React.Fragment>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
