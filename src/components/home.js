import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';
import {format, zonedTimeToUtc} from 'date-fns-tz';
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
  const [timeseries, setTimeseries] = useState([]);
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
          setTimeseries(response.data.cases_time_series);
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

      <div className="home-left">

        <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
          <h1>India COVID-19 Tracker</h1>
          <div className="header-mid">
            <a className="button" href="https://bit.ly/patientdb" target="_noblank">
              <Icon.Database /><span>Crowdsourced Patient Database&nbsp;</span>
            </a>
            <div className="last-update">
              <h6>Last Reported Case</h6>
              <h3>{lastUpdated.length===0 ? '' : formatDistance(zonedTimeToUtc(new Date(lastUpdated), 'Asia/Calcutta'), zonedTimeToUtc(new Date()))+' Ago'}</h3>
            </div>
          </div>

          <a href="https://t.me/covid19indiaops" className="button telegram" target="_noblank">
            <Icon.MessageCircle />
            <span>Join Telegram to Collaborate!</span>
          </a>
        </div>

        <Level data={states} deltas={deltas}/>
        <Minigraph timeseries={timeseries} animate={true}/>

        <Table states={states} summary={false}/>

      </div>

      <div className="home-right">

        <ChoroplethMap states={states}/>

        <div className="timeseries-header fadeInUp" style={{animationDelay: '1.5s'}}>
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

        <TimeSeries timeseries={timeseries} type={graphOption}/>

      </div>
    </div>
  );
}

export default Home;
