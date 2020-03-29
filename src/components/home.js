import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {formatDistance} from 'date-fns';
import {formatDate} from '../utils/common-functions';
import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [stateHighlighted, setStateHighlighted] = useState(undefined);
  const [districtHighlighted, setDistrictHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [response, stateDistrictWiseResponse] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
      ]);
      setStates(response.data.statewise);
      setTimeseries(response.data.cases_time_series);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setDeltas(response.data.key_values[0]);
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) setStateHighlighted(null);
    else setStateHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) setDistrictHighlighted(null);
    else setDistrictHighlighted({district, state, index});
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
              <h6>Last Updated</h6>
              <h3>
                {isNaN(Date.parse(formatDate(lastUpdated)))
                  ? ''
                  : formatDistance(
                      new Date(formatDate(lastUpdated)),
                      new Date()
                    ) + ' Ago'}
              </h3>
            </div>
          </div>
        </div>

        <Level data={states} deltas={deltas} />
        <Minigraph timeseries={timeseries} animate={true} />

        <Table
          states={states}
          summary={false}
          onHighlightState={onHighlightState}
          stateDistrictWiseData={stateDistrictWiseData}
          onHighlightDistrict={onHighlightDistrict}
        />
      </div>

      <div className="home-right">
        {fetched && (
          <React.Fragment>
            <MapExplorer
              states={states}
              stateDistrictWiseData={stateDistrictWiseData}
              stateHighlighted={stateHighlighted}
              districtHighlighted={districtHighlighted}
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

              <div className="timeseries-mode">
                <label htmlFor="timeseries-mode">Scale Uniformly</label>
                <input
                  type="checkbox"
                  className="switch"
                  aria-label="Checked by default to scale uniformly."
                  checked={timeseriesMode}
                  onChange={(event) => {
                    setTimeseriesMode(!timeseriesMode);
                  }}
                />
              </div>
            </div>

            <TimeSeries
              timeseries={timeseries}
              type={graphOption}
              mode={timeseriesMode}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Home;
