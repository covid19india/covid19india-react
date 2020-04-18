import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const navLinkProps = (path, animationDelay) => ({
  className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
  style: {
    animationDelay: `${animationDelay}s`,
  },
});

function Navbar({pages}) {
  const [expand, setExpand] = useState(false);

  // When the user clicks anywhere outside of the expanded navbar, then close expanded navbar
  window.onclick = function (event) {
    const backdrop = document.getElementById('backdrop');
    if (event.target === backdrop) {
      setExpand(false);
    }
  };

  useEffect(() => {
    // give padding only when there is scrollbar
    if (expand) {
      if (window.innerHeight < document.body.scrollHeight) {
        document.body.classList.add(
          'scroll-disabled',
          'scroll-disabled--padding'
        );
      } else {
        document.body.classList.add('scroll-disabled');
      }
    } else {
      if (window.innerHeight < document.body.scrollHeight) {
        document.body.classList.remove(
          'scroll-disabled',
          'scroll-disabled--padding'
        );
      } else {
        document.body.classList.remove('scroll-disabled');
      }
    }

    if (window.innerWidth > 769) {
      const backdrop = document.getElementById('backdrop');
      if (expand) {
        backdrop.style.display = 'block';
        backdrop.classList.add('backdrop-open');
        backdrop.classList.remove('backdrop-close');
      } else {
        backdrop.style.display = 'none';
        backdrop.classList.remove('backdrop-open');
        backdrop.classList.add('backdrop-close');
      }
    }
  }, [expand]);

  return (
    <div
      className="Navbar"
      style={{width: window.innerWidth > 769 && expand ? '6rem' : ''}}
    >
      <div id="backdrop"></div>
      <div className="navbar-left">English</div>
      <div className="navbar-middle">
        <Link
          to="/"
          onClick={() => {
            if (expand) {
              setExpand(false);
            }
          }}
        >
          Covid19<span>India</span>
        </Link>
      </div>
      <div
        className="navbar-right"
        style={{
          background: expand ? '#4c75f2' : '',
          color: expand ? 'white' : '',
        }}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        {expand ? 'Close' : 'Menu'}
      </div>
      {expand && (
        <div
          className="expand"
          style={{left: window.innerWidth > 769 && expand ? '6rem' : ''}}
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
                  {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
                >
                  <span>{page.displayName}</span>
                </Link>
              );
            }
            return null;
          })}
          <div
            className="expand-bottom fadeInUp"
            style={{animationDelay: '1s'}}
          >
            <h5>A crowdsourced initiative.</h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
