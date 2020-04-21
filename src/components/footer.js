import React from 'react';
import * as Icon from 'react-feather';

function Footer(props) {
  return (
    <footer className="fadeInUp" style={{ animationDelay: '2s' }}>
      < div className = "link" >
      <h2><a
      href = "https://covid19india.org"
      target = "_blank"
      rel = "noopener noreferrer" >
        covid-19 India 
        </a></h2>
      </div>
      <h3>We stand with everyone fighting on the frontlines !</h3>
      <a
        href="https://github.com/covid19india/covid19india-react"
        className="button github"
        target="_blank"
        rel="noopener noreferrer"
      >
        
        <span> Open Sourced on GitHub  </span>
        <Icon.GitHub />
      </a>
      <a
        className="button excel"
        href="http://patientdb.covid19india.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        
        <span> Crowdsourced Patient Database  </span>
        <Icon.Database />
      </a>
      <a
        href="https://twitter.com/covid19indiaorg"
        target="_blank"
        rel="noopener noreferrer"
        className="button twitter"
        style={{justifyContent: 'center'}}
      >
        
        <span>View updates on Twitter </span>
        < Icon.Twitter / >
      </a>
      <a
        href="https://bit.ly/covid19crowd"
        className="button telegram"
        target="_blank"
        rel="noopener noreferrer"
      >
        
        <span>Join Telegram to Collaborate! </span>
        < Icon.MessageCircle / >
      </a>
    </footer>
  );
}

export default Footer;
