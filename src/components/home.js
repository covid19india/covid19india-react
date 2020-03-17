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
      <div className="notification is-info fadeInUp" style={{animationDelay: '0s'}}>
        <p><Icon.Database />View our <strong><a href="">live patient database</a></strong></p>
        <p><Icon.Send />If you'd like to collaborate, join the <strong><a href="">Telegram Group</a></strong></p>
      </div>

      <div className="header">
        {/* <div className="clipboard"><Icon.Link /></div>*/}
        <h1 className="title fadeInUp" style={{animationDelay: '0.1s'}}>COVID-19 🇮🇳</h1>
        <h2 className="subtitle fadeInUp" style={{animationDelay: '0.2s'}}>Coronavirus cases in India</h2>
        <p className="help fadeInUp" style={{animationDelay: '1.5s'}}>Last updated on {states[1] ? states[0]['17/03/2020 13:05:05'] : ''} IST</p>
      </div>

      <div className="level-parent fadeInUp" style={{animationDelay: '0.3s'}}>
        <Level data={states}/>
        <div></div>
      </div>


      <Table states={states}/>

      <ChoroplethMap states={states}/>

      <TimeSeries states={states}/>
    </div>
  );
}

export default Home;
