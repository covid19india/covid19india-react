import React from 'react';

function HowYouFeel() {
  return (
    <div className="iframe-container" referrerPolicy="no-referrer" width="80vw">
      <iframe
        title="howyoufeel"
        src="https://covid-selftest.netlify.com/"
      ></iframe>
    </div>
  );
}

export default HowYouFeel;
