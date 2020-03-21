import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Level from './level';
import Minigraph from './minigraph';
import Table from './table';

function Summary(props) {
  const [states, setStates] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('https://api.covid19india.org/data.json')
        .then((response)=>{
          setStates(response.data.statewise);
          setDeltas(response.data.key_values[0]);
          setFetched(true);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="Summary">
      <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
        <h1>India COVID-19 Tracker</h1>
      </div>

      <Minigraph states={states} animate={false}/>
      <Level data={states} deltas={deltas}/>
      <Table states={states.slice(0, 9)}/>

      <div className="summary-bottom">
        <div className="summary-bottom-left">
          <img src="icon.png" alt="logo"/>
          <h5>We stand with everyone fighting on the frontlines</h5>
        </div>
        <div className="link">
          <a href="https://github.com/covid19india">covid19india.org</a>
        </div>
      </div>

    </div>
  );
}

export default Summary;
