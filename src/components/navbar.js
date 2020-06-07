import locales from '../i18n/locales.json';

import anime from 'animejs';
import React, {useState, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useSpring, animated} from 'react-spring';
import {useEffectOnce, useLockBodyScroll, useWindowSize} from 'react-use';

function Navbar({
  pages,
  darkMode,
  showLanguageSwitcher,
  setShowLanguageSwitcher,
}) {
  const {i18n, t} = useTranslation();
  const currentLanguage = Object.keys(locales).includes(i18n?.language)
    ? i18n?.language
    : i18n?.options?.fallbackLng[0];

  const [expand, setExpand] = useState(false);
  useLockBodyScroll(expand);
  const windowSize = useWindowSize();

  const [spring, set, stop] = useSpring(() => ({opacity: 0}));
  set({opacity: 1});
  stop();

  return (
    <animated.div className="Navbar" style={spring}>
      <div
        className="navbar-left"
        onClick={() => {
          setShowLanguageSwitcher((prevState) => !prevState);
        }}
      >
        {locales[currentLanguage]}
      </div>

      <div className="navbar-middle">
        <Link
          to="/"
          onClick={() => {
            setExpand(false);
          }}
        >
          Covid19<span>India</span>
        </Link>
      </div>

      <div
        className="navbar-right"
        onClick={() => {
          setExpand(!expand);
        }}
        onMouseEnter={() => {
          if (window.innerWidth > 769) {
            setExpand(true);
          }
        }}
      >
        {windowSize.width < 769 && (
          <span>{expand ? t('Close') : t('Menu')}</span>
        )}

        {windowSize.width > 769 && (
          <React.Fragment>
            <span>
              <Link to="/">
                <Icon.Home {...activeNavIcon('/')} />
              </Link>
            </span>
            <span>
              <Link to="/demographics">
                <Icon.Users {...activeNavIcon('/demographics')} />
              </Link>
            </span>
            <span>
              <Link to="/essentials">
                <Icon.Package {...activeNavIcon('/essentials')} />
              </Link>
            </span>
            <span>
              <Link to="/about">
                <Icon.HelpCircle {...activeNavIcon('/about')} />
              </Link>
            </span>
            <span>
              {window.innerWidth > 768 && <SunMoon {...{darkMode}} />}
            </span>
          </React.Fragment>
        )}
      </div>

      {expand && (
        <Expand {...{expand, pages, setExpand, darkMode, windowSize}} />
      )}
    </animated.div>
  );
}

function Expand({expand, pages, setExpand, darkMode, windowSize}) {
  const expandElement = useRef(null);
  const {t} = useTranslation();

  useEffectOnce(() => {
    anime({
      targets: expandElement.current,
      translateX: '10.5rem',
      easing: 'easeOutExpo',
      duration: 250,
    });
  });

  return (
    <div
      className="expand"
      ref={expandElement}
      onMouseLeave={() => {
        if (windowSize.width > 769) setExpand(false);
      }}
    >
      {pages.map((page, i) => {
        if (page.showInNavbar === true) {
          return (
            <Link
              to={page.pageLink}
              key={i}
              onClick={() => {
                setExpand(false);
              }}
            >
              <span
                {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
              >
                {t(page.displayName)}
              </span>
            </Link>
          );
        }
        return null;
      })}

      {window.innerWidth < 768 && <SunMoon {...{darkMode}} />}

      <div className="expand-bottom fadeInUp" style={{animationDelay: '1s'}}>
        <h5>{t('A crowdsourced initiative.')}</h5>
      </div>
    </div>
  );
}

export default Navbar;

const navLinkProps = (path, animationDelay) => ({
  className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
  style: {
    animationDelay: `${animationDelay}s`,
  },
});

const activeNavIcon = (path) => ({
  style: {
    stroke: window.location.pathname === path ? '#4c75f2' : '',
  },
});

const SunMoon = ({darkMode}) => {
  return (
    <div
      className="SunMoon"
      onClick={() => {
        darkMode.toggle();
      }}
    >
      <div>
        {darkMode.value ? <Icon.Sun color={'#ffc107'} /> : <Icon.Moon />}
      </div>
    </div>
  );
};
