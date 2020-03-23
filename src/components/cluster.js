import React, {useEffect} from 'react';

function Cluster(props) {
  return (
    <div className="iframe-container" referrerPolicy="no-referrer" width="100%"><iframe src="https://cluster.covid19india.org"></iframe></div>
  );
}

export default Cluster;
