import React, {useState, useEffect, useMemo} from 'react';
import {formatDistance} from 'date-fns';
import useStates from './../hooks/useStates';
import {formatDate, formatDateAbsolute} from '../utils/common-functions';
import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [graphOption, setGraphOption] = useState(1);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
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
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  const lastUpdatedPhrase = useMemo(() => {
    return isNaN(Date.parse(formatDate(lastUpdated)))
      ? ''
      : formatDistance(new Date(formatDate(lastUpdated)), new Date()) + ' Ago';
  }, [lastUpdated]);
  const lastUpdatedAbsolutePhrase = useMemo(() => {
    return isNaN(Date.parse(formatDate(lastUpdated)))
      ? ''
      : formatDateAbsolute(lastUpdated);
  }, [lastUpdated]);
  const onHighlightState = (state, index) => {
    if (!state && !index) setRegionHighlighted(null);
    else setRegionHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) setRegionHighlighted(null);
    else setRegionHighlighted({district, state, index});
  };

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
                {lastUpdatedPhrase}
              </h6>
              <h6 style={{color: '#28a745', fontWeight: 600}}>
                {lastUpdatedAbsolutePhrase}
              </h6>
            </div>
          </div>
        </div>
        <Level data={states} deltas={deltas} />
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
        {didFetchStates && (
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
        {error && <div>Something went wrong</div>}
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
    */}
      <div className="home-right"></div>
    </div>
  );
}

export default Home;
