import anime from 'animejs';
import React, {useState, useRef} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {
  useEffectOnce,
  useLockBodyScroll,
  useWindowSize,
  useLocalStorage,
} from 'react-use';

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

function Navbar({pages, darkMode, setDarkMode}) {
  const [expand, setExpand] = useState(false);
  // eslint-disable-next-line
  const [isThemeSet, setIsThemeSet] = useLocalStorage('isThemeSet', false);

  useLockBodyScroll(expand);
  const windowSize = useWindowSize();

  return (
    <div className="Navbar">
      <div
        className="navbar-left"
        onClick={() => {
          setDarkMode((prevMode) => !prevMode);
          setIsThemeSet(true);
        }}
      >
        {darkMode ? <Icon.Sun color={'#ffc107'} /> : <Icon.Moon />}
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
            anime({
              targets: '.navbar-right path',
              strokeDashoffset: [anime.setDashoffset, 0],
              easing: 'easeInOutSine',
              duration: 250,
              delay: function (el, i) {
                return i * 250;
              },
              direction: 'alternate',
              loop: false,
            });
          }
        }}
      >
        {windowSize.width < 769 && <span>{expand ? 'Close' : 'Menu'}</span>}
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
              <Link to="/deepdive">
                <Icon.BarChart2 {...activeNavIcon('/deepdive')} />
              </Link>
            </span>
            <span>
              <Link to="/essentials">
                <Icon.Package {...activeNavIcon('/essentials')} />
              </Link>
            </span>
            <span>
              <Link to="/faq">
                <Icon.HelpCircle {...activeNavIcon('/faq')} />
              </Link>
            </span>
          </React.Fragment>
        )}
      </div>

      {expand && <Expand expand={expand} pages={pages} setExpand={setExpand} />}
    </div>
  );
}

function Expand({expand, pages, setExpand}) {
  const expandElement = useRef(null);

  useEffectOnce(() => {
    anime({
      targets: expandElement.current,
      translateX: '10rem',
      easing: 'easeOutExpo',
      duration: 250,
    });
  });

  return (
    <div
      className="expand"
      ref={expandElement}
      onMouseLeave={() => {
        setExpand(false);
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
                {page.displayName}
              </span>
            </Link>
          );
        }
        return null;
      })}

      <div className="expand-bottom fadeInUp" style={{animationDelay: '1s'}}>
        <h5>A crowdsourced initiative.</h5>
      </div>
    </div>
  );
}

export default Navbar;
