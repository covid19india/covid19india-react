import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar(props) {
  const [view, setView] = useState("Home");

  // HTML Properties for each of the links in UI
  const navLinkProps = (path, animationDelay) => ({
    className: `fadeInUp ${window.location.pathname === path ? "focused": ""}`,
    style: {
      animationDelay: `${animationDelay}s`
    }
  });

  if (window.location.pathname !== "/summary") {
    return (
      <div
        className="Navbar"
        style={{
          animationDelay: "0.5s",
          height: view === "Clusters" ? "2.5rem" : "",
          transition: "all 0.3s ease-in-out"
        }}
      >
        <img
          className="fadeInUp"
          alt="India COVID-19 Tracker"
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
          style={{
            animationDelay: "0.0s",
            width: view === "Clusters" ? "1.5rem" : "",
            height: view === "Clusters" ? "1.5rem" : "",
            transition: "all 0.3s ease-in-out"
          }}
        />

        <div className="navbar-left">
          <Link
            to="/"
            onClick={() => {
              setView("Home");
            }}
          >
            <span {...navLinkProps('/', 0.2)}>
              Home
            </span>
          </Link>

          {/* <Link to="/updates" onClick={()=>{
            setView('Updates');
          }}>
            <span className={`fadeInUp ${view==='Updates' ? 'focused' : ''}`} style={{animationDelay: '0.2s'}}>Updates</span>
          </Link>*/}

          <Link
            to="/clusters"
            onClick={() => {
              setView("Clusters");
            }}
          >
            <span {...navLinkProps('/clusters', 0.3)}>
              Clusters
            </span>
          </Link>

          <Link
            to="/links"
            onClick={() => {
              setView("Helpful Links");
            }}
          >
            <span {...navLinkProps('/links', 0.4)}>
              Helpful Links
            </span>
          </Link>

          <Link
            to="/faq"
            onClick={() => {
              setView("FAQs");
            }}
          >
            <span {...navLinkProps('/faq', 0.4)}>
              FAQ
            </span>
          </Link>
        </div>

        <div className="navbar-right"></div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
