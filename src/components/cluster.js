import React, {useState, useEffect} from 'react';

function Cluster(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    window.location.replace('https://cluster.covid19india.org');
  });

  return (
    <div></div>
  );
}

export default Cluster;
