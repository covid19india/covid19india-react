import Clusters from './clusters';
import DeltaBarGraph from './deltabargraph';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import TimeSeries from './timeseries';

import {MAP_META, STATE_CODES} from '../constants';
import {
  formatDateAbsolute,
  formatNumber,
  mergeTimeseries,
  parseStateTimeseries,
  parseStateTestTimeseries,
} from '../utils/commonfunctions';

import {Breadcrumb, Dropdown} from '@primer/components';
import anime from 'animejs';
import axios from 'axios';
import {format, parse} from 'date-fns';
import React, {useRef, useState} from 'react';
import * as Icon from 'react-feather';
import {Link, useParams} from 'react-router-dom';
import {useLocalStorage} from 'react-use';
import {useMeasure, useEffectOnce} from 'react-use';

function State(props) {
  const mapRef = useRef();
  const tsRef = useRef();

  const {stateCode} = useParams();
  const [allStateData, setAllStateData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState({});
  const [graphOption, setGraphOption] = useState(1);
  const [timeseriesMode, setTimeseriesMode] = useLocalStorage(
    'timeseriesMode',
    true
  );
  const [timeseriesLogMode, setTimeseriesLogMode] = useLocalStorage(
    'timeseriesLogMode',
    false
  );
  const [stateData, setStateData] = useState({});
  const [testData, setTestData] = useState({});
  const [sources, setSources] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [stateName] = useState(STATE_CODES[stateCode]);
  const [mapOption, setMapOption] = useState('confirmed');
  const [mapSwitcher, {width}] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  useEffectOnce(() => {
    getState(stateCode);
  });

  const getState = async (code) => {
    try {
      const [
        {data: dataResponse},
        {data: stateDistrictWiseResponse},
        {data: statesDailyResponse},
        {data: stateTestResponse},
        {data: sourcesResponse},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
        axios.get('https://api.covid19india.org/sources_list.json'),
      ]);
      const name = STATE_CODES[code];

      const states = dataResponse.statewise;
      setAllStateData(
        states.filter(
          (state) => state.statecode !== code && STATE_CODES[state.statecode]
        )
      );
      setStateData(states.find((s) => s.statecode === code));
      // Timeseries
      const ts = parseStateTimeseries(statesDailyResponse)[code];
      const testTs = parseStateTestTimeseries(
        stateTestResponse.states_tested_data
      )[code];
      // Merge
      const tsMerged = mergeTimeseries({[code]: ts}, {[code]: testTs});
      setTimeseries(tsMerged[code]);
      // District data
      setDistrictData({
        [name]: stateDistrictWiseResponse[name],
      });
      const sourceList = sourcesResponse.sources_list;
      setSources(sourceList.filter((state) => state.statecode === code));

      const statesTests = stateTestResponse.states_tested_data;
      setTestData(
        statesTests.filter(
          (obj) => obj.state === name && obj.totaltested !== ''
        )
      );
      setFetched(true);
      anime({
        targets: '.highlight',
        duration: 200,
        delay: 3000,
        translateX:
          mapOption === 'confirmed'
            ? `${width * 0}px`
            : mapOption === 'active'
            ? `${width * 0.25}px`
            : mapOption === 'recovered'
            ? `${width * 0.5}px`
            : mapOption === 'deceased'
            ? `${width * 0.75}px`
            : '0px',
        easing: 'spring(1, 80, 90, 10)',
        opacity: 1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const testObjLast = testData[testData.length - 1];

  function toggleShowAllDistricts() {
    setShowAllDistricts(!showAllDistricts);
  }

  return (
    <React.Fragment>
      <div className="State">
        <div className="state-left">
          <div className="breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Dropdown direction="w">
                <summary>
                  <Breadcrumb.Item href={`${stateCode}`} selected>
                    {stateName}
                  </Breadcrumb.Item>
                  <Dropdown.Caret className="caret" />
                </summary>
                {fetched && (
                  <Dropdown.Menu direction="se">
                    {allStateData.map((state) => (
                      <Dropdown.Item key={state.statecode} className="item">
                        <Link to={`${state.statecode}`}>
                          {STATE_CODES[state.statecode]}
                        </Link>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
              </Dropdown>
            </Breadcrumb>
          </div>

          <div className="header">
            <div
              className="header-left fadeInUp"
              style={{animationDelay: '0.3s'}}
            >
              <h1>{stateName}</h1>
              <h5>
                Last Updated on{' '}
                {Object.keys(stateData).length
                  ? formatDateAbsolute(stateData.lastupdatedtime)
                  : ''}
              </h5>
            </div>

            <div
              className="header-right fadeInUp"
              style={{animationDelay: '0.5s'}}
            >
              <h5>Tested</h5>
              <h2>{formatNumber(testObjLast?.totaltested)}</h2>
              <h5 className="timestamp">
                {!isNaN(parse(testObjLast?.updatedon, 'dd/MM/yyyy', new Date()))
                  ? `As of ${format(
                      parse(testObjLast?.updatedon, 'dd/MM/yyyy', new Date()),
                      'dd MMM'
                    )}`
                  : ''}
              </h5>
              <h5>
                {'per '}
                {testObjLast?.totaltested && (
                  <a href={testObjLast.source} target="_noblank">
                    source
                  </a>
                )}
              </h5>
            </div>
          </div>

          {fetched && (
            <div className="map-switcher" ref={mapSwitcher}>
              <div
                className={`highlight ${mapOption}`}
                style={{
                  transform: `translateX(${width * 0}px)`,
                  opacity: 0,
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('confirmed');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('active');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.25}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('recovered');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.5}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('deceased');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.75}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
            </div>
          )}

          {fetched && <Level data={stateData} />}
          {fetched && <Minigraph timeseries={timeseries} />}
          {fetched && (
            <React.Fragment>
              {
                <MapExplorer
                  forwardRef={mapRef}
                  mapMeta={MAP_META[stateName]}
                  states={[stateData]}
                  stateDistrictWiseData={districtData}
                  stateTestData={testData}
                  isCountryLoaded={false}
                  mapOptionProp={mapOption}
                />
              }
            </React.Fragment>
          )}

          {fetched && (
            <div className="meta-secondary">
              <div className="unknown">
                <Icon.AlertCircle />
                <div className="unknown-right">
                  Awaiting district details for{' '}
                  {districtData[stateName]?.districtData['Unknown']
                    ?.confirmed || '0'}{' '}
                  cases
                </div>
              </div>
              <div className="sources">
                <Icon.Compass />
                <div className="sources-right">
                  Data collected from sources{' '}
                  {sources.length > 0
                    ? Object.keys(sources[0]).map((key, index) => {
                        if (key.match('source') && sources[0][key] !== '') {
                          const num = key.match(/\d+/);
                          return (
                            <React.Fragment key={index}>
                              {num > 1 ? ',' : ''}
                              <a href={sources[0][key]}>{num}</a>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })
                    : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="state-right">
          {fetched && (
            <React.Fragment>
              <div
                className="district-bar"
                style={!showAllDistricts ? {display: 'flex'} : {}}
              >
                <div
                  className="district-bar-left fadeInUp"
                  style={{animationDelay: '0.6s'}}
                >
                  <h2>Top districts</h2>
                  <div
                    className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
                  >
                    {districtData[stateName]
                      ? Object.keys(districtData[stateName].districtData)
                          .filter((d) => d !== 'Unknown')
                          .sort(
                            (a, b) =>
                              districtData[stateName].districtData[b]
                                .confirmed -
                              districtData[stateName].districtData[a].confirmed
                          )
                          .slice(0, showAllDistricts ? undefined : 5)
                          .map((district, index) => {
                            return (
                              <div key={index} className="district">
                                <h2>
                                  {
                                    districtData[stateName].districtData[
                                      district
                                    ].confirmed
                                  }
                                </h2>
                                <h5>{district}</h5>
                                <div className="delta">
                                  <Icon.ArrowUp />
                                  <h6>
                                    {
                                      districtData[stateName].districtData[
                                        district
                                      ].delta.confirmed
                                    }
                                  </h6>
                                </div>
                              </div>
                            );
                          })
                      : ''}
                  </div>
                  <button className="button" onClick={toggleShowAllDistricts}>
                    {showAllDistricts ? `View less` : `View all`}
                  </button>
                </div>
                <div className="district-bar-right">
                  {
                    <DeltaBarGraph
                      timeseries={timeseries.slice(-5)}
                      arrayKey={'dailyconfirmed'}
                    />
                  }
                </div>
              </div>

              {false && (
                <Link to="/essentials">
                  <div
                    className="to-essentials fadeInUp"
                    style={{animationDelay: '0.9s'}}
                  >
                    <h2>Go to essentials</h2>
                    <Icon.ArrowRightCircle />
                  </div>
                </Link>
              )}

              <div className="TimeSeriesExplorer">
                <div
                  className="timeseries-header fadeInUp"
                  style={{animationDelay: '2.5s'}}
                  ref={tsRef}
                >
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
                </div>

                <TimeSeries
                  timeseries={timeseries}
                  type={graphOption}
                  mode={timeseriesMode}
                  logMode={timeseriesLogMode}
                />
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="state-left">
          <div className="Clusters fadeInUp" style={{animationDelay: '0.8s'}}>
            <h1>Network of Transmission</h1>
            <Clusters stateCode={stateCode} />
          </div>
        </div>

        <div className="state-right"></div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default React.memo(State);
