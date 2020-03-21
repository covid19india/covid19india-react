import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';
import {formatDistance} from 'date-fns';

import Table from './table';
import Level from './level';
import ChoroplethMap from './choropleth';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [deltas, setDeltas] = useState([]);

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('https://api.covid19india.org/data.json')
        .then((response)=>{
          setStates(response.data.statewise);
          setLastUpdated(response.data.statewise[0].lastupdatedtime.slice(0, 15)+response.data.statewise[0].lastupdatedtime.slice(18));
          setDeltas(response.data.key_values[0]);
          setFetched(true);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="Home">

      <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
        <h1>India COVID-19 Tracker</h1>
        <div className="header-mid">
          <button onClick={()=>{
            window.location.replace('https://bit.ly/covid19indiapatientdb_echo');
          }}><Icon.Database /><span>Live Patient Database</span></button>
          <div className="last-update">
            <h6>Last Reported Case</h6>
            <h3>{lastUpdated.length===0 ? '' : formatDistance(new Date(lastUpdated), new Date())+' Ago'}</h3>
          </div>
        </div>

        <button onClick={()=>{
          window.location.replace('https://t.me/covid19indiaops');
        }}className="is-purple telegram">
          <Icon.MessageCircle />
          <span>Join Telegram to Collaborate!</span>
        </button>

      </div>

      <Level data={states} deltas={deltas}/>
      <Minigraph states={states} animate={true}/>

      <Table states={states}/>

      <ChoroplethMap states={states}/>

      <div className="timeseries-header">
        <h1>Spread Trends</h1>
        <div className="tabs">
          <div className={`tab ${graphOption===1 ? 'focused' : ''}`} onClick={()=>{
            setGraphOption(1);
          }}>
            <h4>Cumulative</h4>
          </div>
          <div className={`tab ${graphOption===2 ? 'focused' : ''}`} onClick={()=>{
            setGraphOption(2);
          }}>
            <h4>Daily</h4>
          </div>
        </div>
      </div>

      <TimeSeries states={states} type={graphOption}/>
    </div>
  );
}

export default Home;
