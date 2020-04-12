import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Navbar(props) {
  const [menuVisible, setMenuVisible] = useState(false);

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
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Link to="/">
          <img
            className="fadeInUp logo"
            alt="India COVID-19 Tracker"
            src="/icon.png"
            style={{
              animationDelay: '0.0s',
              transition: 'all 0.3s ease-in-out',
            }}
          />
        </Link>

        <div className="navbar-left">
          <div className={`navbar-menu ${!menuVisible ? 'hidden' : ''}`}>
            {props.pages.map((page, i) => {
              return (
                <Link
                  onClick={() => setMenuVisible(false)}
                  to={page.pageLink}
                  key={i}
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
            })}
          </div>
        </div>

        <div className="navbar-right">
          <div
            className="navbar-toggle"
            onClick={() => {
              setMenuVisible(!menuVisible);
            }}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
