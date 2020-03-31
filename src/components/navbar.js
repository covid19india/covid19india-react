import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Navbar(props) {
  const [language, setLanguage] = useState(localStorage.getItem('language'));

  const handleLangChange = (language) => {
    setLanguage(language);
    localStorage.setItem('language', language);
    window.location.reload();
  };

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
          height: window.location.pathname === '/clusters' ? '2.5rem' : '',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <img
          className="fadeInUp logo"
          alt="India COVID-19 Tracker"
          src="/icon.png"
          style={{
            animationDelay: '0.0s',
            width: window.location.pathname === '/clusters' ? '1.5rem' : '',
            height: window.location.pathname === '/clusters' ? '1.5rem' : '',
            transition: 'all 0.3s ease-in-out',
          }}
        />

        <div className="navbar-left">
          {props.pages.map((page, i) => {
            return (
              <Link to={page.pageLink} key={i}>
                <span
                  {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
                >
                  {page.displayName}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="navbar-right">
          <select
            name="language"
            value={language}
            onChange={(event) => handleLangChange(event.target.value)}
          >
            <option value="en">English</option>
            <option value="kan">ಕನ್ನಡ</option>
          </select>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
