import {
  SLIDE_IN,
  SLIDE_OUT,
  SLIDE_IN_MOBILE,
  SLIDE_OUT_MOBILE,
} from '../animations';
import locales from '../i18n/locales.json';

import React, {useState, useCallback, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useSpring, useTransition, animated} from 'react-spring';
import {useLockBodyScroll, useWindowSize} from 'react-use';

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

  const handleMouseEnter = useCallback(() => {
    if (windowSize.width > 769) {
      setExpand(true);
    }
  }, [windowSize.width]);

  const handleLangaugeSwitcher = useCallback(() => {
    if (expand) setExpand(false);
    setShowLanguageSwitcher(!showLanguageSwitcher);
  }, [expand, showLanguageSwitcher, setExpand, setShowLanguageSwitcher]);

  return (
    <animated.div className="Navbar" style={spring}>
      <div className="navbar-left" onClick={handleLangaugeSwitcher.bind(this)}>
        {locales[currentLanguage]}
      </div>

      <div className="navbar-middle">
        <Link to="/" onClick={setExpand.bind(this, false)}>
          Covid19<span>India</span>
        </Link>
      </div>

      <div
        className="navbar-right"
        onMouseEnter={handleMouseEnter}
        {...(windowSize.width < 769 && {
          onClick: setExpand.bind(this, !expand),
        })}
      >
        {windowSize.width < 769 && (
          <span>{expand ? t('Close') : t('Menu')}</span>
        )}

        {windowSize.width > 769 && (
          <React.Fragment>
            <Link to="/">
              <span>
                <Icon.Home {...activeNavIcon('/')} />
              </span>
            </Link>
            <Link to="/blog">
              <span>
                <Icon.Book {...activeNavIcon('/blog')} />
              </span>
            </Link>
            <Link to="/about">
              <span>
                <Icon.HelpCircle {...activeNavIcon('/about')} />
              </span>
            </Link>
            <span>
              <SunMoon {...{darkMode}} />
            </span>
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

  const handleMouseLeave = useCallback(() => {
    windowSize.width > 768 && setExpand(false);
  }, [setExpand, windowSize.width]);

  return (
    <div className="expand" ref={expandElement} onMouseLeave={handleMouseLeave}>
      {pages.map((page, i) => {
        if (page.showInNavbar === true) {
          return (
            <Link
              to={page.pageLink}
              key={i}
              {...(windowSize.width < 769 && {
                onClick: setExpand.bind(this, false),
              })}
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
    <div className="SunMoon" onClick={darkMode.toggle}>
      <div>
        {darkMode.value ? <Icon.Sun color={'#ffc107'} /> : <Icon.Moon />}
      </div>
    </div>
  );
};
