import Clusters from './clusters';
import DeltaBarGraph from './deltabargraph';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import StateMeta from './statemeta';
import TimeSeriesExplorer from './timeseriesexplorer';

import {STATE_CODES, STATE_POPULATIONS} from '../constants';
import {
  formatDateAbsolute,
  formatNumber,
  mergeTimeseries,
  parseStateTimeseries,
  parseStateTestTimeseries,
  parseDistrictZones,
} from '../utils/commonfunctions';

import Breadcrumb from '@primer/components/lib/Breadcrumb';
import Dropdown from '@primer/components/lib/Dropdown';
import anime from 'animejs';
import axios from 'axios';
import {format, parse} from 'date-fns';
import React, {useState} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {Link, useParams, Redirect} from 'react-router-dom';
import {useMeasure, useEffectOnce} from 'react-use';

function PureBreadcrumbs({stateName, stateCode, fetched, allStateData}) {
  return (
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
  );
}

const Breadcrumbs = React.memo(PureBreadcrumbs);

function State(props) {
  const stateCode = useParams().stateCode.toUpperCase();
  const stateName = STATE_CODES[stateCode];

  const [allStateData, setAllStateData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [districtZones, setDistrictZones] = useState(null);
  const [timeseries, setTimeseries] = useState({});
  const [stateData, setStateData] = useState(null);
  const [testData, setTestData] = useState({});
  const [sources, setSources] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [mapOption, setMapOption] = useState('confirmed');
  const [mapSwitcher, {width}] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    state: stateName,
  });

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
        {data: zonesResponse},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
        axios.get('https://api.covid19india.org/sources_list.json'),
        axios.get('https://api.covid19india.org/zones.json'),
      ]);
      const name = STATE_CODES[code];

      const states = dataResponse.statewise;
      setAllStateData(states.filter((state) => state.statecode !== code));
      setStateData([states.find((s) => s.statecode === code)]);
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

      setDistrictZones(parseDistrictZones(zonesResponse.zones, stateName));

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
  const population = STATE_POPULATIONS[stateName];

  function toggleShowAllDistricts() {
    setShowAllDistricts(!showAllDistricts);
  }

  const getGridRowCount = () => {
    const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
    const districtCount =
      (districtData[stateName] &&
        Object.keys(districtData[stateName].districtData).length) ||
      0;
    const gridRowCount = Math.ceil(districtCount / gridColumnCount);
    return gridRowCount;
  };
  const gridRowCount = getGridRowCount();

  if (!stateName) {
    return <Redirect to="/" />;
  } else {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            Coronavirus Outbreak in {STATE_CODES[stateCode]} - covid19india.org
          </title>
          <meta
            name="title"
            content={`Coronavirus Outbreak in ${STATE_CODES[stateCode]}: Latest Map and Case Count`}
          />
        </Helmet>

        <div className="State">
          <div className="state-left">
            <Breadcrumbs
              stateName={stateName}
              stateCode={stateCode}
              fetched={fetched}
              allStateData={allStateData}
            />

            <div className="header">
              <div
                className="header-left fadeInUp"
                style={{animationDelay: '0.3s'}}
              >
                <h1>{stateName}</h1>
                <h5>
                  Last Updated on{' '}
                  {stateData && Object.keys(stateData[0]).length
                    ? formatDateAbsolute(stateData[0].lastupdatedtime)
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
                  {!isNaN(
                    parse(testObjLast?.updatedon, 'dd/MM/yyyy', new Date())
                  )
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

            {fetched && <Level data={stateData[0]} />}
            {fetched && <Minigraph timeseries={timeseries} />}
            {fetched && (
              <MapExplorer
                mapName={stateName}
                states={stateData}
                districts={districtData}
                zones={districtZones}
                stateTestData={testData}
                regionHighlighted={regionHighlighted}
                setRegionHighlighted={setRegionHighlighted}
                mapOption={mapOption}
                isCountryLoaded={false}
              />
            )}

            {fetched && (
              <div className="meta-secondary">
                <div className="alert">
                  <Icon.AlertCircle />
                  <div className="alert-right">
                    Awaiting district details for{' '}
                    {districtData[stateName]?.districtData['Unknown']
                      ?.confirmed || '0'}{' '}
                    cases
                  </div>
                </div>
                <div className="alert">
                  <Icon.Compass />
                  <div className="alert-right">
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

            {fetched && (
              <StateMeta
                stateData={stateData[0]}
                lastTestObject={testObjLast}
                population={population}
                lastSevenDaysData={timeseries.slice(-7)}
                totalData={allStateData.filter(
                  (state) => state.statecode === 'TT'
                )}
              />
            )}

            {fetched && (
              <div
                className="Clusters fadeInUp"
                style={{animationDelay: '0.8s'}}
              >
                <h1>Network of Transmission</h1>
                <Clusters stateCode={stateCode} />
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
                    <h2 className={mapOption}>Top districts</h2>
                    <div
                      className={`districts ${
                        showAllDistricts ? 'is-grid' : ''
                      }`}
                      style={
                        showAllDistricts
                          ? {gridTemplateRows: `repeat(${gridRowCount}, 2rem)`}
                          : {}
                      }
                    >
                      {districtData[stateName]
                        ? Object.keys(districtData[stateName].districtData)
                            .filter((d) => d !== 'Unknown')
                            .sort((a, b) => {
                              const districtB =
                                districtData[stateName].districtData[b];
                              const districtA =
                                districtData[stateName].districtData[a];
                              return (
                                districtB[mapOption] - districtA[mapOption]
                              );
                            })
                            .slice(0, showAllDistricts ? undefined : 5)
                            .map((district, index) => {
                              const cases =
                                districtData[stateName].districtData[district];
                              return (
                                <div key={index} className="district">
                                  <h2>{cases[mapOption]}</h2>
                                  <h5>{district}</h5>
                                  {mapOption !== 'active' && (
                                    <div className="delta">
                                      <Icon.ArrowUp className={mapOption} />
                                      <h6 className={mapOption}>
                                        {cases.delta[mapOption]}
                                      </h6>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                        : ''}
                    </div>
                    {districtData[stateName] &&
                      Object.keys(districtData[stateName].districtData).length >
                        5 && (
                        <button
                          className="button"
                          onClick={toggleShowAllDistricts}
                        >
                          {showAllDistricts ? `View less` : `View all`}
                        </button>
                      )}
                  </div>
                  <div className="district-bar-right">
                    {(mapOption === 'confirmed' ||
                      mapOption === 'deceased') && (
                      <div
                        className="happy-sign fadeInUp"
                        style={{animationDelay: '0.6s'}}
                      >
                        {timeseries
                          .slice(-5)
                          .every((day) => day[`daily${mapOption}`] === 0) && (
                          <div
                            className={`alert ${
                              mapOption === 'confirmed' ? 'is-green' : ''
                            }`}
                          >
                            <Icon.Smile />
                            <div className="alert-right">
                              No new {mapOption} cases in the past five days
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {
                      <DeltaBarGraph
                        timeseries={timeseries.slice(-5)}
                        arrayKey={`daily${mapOption}`}
                      />
                    }
                  </div>
                </div>
                <TimeSeriesExplorer timeseries={timeseries} />
              </React.Fragment>
            )}
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default React.memo(State);
