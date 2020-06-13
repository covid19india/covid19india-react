import locales from '../i18n/locales.json';

import React, {useState, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useSpring, useTransition, animated} from 'react-spring';
import {useLockBodyScroll, useWindowSize} from 'react-use';

const SLIDE_IN = {
  position: 'absolute',
  transform: 'translate3d(-20rem, 0, 0)',
  height: '100vh',
  zIndex: -1,
};

const SLIDE_OUT = {
  position: 'absolute',
  transform: 'translate3d(10rem, 0, 0)',
};

const SLIDE_IN_MOBILE = {
  opacity: 1,
  position: 'absolute',
  height: '100vh',
  top: 64,
  zIndex: 999,
};

const SLIDE_OUT_MOBILE = {
  opacity: 1,
  position: 'absolute',
  height: '100vh',
  top: 64,
  zIndex: 999,
};

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

  const transitions = useTransition(expand, null, {
    from: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    enter: windowSize.width < 769 ? SLIDE_OUT_MOBILE : SLIDE_OUT,
    leave: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    config: {mass: 1, tension: 210, friction: 26},
  });

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
          if (windowSize.width > 769) {
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
            <span>{windowSize.width > 768 && <SunMoon {...{darkMode}} />}</span>
          </React.Fragment>
        )}
      </div>

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div key={key} style={props}>
            <Expand {...{pages, setExpand, darkMode, windowSize}} />
          </animated.div>
        ) : (
          <animated.div key={key} style={props}></animated.div>
        )
      )}
    </animated.div>
  );
}

function Expand({pages, setExpand, darkMode, windowSize}) {
  const expandElement = useRef(null);
  const {t} = useTranslation();

  return (
    <div
      className="expand"
      ref={expandElement}
      onMouseLeave={() => {
        windowSize.width > 768 && setExpand(false);
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

      {windowSize.width < 768 && <SunMoon {...{darkMode}} />}

      <div className="expand-bottom">
        <h5>{t('A crowdsourced initiative.')}</h5>
      </div>
    </div>
  );
}

export default Navbar;

const navLinkProps = (path, animationDelay) => ({
  className: `${window.location.pathname === path ? 'focused' : ''}`,
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
