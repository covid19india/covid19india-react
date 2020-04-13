import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';
import * as Icon from 'react-feather';

import {
  formatDate,
  formatDateAbsolute,
  preprocessTimeseries,
  parseStateTimeseries,
} from '../utils/common-functions';
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
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [activityLog, setActivityLog] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [
        response,
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        updateLogResponse,
        stateTestResponse,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/updatelog/log.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);
      setStates(response.data.statewise);
      const ts = parseStateTimeseries(statesDailyResponse);
      ts['TT'] = preprocessTimeseries(response.data.cases_time_series); // TT -> India
      setTimeseries(ts);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setActivityLog(updateLogResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
  }, []);

  const refs = [useRef(), useRef(), useRef()];
  // const scrollHandlers = refs.map((ref) => () =>
  //   window.scrollTo({
  //     top: ref.current.offsetTop,
  //     behavior: 'smooth',
  //   })
  // );

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
          {fetched && <Minigraph timeseries={timeseries['TT']} />}
          {fetched && (
            <Table
              forwardRef={refs[0]}
              states={states}
              summary={false}
              stateDistrictWiseData={stateDistrictWiseData}
              onHighlightState={onHighlightState}
              onHighlightDistrict={onHighlightDistrict}
            />
          )}
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <MapExplorer
                forwardRef={refs[1]}
                states={states}
                stateDistrictWiseData={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                onMapHighlightChange={onMapHighlightChange}
              />

              <div
                className="timeseries-header fadeInUp"
                style={{animationDelay: '2.5s'}}
                ref={refs[2]}
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

                <div className="trends-state-name">
                  <select
                    onChange={({target}) => {
                      onHighlightState(JSON.parse(target.value));
                    }}
                  >
                    {states.map((s) => {
                      return (
                        <option
                          key={s.statecode}
                          value={JSON.stringify(s)}
                          selected={s.statecode === activeStateCode}
                        >
                          {s.state === 'Total' ? 'All States' : s.state}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <TimeSeries
                timeseries={timeseries[activeStateCode]}
                type={graphOption}
                mode={timeseriesMode}
                logMode={timeseriesLogMode}
              />
            </React.Fragment>
          )}
        </div>

        {/* <div className="floating-buttons">
          <button
            className="table-nav fadeInUp"
            onClick={scrollHandlers[0]}
            style={{animationDelay: '2.2s'}}
          >
            <Icon.Grid />
          </button>
          <button
            className="map-nav fadeInUp"
            onClick={scrollHandlers[1]}
            style={{animationDelay: '2.1s'}}
          >
            <Icon.MapPin />
          </button>
          <button
            className="trends-nav fadeInUp"
            onClick={scrollHandlers[2]}
            style={{animationDelay: '2s'}}
          >
            <Icon.TrendingUp />
          </button>
        </div> */}

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
