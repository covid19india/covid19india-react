import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from './languageswitcher';
import { useTranslation } from 'react-i18next';

function Navbar(props) {
  const [view, setView] = useState("Home");
  const {t} = useTranslation();

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
          src="/icon.png"
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
            <span
              className={`fadeInUp ${view === "Home" ? "focused" : ""}`}
              style={{ animationDelay: "0.2s" }}
            >
              {t("Home")}
            </span>
          </Link>

          <Link
            to="/clusters"
            onClick={() => {
              setView("Clusters");
            }}
          >
            <span
              className={`fadeInUp ${view === "Network Map" ? "focused" : ""}`}
              style={{ animationDelay: "0.3s" }}
            >
              {t("Clusters")}
            </span>
          </Link>

          <Link
            to="/links"
            onClick={() => {
              setView("Helpful Links");
            }}
          >
            <span
              className={`fadeInUp ${
                view === "Helpful Links" ? "focused" : ""
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              {t("Helpful Links")}
            </span>
          </Link>

          <Link
            to="/faq"
            onClick={() => {
              setView("FAQs");
            }}
          >
            <span
              className={`fadeInUp ${view === "FAQs" ? "focused" : ""}`}
              style={{ animationDelay: "0.4s" }}
            >
              {t("FAQs")}
            </span>
          </Link>
        </div>

        <div className="navbar-right">
          <LanguageSwitcher />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;
