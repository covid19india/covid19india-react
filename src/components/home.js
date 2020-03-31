import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {formatDistance} from 'date-fns';
import {
  formatDate,
  formatDateAbsolute,
  validateCTS,
} from '../utils/common-functions';
/* import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';*/
import moment from 'moment';

import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';
/* import Patients from './patients';*/

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  /* const [patients, setPatients] = useState([]);*/
  const [fetched, setFetched] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [stateTimeSeries, setStateTimeSeries] = useState({});
  const [resultSeries, setresultSeries] = useState({series: [], state: ''});

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  useEffect(() => {
    calculateStatewiseTimeSeries(rawData);
  }, [rawData]);

  const getStates = async () => {
    try {
      const [
        response,
        stateDistrictWiseResponse,
        rawDataResponse,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/raw_data.json'),
      ]);
      setStates(response.data.statewise);
      setTimeseries(validateCTS(response.data.cases_time_series));
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      /* setPatients(rawDataResponse.data.raw_data.filter((p) => p.detectedstate));*/
      setRawData(rawDataResponse.data.raw_data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateStatewiseTimeSeries = (data) => {
    // console.log(data);
    const filteredData = data.filter((r) => r.dateannounced !== '');
    const statewiseSeries = {};
    filteredData.forEach((d) => {
      const st = d.detectedstate;
      if (statewiseSeries[st] === undefined) {
        statewiseSeries[st] = {};
      }
      const date = moment(d.dateannounced, 'DD/MM/YYYY').format('YYYY-MM-DD');
      if (statewiseSeries[st][date] === undefined) {
        statewiseSeries[st][date] = 1;
      } else {
        statewiseSeries[st][date] += 1;
      }
    });
    // console.log(statewiseSeries);
    // console.log(filteredData);
    setStateTimeSeries(statewiseSeries);
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) setRegionHighlighted(null);
    else setRegionHighlighted({state, index});
  };

  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) setRegionHighlighted(null);
    else setRegionHighlighted({district, state, index});
  };

  const getTimeSeries = useCallback(
    (data) => {
      if (data === undefined || data === null) {
        return [];
      }
      const state = data.state.state;
      const series = stateTimeSeries[state];
      const resultSeries = [];
      let total = 0;
      let dateStr = '2020-01-30';
      let date = moment(dateStr);
      const today = moment().format('YYYY-MM-DD');
      while (dateStr !== today) {
        const num = series[dateStr] || 0;
        total += num;
        resultSeries.push({
          dailyconfirmed: num,
          dailydeceased: 0,
          dailyrecovered: 0,
          date: date.format('DD MMMM '),
          totalconfirmed: total,
          totaldeceased: 0,
          totalrecovered: 0,
        });

        date = date.add(1, 'days');
        dateStr = date.format('YYYY-MM-DD');
      }
      console.log(state, stateTimeSeries[state], resultSeries);
      setresultSeries({series: resultSeries, state: state});
    },
    [stateTimeSeries]
  );

  useEffect(() => {
    getTimeSeries(regionHighlighted);
  }, [getTimeSeries, regionHighlighted]);

  return (
    <div className="Home">
      <div className="home-left">
        <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
          <div className="header-mid">
            <div className="titles">
              <h1>India COVID-19 Tracker</h1>
              <h6 style={{fontWeight: 600}}>A Crowdsourced Initiative</h6>
            </div>
            <div className="last-update">
              <h6>Last Updated</h6>
              <h6 style={{color: '#28a745', fontWeight: 600}}>
                {isNaN(Date.parse(formatDate(lastUpdated)))
                  ? ''
                  : formatDistance(
                      new Date(formatDate(lastUpdated)),
                      new Date()
                    ) + ' Ago'}
              </h6>
              <h6 style={{color: '#28a745', fontWeight: 600}}>
                {isNaN(Date.parse(formatDate(lastUpdated)))
                  ? ''
                  : formatDateAbsolute(lastUpdated)}
              </h6>
            </div>
          </div>
        </div>

        {states.length > 1 && <Level data={states} />}
        <Minigraph timeseries={timeseries} animate={true} />
        <Table
          states={states}
          summary={false}
          stateDistrictWiseData={stateDistrictWiseData}
          onHighlightState={onHighlightState}
          onHighlightDistrict={onHighlightDistrict}
        />
        <TimeSeries
          key={'state'}
          stateName={resultSeries.state}
          timeseries={resultSeries.series}
          confirmedOnly={true}
          update={1}
          type={graphOption}
          logMode={timeseriesLogMode}
          mode={timeseriesMode}
        />
      </div>

      <div className="home-right">
        {fetched && (
          <React.Fragment>
            <MapExplorer
              states={states}
              stateDistrictWiseData={stateDistrictWiseData}
              regionHighlighted={regionHighlighted}
            />

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

              <div className="scale-modes">
                <label>Scale Modes</label>
                <div className="timeseries-mode">
                  <label htmlFor="timeseries-mode">Uniform</label>
                  <input
                    type="checkbox"
                    checked={timeseriesMode}
                    className="switch"
                    aria-label="Checked by default to scale uniformly."
                    onChange={(event) => {
                      setTimeseriesMode(!timeseriesMode);
                    }}
                  />
                </div>
                <div
                  className={`timeseries-logmode ${
                    graphOption !== 1 ? 'disabled' : ''
                  }`}
                >
                  <label htmlFor="timeseries-logmode">Logarithmic</label>
                  <input
                    type="checkbox"
                    checked={graphOption === 1 && timeseriesLogMode}
                    className="switch"
                    disabled={graphOption !== 1}
                    onChange={(event) => {
                      setTimeseriesLogMode(!timeseriesLogMode);
                    }}
                  />
                </div>
              </div>
            </div>

            <TimeSeries
              timeseries={timeseries}
              type={graphOption}
              mode={timeseriesMode}
              logMode={timeseriesLogMode}
            />

            {/* Testing Rebuild*/}
          </React.Fragment>
        )}
      </div>

      {/* <div className="home-left">
        {patients.length > 1 && (
          <div className="patients-summary">
            <h1>Recent Cases</h1>
            <h6>A summary of the latest reported cases</h6>
            <div className="legend">
              <div className="legend-left">
                <div className="circle is-female"></div>
                <h5 className="is-female">Female</h5>
                <div className="circle is-male"></div>
                <h5 className="is-male">Male</h5>
                <div className="circle"></div>
                <h5 className="">Unknown</h5>
              </div>
            </div>
            <div className="patients-summary-wrapper">
              <Patients
                patients={patients}
                summary={true}
                colorMode={'genders'}
              />
            </div>
            <button className="button">
              <Link to="/database">
                <Icon.Database />
                <span>View the Patients Database</span>
              </Link>
            </button>
          </div>
        )}
      </div>
      <div className="home-right"></div>
    */}
    </div>
  );
}

export default Home;
