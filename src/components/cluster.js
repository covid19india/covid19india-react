import React, { useEffect } from 'react';

function Cluster(props) {
  useEffect(() => {
    document.title = "Coronavirus spread in India | Visual Map"
  }, []);

  return (
    <div className="iframe-container" referrerPolicy="no-referrer" width="100%">
      <iframe title="clusters" src="https://cluster.covid19india.org"></iframe>
    </div>
  );
}

export default Cluster;
