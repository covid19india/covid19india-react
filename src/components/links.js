import React from 'react';
import Helmet from 'react-helmet';

function Links(props) {
  return (
    <div>
      <Helmet>
        <title>Official Support Helpline & Useful Links | Coronavirus</title>
        <meta name="title" content="Official Support Helpline & Useful Links | Coronavirus" />
        <meta name="description" content="Volunteer-driven crowdsourced initiative to track the spread of Coronavirus (COVID-19) in India" />
        <meta name="keywords" content="coronavirus,corona,covid,covid19,covid-19,covidindia,india,virus" />
      </Helmet>
      <div className="Links">
        <div className="link fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h3>HELPLINE NUMBERS [by State]</h3>
          <a href="https://www.mohfw.gov.in/coronvavirushelplinenumber.pdf">
            https://www.mohfw.gov.in/coronvavirushelplinenumber.pdf
        </a>
        </div>

        <div className="link fadeInUp" style={{ animationDelay: '0.3s' }}>
          <h3>Ministry of Health and Family Welfare, Gov. of India</h3>
          <a href="https://www.mohfw.gov.in/">https://www.mohfw.gov.in/</a>
        </div>

        <div className="link fadeInUp" style={{ animationDelay: '0.4s' }}>
          <h3>WHO : COVID-19 Home Page</h3>
          <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019">
            https://www.who.int/emergencies/diseases/novel-coronavirus-2019
        </a>
        </div>

        <div className="link fadeInUp" style={{ animationDelay: '0.5s' }}>
          <h3>CDC</h3>
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html">
            https://www.cdc.gov/coronavirus/2019-ncov/faq.html
        </a>
        </div>

        <div className="link fadeInUp" style={{ animationDelay: '0.6s' }}>
          <h3>COVID-19 Global Tracker</h3>
          <a href="https://coronavirus.thebaselab.com/">
            https://coronavirus.thebaselab.com/
        </a>
        </div>
      </div>
    </div>
  );
}

export default Links;
