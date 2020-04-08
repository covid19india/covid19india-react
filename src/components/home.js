import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';
import {
  formatDate,
  formatDateAbsolute,
  validateCTS,
} from '../utils/common-functions';
import moment from 'moment';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';

import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  /* const [rawData, setRawData] = useState([]);*/
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [selectedState, setSelectedState] = useState({table: null, map: null});
  const [stateTimeSeries, setStateTimeSeries] = useState({});
  const [statesDailyData, setStatesDailyData] = useState([]);
  const [stateGraphTimeSeries, setStateGraphTimeSeries] = useState({
    series: [],
    state: '',
  });

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  useEffect(() => {
    if (regionHighlighted !== undefined && regionHighlighted !== null) {
      if (regionHighlighted.state.state !== selectedState.table)
        setSelectedState({
          ...selectedState,
          table: regionHighlighted.state.state,
        });
    } else {
      if (selectedState.table !== undefined && selectedState.table !== null) {
        setSelectedState({
          ...selectedState,
          table: regionHighlighted,
        });
      }
      // if (selectedState !== 'India') setSelectedState('India');
    }
  }, [regionHighlighted, selectedState]);

  const getStates = async () => {
    try {
      const [
        response,
        stateDistrictWiseResponse,
        statesDailyResponse,
        updateLogResponse,
        stateTestResponse,
        /* rawDataResponse, */
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/updatelog/log.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);
      setStates(response.data.statewise);
      setTimeseries(validateCTS(response.data.cases_time_series));
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setStatesDailyData(statesDailyResponse.data.states_daily);
      setActivityLog(updateLogResponse.data);
      /* setPatients(rawDataResponse.data.raw_data.filter((p) => p.detectedstate));*/
      /* setRawData(rawDataResponse.data.raw_data);*/
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const calculateStatewiseTimeSeries = (data) => {
      const statewiseSeries = {};
      data.forEach((d) => {
        const date = moment(d.date, 'DD-MMM-YY').format('YYYY-MM-DD');
        const status = d.status.toLowerCase();
        states.forEach((st) => {
          const code = st.statecode.toLowerCase();
          const name = st.state;
          if (statewiseSeries[name] === undefined) {
            statewiseSeries[name] = {};
          }
          if (statewiseSeries[name][date] === undefined) {
            statewiseSeries[name][date] = {};
          }
          if (statewiseSeries[name][date][status] === undefined) {
            statewiseSeries[name][date][status] = parseInt(d[code] || 0);
          }
        });
      });
      setStateTimeSeries(statewiseSeries);
    };
    calculateStatewiseTimeSeries(statesDailyData);
  }, [states, statesDailyData]);

  const onHighlightState = (state, index) => {
    if (!state && !index) setRegionHighlighted(null);
    else setRegionHighlighted({state, index});
  };

  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) setRegionHighlighted(null);
    else setRegionHighlighted({district, state, index});
  };

  const onHighlightMapRegion = (data) => {
    if (
      data !== undefined &&
      data.state !== undefined &&
      (selectedState === undefined || data.state.state !== selectedState.map)
    ) {
      setSelectedState({
        ...selectedState,
        map: data.state.state,
      });
    }
  };

  useEffect(() => {
    const getTimeSeries = (selectData) => {
      let state = selectData.map;
      if (selectData.table !== undefined && selectData.table !== null) {
        state = selectData.table;
      }
      if (state === undefined || state === null || state === 'India') {
        setStateGraphTimeSeries({series: timeseries, state: 'India'});
        return;
      }
      const series = stateTimeSeries[state];
      if (!series) {
        return;
      }
      const resultSeries = [];
      const total = {confirmed: 0, recovered: 0, deceased: 0};
      let dateStr = '2020-01-30';
      let date = moment(dateStr);
      const today = moment().format('YYYY-MM-DD');
      while (dateStr !== today) {
        const dayData = {
          confirmed: (series[dateStr] || {}).confirmed || 0,
          recovered: (series[dateStr] || {}).recovered || 0,
          deceased: (series[dateStr] || {}).deceased || 0,
        };
        total.confirmed += dayData.confirmed;
        total.recovered += dayData.recovered;
        total.deceased += dayData.deceased;
        resultSeries.push({
          dailyconfirmed: dayData.confirmed,
          dailydeceased: dayData.deceased,
          dailyrecovered: dayData.recovered,
          date: date.format('DD MMMM '),
          totalconfirmed: total.confirmed,
          totaldeceased: total.deceased,
          totalrecovered: total.recovered,
        });

        date = date.add(1, 'days');
        dateStr = date.format('YYYY-MM-DD');
      }
      // console.log(state, stateTimeSeries[state], resultSeries);
      setStateGraphTimeSeries({
        series: validateCTS(resultSeries),
        state: state,
      });
    };
    getTimeSeries(selectedState);
  }, [selectedState, stateTimeSeries, timeseries]);

  return (
    <React.Fragment>
      <div className="Home">
        <div className="home-left">
          <div className="header fadeInUp" style={{animationDelay: '1s'}}>
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
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <MapExplorer
                states={states}
                stateDistrictWiseData={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                setMapRegionHighlighted={onHighlightMapRegion}
              />

              <div
                className="timeseries-header fadeInUp"
                style={{animationDelay: '2.3s'}}
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
                stateName={stateGraphTimeSeries.state}
                timeseries={stateGraphTimeSeries.series}
                key={'main'}
                type={graphOption}
                mode={timeseriesMode}
                logMode={timeseriesLogMode}
              />
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
                expand={true}
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

      <div className="Home">
        <div className="home-left">
          <div
            className="updates-header fadeInUp"
            style={{animationDelay: '1.5s'}}
          >
            <h1>Updates</h1>
            <h2>{format(new Date(), 'd MMM')}</h2>
          </div>

          <div className="updates fadeInUp" style={{animationDelay: '1.7s'}}>
            {activityLog
              .slice(-5)
              .reverse()
              .map(function (activity, index) {
                activity.update = activity.update.replace('\n', '<br/>');
                return (
                  <div key={index} className="update">
                    <h5>
                      {formatDistance(
                        new Date(activity.timestamp * 1000),
                        new Date()
                      ) + ' Ago'}
                    </h5>
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: activity.update,
                      }}
                    ></h4>
                  </div>
                );
              })}
            <button className="button">
              <Link to="/demographics">
                <Icon.Database />
                <span>Demographic Overview</span>
              </Link>
            </button>
          </div>
        </div>

        <div className="home-right"></div>
      </div>
    </React.Fragment>
  );
}

export default Home;
