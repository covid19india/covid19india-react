import axios from 'axios';
import {format, parse} from 'date-fns';
import React, {useState, useEffect} from 'react';
// import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Link} from 'react-router-dom';

import {formatNumber, parseStateTimeseries} from '../utils/common-functions';
import {STATE_CODES} from '../constants';

import Level from './level';
import Minigraph from './minigraph';

function State(props) {
  // const [data, setData] = useState(props.data);
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState({});
  const [stateData, setStateData] = useState({});
  const [testData, setTestData] = useState({});
  // const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  // const [stateTestData, setStateTestData] = useState({});
  // const [timeseriesMode, setTimeseriesMode] = useState(true);
  // const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);

  // Assuming routing is already handled, this would always correspond to a state code
  const stateCode = window.location.pathname.split('/').pop().toUpperCase();
  const stateName = STATE_CODES[stateCode];

  useEffect(() => {
    if (fetched === false) {
      getState(stateCode);
    }
  }, [fetched, stateCode]);

  const getState = async (code) => {
    try {
      const [
        {data: dataResponse},
        // stateDistrictWiseResponse,
        {data: statesDailyResponse},
        {data: stateTestResponse},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        // axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);
      const states = dataResponse.statewise;
      setStateData(states.find((s) => s.statecode === code));
      const ts = parseStateTimeseries(statesDailyResponse)[code];
      setTimeseries(ts);
      // setLastUpdated(response.data.statewise[0].lastupdatedtime);
      const statesTests = stateTestResponse.states_tested_data.reverse();
      const name = STATE_CODES[code];
      setTestData(
        statesTests.find((obj) => obj.state === name && obj.totaltested !== '')
      );
      // setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <div className="State">
        <div className="state-left">
          <div className="breadcrumb fadeInUp">
            <Link to="/">Home</Link>/
            <Link to={`${stateCode}`}>{stateName}</Link>
          </div>
          <div className="header">
            <div
              className="header-left fadeInUp"
              style={{animationDelay: '0.3s'}}
            >
              <h1>{stateName}</h1>
              <h5>11 Apr, 04:32 IST</h5>
            </div>
            <div
              className="header-right fadeInUp"
              style={{animationDelay: '0.5s'}}
            >
              <h5>Tested</h5>
              <h2>{formatNumber(testData?.totaltested)}</h2>
              <h5 className="timestamp">
                {!isNaN(parse(testData?.updatedon, 'dd/MM/yyyy', new Date()))
                  ? `As of ${format(
                      parse(testData?.updatedon, 'dd/MM/yyyy', new Date()),
                      'dd MMM'
                    )}`
                  : ''}
              </h5>
              <h5>
                {'per '}
                {testData?.totaltested && (
                  <a href={testData.source} target="_noblank">
                    source
                  </a>
                )}
              </h5>
            </div>
          </div>

          {fetched && <Level data={stateData} />}
          {fetched && <Minigraph timeseries={timeseries} />}
        </div>
        <div className="state-right">{/* map*/}</div>
      </div>
    </React.Fragment>
  );
}

export default State;
