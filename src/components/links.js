import React from 'react';

function Links(props) {
  return (
    <div className="Links">
      <div className="link fadeInUp" style={{animationDelay: '0.2s'}}>
        <a
          href="https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          HELPLINE NUMBERS [by State]
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.3s'}}>
        
        <a
          href="https://www.mohfw.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ministry of Health and Family Welfare, Gov. of India
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.4s'}}>
        
        <a
          href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
          target="_blank"
          rel="noopener noreferrer"
        >
          WORLD HEALTH ORGANIZATION : COVID-19 Home Page
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.5s'}}>
        <a
          href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          CENTERS FOR DISEASE CONTROL AND PREVENTION
        </a>
      </div>

      {/* <div className="link fadeInUp" style={{animationDelay: '0.6s'}}>
        Crowdsourced list of Resources & Essentials from across India
        <a
          href="https://bit.ly/covid19resourcelist"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://bit.ly/covid19resourcelist
        </a>
      </div> */}

      <div className="link fadeInUp" style={{animationDelay: '0.7s'}}>
        
        <a
          href="https://coronavirus.thebaselab.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          COVID-19 Global Tracker
        </a>
      </div>
    </div>
  );
}

export default Links;
