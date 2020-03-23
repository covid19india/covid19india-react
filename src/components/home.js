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
  const [summaryString, setSummaryData] = useState('');

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
          getSummaryData(response.data);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  const getSummaryData = (data) => {
    // This should be moved to utils
    let confirmed = 0;
    let recoveries = 0;
    let deaths = 0;
    data.statewise.map((state, index) => {
      if (index !== 0) {
        confirmed += parseInt(state.confirmed);
        recoveries += parseInt(state.recovered);
        deaths += parseInt(state.deaths);
      }
    });

    const todayDate = data.key_values[0].lastupdatedtime.split(',')[0];
    const todayData = data.cases_time_series.filter((x) => x.date.trim() === todayDate)[0];
    const dailyConfirmed = todayData ? todayData.dailyconfirmed: '0';

    const dateTimeString = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}).slice(0, -3);
    const twitterString = `COVID-19 India : 📊 as of ${dateTimeString} IST
    Total Confirmed : ${confirmed}
    Total Recovered : ${recoveries}
    Total Deceased  : ${deaths}

    Number of cases reported today: ${dailyConfirmed}

    Follow @covid19indiaorg

    #COVID19India #SocialDistancing
    More @`;

    setSummaryData(twitterString);
  };

  return (
    <div className="Home">

      <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
        <h1>India COVID-19 Tracker</h1>
        <div className="header-mid">
          <a className="button" onClick={()=>{
            document.location.href('https://bit.ly/patientdb');
          }}><Icon.Database /><span>Crowdsourced Patient Database&nbsp;</span>
          </a>
          <div className="last-update">
            <h6>Last Reported Case</h6>
            <h3>{lastUpdated.length===0 ? '' : formatDistance(zonedTimeToUtc(new Date(lastUpdated), 'Asia/Calcutta'), zonedTimeToUtc(new Date()))+' Ago'}</h3>
          </div>
        </div>
        <div className="header-mid">
          <a className="button telegram" onClick={()=>{
            document.location.href('https://t.me/covid19indiaops');
          }}>
            <Icon.MessageCircle />
            <span>Join Telegram to Collaborate!</span>
          </a>
          {/* This should be created a separate component */}
          <a className="twitter-share-button"
            href="https://twitter.com/intent/tweet"
            data-size="large"
            data-url="https://www.covid19india.org/"
            data-text={summaryString}>
            <span>Tweet</span>
          </a>
        </div>
      </div>
      <Level data={states} deltas={deltas}/>
      <Minigraph timeseries={timeseries} animate={true}/>

      <Table states={states} summary={false}/>

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

      <TimeSeries timeseries={timeseries} type={graphOption}/>
    </div>
  );
}

export default Home;
