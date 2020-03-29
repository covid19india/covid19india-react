import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import LanguageSwitcher from './languageswitcher';

function Navbar(props) {
  const {t} = useTranslation();
  const [view, setView] = useState('Home');

  // HTML Properties for each of the links in UI
  const navLinkProps = (path, animationDelay) => ({
    className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
    style: {
      animationDelay: `${animationDelay}s`,
    },
  });

  if (window.location.pathname !== '/summary') {
    return (
      <div
        className="Navbar"
        style={{
          animationDelay: '0.5s',
          height: view === 'Clusters' ? '2.5rem' : '',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <img
          className="fadeInUp logo"
          alt={t('India COVID-19 Tracker')}
          src="/icon.png"
          style={{
            animationDelay: '0.0s',
            width: view === 'Clusters' ? '1.5rem' : '',
            height: view === 'Clusters' ? '1.5rem' : '',
            transition: 'all 0.3s ease-in-out',
          }}
        />

        <div className="navbar-left">
          <Link
            to="/"
            onClick={() => {
              setView('Home');
            }}
          >
            <span {...navLinkProps('/', 0.2)}>{t('Home')}</span>
          </Link>

          {/* <Link to="/updates" onClick={()=>{
            setView('Updates');
          }}>
            <span className={`fadeInUp ${view==='Updates' ? 'focused' : ''}`} style={{animationDelay: '0.2s'}}>Updates</span>
          </Link>*/}

          <Link
            to="/clusters"
            onClick={() => {
              setView('Clusters');
            }}
          >
            <span {...navLinkProps('/clusters', 0.3)}>{t('Clusters')}</span>
          </Link>

          <Link
            to="/links"
            onClick={() => {
              setView('Helpful Links');
            }}
          >
            <span {...navLinkProps('/links', 0.4)}>{t('Helpful Links')}</span>
          </Link>

          <Link
            to="/faq"
            onClick={() => {
              setView('FAQs');
            }}
          >
            <span {...navLinkProps('/faq', 0.4)}>{t('FAQ')}</span>
          </Link>
        </div>

        <div className="navbar-right">
          <LanguageSwitcher />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
