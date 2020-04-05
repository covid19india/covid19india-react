import React from 'react';
import * as Icon from 'react-feather';

function Footer() {
  return (
    <footer className="fadeInUp" style={{animationDelay: '2s'}}>
      {/* <img
          src="/icon.png"
          alt="https://www.covid19india.org | Coronavirus cases live dashboard"
        />*/}

      <h5>We stand with everyone fighting on the frontlines</h5>
      <div className="link">
        <a href="https://github.com/covid19india">covid19india</a>
      </div>
      <a
        href="https://github.com/covid19india/covid19india-react"
        className="button github"
      >
        <Icon.GitHub />
        <span>Open Sourced on GitHub</span>
      </a>
      <a
        className="button excel"
        href="https://bit.ly/patientdb"
        target="_noblank"
      >
        <Icon.Database />
        <span>Crowdsourced Patient Database&nbsp;</span>
      </a>
      <a
        href="https://twitter.com/covid19indiaorg"
        target="_noblank"
        className="button twitter"
        style={{justifyContent: 'center'}}
      >
        <Icon.Twitter />
        <span>View updates on Twitter</span>
      </a>
      <a
        href="https://bit.ly/covid19crowd"
        className="button telegram"
        target="_noblank"
      >
        <Icon.MessageCircle />
        <span>Join Telegram to Collaborate!</span>
      </a>
    </footer>
  );
}

export default Footer;
