import React from 'react';

function Covid19Global(props) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return (
      <div
        className="iframe-container"
        referrerPolicy="no-referrer"
        width="100%"
      >
        <iframe
          className="darkmode-ignore"
          title="Covid19Global"
          src="http://www.arcgis.com/apps/opsdashboard/index.html#/85320e2ea5424dfaaa75ae62e5c06e61"
        ></iframe>
      </div>
    );
  } else {
    return (
      <div
        className="iframe-container"
        referrerPolicy="no-referrer"
        width="100%"
      >
        <iframe
          className="darkmode-ignore"
          title="Covid19Global"
          src="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        ></iframe>
      </div>
    );
  }
}

export default Covid19Global;
