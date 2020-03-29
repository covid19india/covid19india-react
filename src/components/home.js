import React, {useState, useEffect, useMemo} from 'react';
import {formatDistance} from 'date-fns';
import useStates from './../hooks/useStates';
import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [graphOption, setGraphOption] = useState(1);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [stateHighlighted, setStateHighlighted] = useState(undefined);
  const {
    fetchStates,
    didFetchStates,
    error,
    states,
    stateDistrictWiseData,
    deltas,
    lastUpdated,
    timeseries,
  } = useStates();
  useEffect(() => {
    fetchStates();
  }, []);
  const formatDate = (unformattedDate) => {
    const day = unformattedDate.slice(0, 2);
    const month = unformattedDate.slice(3, 5);
    const year = unformattedDate.slice(6, 10);
    const time = unformattedDate.slice(11);
    return `${year}-${month}-${day}T${time}+05:30`;
  };
  const lastUpdatedPhrase = useMemo(() => {
    return isNaN(Date.parse(formatDate(lastUpdated)))
      ? ''
      : formatDistance(new Date(formatDate(lastUpdated)), new Date()) + ' Ago';
  });

  const onHighlightState = (state, index) => {
    if (!state && !index) setStateHighlighted(null);
    else setStateHighlighted({state, index});
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
              <h3>{lastUpdatedPhrase}</h3>
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
        />
      </div>

      <div className="home-right">
        {didFetchStates && (
          <React.Fragment>
            <MapExplorer
              states={states}
              stateDistrictWiseData={stateDistrictWiseData}
              stateHighlighted={stateHighlighted}
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
        {error && <div>Something went wrong</div>}
      </div>
    </div>
  );
}

export default Home;
