import React from 'react';

function Links(props) {
  return (
    <div className="Links">
      <div className="link fadeInUp" style={{animationDelay: '0.2s'}}>
        <h3>HELPLINE NUMBERS [by State]</h3>
        <a
          href="https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.3s'}}>
        <h3>Ministry of Health and Family Welfare, Gov. of India</h3>
        <a
          href="https://www.mohfw.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.mohfw.gov.in/
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.4s'}}>
        <h3>WHO : COVID-19 Home Page</h3>
        <a
          href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.who.int/emergencies/diseases/novel-coronavirus-2019
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.5s'}}>
        <h3>CDC</h3>
        <a
          href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.cdc.gov/coronavirus/2019-ncov/faq.html
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.6s'}}>
        <h3>Crowdsourced list of Resources & Essentials from across India</h3>
        <a
          href="https://bit.ly/covid19resourcelist"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://bit.ly/covid19resourcelist
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.7s'}}>
        <h3>COVID-19 Global Tracker</h3>
        <a
          href="https://coronavirus.thebaselab.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://coronavirus.thebaselab.com/
        </a>
      </div>
    </div>
  );
}

export default Links;
