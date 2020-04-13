import React from 'react';
import * as Icon from 'react-feather';
import '../App.scss';


function Footer(props) {

  // HTML Properties for each of the links in UI
  if (window.location.pathname !== '/summary') {
    return (

      <footer class="footer-content ">

        <div>
        <div class="tooltip">
          <a
            className="button excel"
            href="https://bit.ly/patientdb"
            target="_blank"
            rel="noopener noreferrer" 
            style={{justifyContent: 'center'}}
          >
          <Icon.Database />
          <span class="tooltiptext">Crowdsourced Patient Database</span>
          </a>
        </div>
        <div class="tooltip">
          <a
            className="button github"
            href="https://bit.ly/patientdb"
            target="_blank"
            rel="noopener noreferrer"
            style={{justifyContent: 'center'}}
          >
          <Icon.GitHub />
          <span class="tooltiptext">Open Sourced on GitHub</span>
          </a>
        </div>
        <div class="tooltip">
          <a
            className="button twitter"
            href="https://twitter.com/covid19indiaorg"
            target="_blank"
            rel="noopener noreferrer"
            style={{justifyContent: 'center'}}
          >
          <Icon.Twitter />
          <span class="tooltiptext">View updates on Twitter</span>
            
          </a>
        </div>
        <div class="tooltip">
          <a
          href="https://bit.ly/covid19crowd"
          className="button telegram"
          target="_blank"
          rel="noopener noreferrer"
          >
            <Icon.MessageCircle />
            <span class="tooltiptext">Join Telegram to Collaborate!</span>
          </a>
        </div>
        </div>
      </footer>
    );
  } 
  else {
    return <div></div>;
  }
}

export default Footer;
 
