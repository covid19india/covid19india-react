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
  const [tweetIntent, setTweetIntent] = useState('');
  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios
        .get('https://api.covid19india.org/data.json')
        .then((response) => {
          setStates(response.data.statewise);
          setTimeseries(response.data.cases_time_series);
          setLastUpdated(
              response.data.statewise[0].lastupdatedtime.slice(0, 15) +
            response.data.statewise[0].lastupdatedtime.slice(18),
          );
          setDeltas(response.data.key_values[0]);
          setFetched(true);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getSummaryData = () => {
    const totalData = states.find((state) => state.state === 'Total');

    const totalCases = totalData.confirmed;
    const totalActive = totalData.active;
    const totalDeaths = totalData.deaths;
    const totalRecovered = totalData.recovered;

    const totalLastUpdated = format(
        new Date(
            totalData.lastupdatedtime.slice(0, 15) +
          totalData.lastupdatedtime.slice(18),
        ),
        'dd/LL/yyyy',
    );
    const tweet = `SARS-COV-19(COVID-19) update%0D%0DTotal as on ${totalLastUpdated}%0DConfirmed: ${totalCases}%0DActive: ${totalActive}%0DRecovered: ${totalRecovered}%0DDeaths: ${totalDeaths}%0D%0DShared from`;
    setTweetIntent(tweet);
  };

  useEffect(() => {
    if (timeseries.length && states.length) {
      getSummaryData();
    }
  }, [timeseries, states]);

  return (
    <div className="Home">
      <div className="home-left">
        <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
          <h1>India COVID-19 Tracker</h1>
          <div className="header-mid">
            <a
              className="button"
              href="https://bit.ly/patientdb"
              target="_noblank"
            >
              <Icon.Database />
              <span>Crowdsourced Patient Database&nbsp;</span>
            </a>
            <div className="last-update">
              <h6>Last Reported Case</h6>
              <h3>
                {lastUpdated.length === 0 ?
                  '' :
                  formatDistance(
                      zonedTimeToUtc(new Date(lastUpdated), 'Asia/Calcutta'),
                      zonedTimeToUtc(new Date()),
                  ) + ' Ago'}
              </h3>
              <div className="tweetButton">
                <a
                  href={`https://twitter.com/intent/tweet?text=${tweetIntent}&ref_src=twsrc%5Etfw`}
                  className="twitter-share-button"
                  data-show-count="false"
                >
                Tweet
                </a>
              </div>
            </div>
          </div>

          <a
            href="https://t.me/covid19indiaops"
            className="button telegram"
            target="_noblank"
          >
            <Icon.MessageCircle />
            <span>Join Telegram to Collaborate!</span>
          </a>
        </div>

        <Level data={states} deltas={deltas} />
        <Minigraph timeseries={timeseries} animate={true} />

        <Table states={states} summary={false} />
      </div>

      <div className="home-right">
        <ChoroplethMap states={states} />

        <div
          className="timeseries-header fadeInUp"
          style={{animationDelay: '1.5s'}}
        >
          <h1>Spread Trends</h1>
          <div className="tabs">
            <div
              className={`tab ${graphOption === 1 ? 'focused' : ''}`}
              onClick={() => {
                setGraphOption(1);
              }}
            >
              <h4>Cumulative</h4>
            </div>
            <div
              className={`tab ${graphOption === 2 ? 'focused' : ''}`}
              onClick={() => {
                setGraphOption(2);
              }}
            >
              <h4>Daily</h4>
            </div>
          </div>
        </div>

        <TimeSeries timeseries={timeseries} type={graphOption} />
      </div>
    </div>
  );
}

export default Home;
