import anime from 'animejs';
import React, {useState, useRef} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {useEffectOnce, useLockBodyScroll} from 'react-use';

const navLinkProps = (path, animationDelay) => ({
  className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
  style: {
    animationDelay: `${animationDelay}s`,
  },
});

function Navbar({pages, darkMode, setDarkMode}) {
  const [expand, setExpand] = useState(false);
  useLockBodyScroll(expand);

  return (
    <div className="Navbar">
      <div
        className="navbar-left"
        onClick={() => setDarkMode((prevMode) => !prevMode)}
      >
        {darkMode ? <Icon.Sun color={'#ffc107'} /> : <Icon.Moon />}
      </div>
      <div className="navbar-middle">
        <Link to="/">
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
        {window.innerWidth < 769 && <span>{expand ? 'Close' : 'Menu'}</span>}
        {window.innerWidth > 769 && (
          <React.Fragment>
            <span>
              <Link to="/">
                <Icon.Home />
              </Link>
            </span>
            <span>
              <Link to="/demographics">
                <Icon.Users />
              </Link>
            </span>
            <span>
              <Link to="/deepdive">
                <Icon.BarChart2 />
              </Link>
            </span>
            <span>
              <Link to="/essentials">
                <Icon.Package />
              </Link>
            </span>
            <span>
              <Link to="/faq">
                <Icon.HelpCircle />
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
