import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const navLinkProps = (path, animationDelay) => ({
  className: `fadeInUp ${window.location.pathname === path ? 'focused' : ''}`,
  style: {
    animationDelay: `${animationDelay}s`,
  },
});

function Navbar({pages}) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className="Navbar"
      style={{width: window.innerWidth > 769 && expand ? '6rem' : ''}}
    >
      <div className="navbar-left">English</div>
      <div className="navbar-middle">
        <Link to="/">
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
                >
                  <span
                    {...navLinkProps(
                      page.pageLink,
                      page.animationDelayForNavbar
                    )}
                  >
                    {page.displayName}
                  </span>
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
