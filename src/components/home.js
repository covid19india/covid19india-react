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

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise')
        .then((response)=>{
          console.log(response.data.data.statewise);
          setStates(response.data.data.statewise);
          setLastUpdated(response.data.data.lastRefreshed);
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
            window.location.replace('https://docs.google.com/spreadsheets/d/1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk/edit#gid=1896310216');
          }}><Icon.Database /><span>Live Patient Database</span></button>
          <div className="last-update">
            <h6>Last Update</h6>
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

      <Minigraph states={states}/>
      <Level data={states}/>

      <Table states={states}/>

      <ChoroplethMap states={states}/>

      <div className="timeseries-header">
        <h1>Time Series Graphs</h1>
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
