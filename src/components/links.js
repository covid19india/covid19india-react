import React from 'react';

function Links(props) {
  return (
    <div className="Links">
      <div className="link fadeInUp" style={{animationDelay: '0.2s'}}>
        <h2>
          <a href="https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf">
            HELPLINE NUMBERS [by State]
          </a>
        </h2>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.3s'}}>
        <h2>
          <a href="https://www.mohfw.gov.in/">
            Ministry of Health and Family Welfare, Gov. of India
          </a>
        </h2>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.4s'}}>
        <h2>
          <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019">
            World Health Organization – COVID-19 Home Page
          </a>
        </h2>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.5s'}}>
        <h2>
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html">
            Centers for Disease Control and Prevention
          </a>
        </h2>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.6s'}}>
        <h2>
          <a href="https://coronavirus.thebaselab.com/">
            COVID-19 Global Tracker
          </a>
        </h2>
      </div>
    </div>
  );
}

export default Links;
