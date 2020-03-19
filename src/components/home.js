import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';

import Table from './table';
import Level from './level';
import ChoroplethMap from './choropleth';
import TimeSeries from './timeseries';

function Home(props) {
  const [states, setStates] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('https://api.steinhq.com/v1/storages/5e6fd8b1b88d3d04ae081598/statewise')
        .then((response)=>{
          setStates(response.data);
          setFetched(true);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="Home">

      <div className="header">
        <h1>India COVID-19 Tracker</h1>
        <div className="header-mid">
          <button><Icon.Database /><span>Live Patient Database</span></button>
          <div className="last-update">
            <h6>Last Update</h6>
            <h3>3 hours ago</h3>
          </div>
        </div>

        <button className="is-purple telegram">
          <Icon.MessageCircle />
          <span>Join Telegram to Collaborate!</span>
        </button>

      </div>

      <Level data={states}/>

      <Table states={states}/>

      <ChoroplethMap states={states}/>

      <TimeSeries states={states}/>
    </div>
  );
}

export default Home;
