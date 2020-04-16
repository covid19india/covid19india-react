import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';

import {MAP_META} from '../constants';
import {
  formatDate,
  formatDateAbsolute,
  preprocessTimeseries,
  parseStateTimeseries,
} from '../utils/common-functions';
import * as Icon from 'react-feather';

import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';
import Updates from './updates';
import Search from './search';
import Footer from './footer';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [showUpdates, setShowUpdates] = useState(false);

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
        stateTestResponse,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);
      setStates(response.data.statewise);
      const ts = parseStateTimeseries(statesDailyResponse);
      ts['TT'] = preprocessTimeseries(response.data.cases_time_series); // TT -> India
      setTimeseries(ts);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
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
            <Search />
            <div className="actions">
              <h5>
                {isNaN(Date.parse(formatDate(lastUpdated)))
                  ? ''
                  : formatDateAbsolute(lastUpdated)}
              </h5>
              {!showUpdates && (
                <div className="bell-icon">
                  <Icon.Bell
                    onClick={() => {
                      setShowUpdates(!showUpdates);
                    }}
                  />
                  <div className="indicator"></div>
                </div>
              )}
              {showUpdates && (
                <Icon.BellOff
                  onClick={() => {
                    setShowUpdates(!showUpdates);
                  }}
                />
              )}
            </div>
          </div>

          {showUpdates && <Updates />}

          {states.length ? <Level data={states[0]} /> : ''}
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
                mapMeta={MAP_META.India}
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
                  <label className="main">Scale Modes</label>
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
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Home;
