import React, {useEffect} from 'react';

function Cluster(props) {
  useEffect(()=>{
    window.location.replace('https://cluster.covid19india.org');
  });

  return (
    <div></div>
  );
}

export default Cluster;
