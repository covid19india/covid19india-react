import React from 'react';
import Helmet from 'react-helmet';

function Cluster(props) {
  return (
    <div>
      <Helmet>
        <title>Coronavirus Spread in India | Visual Map</title>
        <meta name="title" content="Coronavirus Spread in India | Visual Map" />
        <meta name="description" content="Volunteer-driven crowdsourced initiative to track the spread of Coronavirus (COVID-19) in India" />
        <meta name="keywords" content="coronavirus,corona,covid,covid19,covid-19,covidindia,india,virus" />
      </Helmet>
      <div className="iframe-container" referrerPolicy="no-referrer" width="100%">
        <iframe title="clusters" src="https://cluster.covid19india.org"></iframe>
      </div>
    </div>
  );
}

export default Cluster;
