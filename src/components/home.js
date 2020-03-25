import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {format, zonedTimeToUtc} from 'date-fns-tz';
import {formatDistance} from 'date-fns';

import Table from './table';
import Level from './level';
import ChoroplethMap from './choropleth';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';
import Banner from './banner';

function Home(props) {
  const [states, setStates] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);

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
          <div className="header-mid">
            <div className="titles">
              <h1>India COVID-19 Tracker</h1>
              <h6>A Crowdsourced Initiative</h6>
            </div>
            <div className="last-update">
              <h6>Last Reported Case</h6>
              <h3>{lastUpdated.length===0 ? '' : formatDistance(zonedTimeToUtc(new Date(lastUpdated), 'Asia/Calcutta'), zonedTimeToUtc(new Date()))+' Ago'}</h3>
            </div>
          </div>
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

          <div className="timeseries-mode">
            <label htmlFor="timeseries-mode">Scale Uniformly</label>
            <input type="checkbox" checked={timeseriesMode} onChange={(event)=>{
              setTimeseriesMode(!timeseriesMode);
            }}/>
          </div>

        </div>

        <TimeSeries timeseries={timeseries} type={graphOption} mode={timeseriesMode}/>

      </div>
    </div>
  );
}

export default Home;
