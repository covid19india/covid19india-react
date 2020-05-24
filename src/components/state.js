import DeltaBarGraph from './deltabargraph';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import StateMeta from './statemeta';
import TimeSeriesExplorer from './timeseriesexplorer';

import {STATE_CODES, STATE_POPULATIONS, INITIAL_DATA} from '../constants';
import {formatDateAbsolute, formatNumber} from '../utils/commonfunctions';

import Breadcrumb from '@primer/components/lib/Breadcrumb';
import Dropdown from '@primer/components/lib/Dropdown';
import anime from 'animejs';
import axios from 'axios';
import {format, parse} from 'date-fns';
import React, {useState} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {Link, useParams, Redirect} from 'react-router-dom';
import {useMeasure, useEffectOnce} from 'react-use';
import useSWR from 'swr';

const fetcher = (url) => axios(url).then((response) => response.data);

function PureBreadcrumbs({stateName, stateCode, stateCodes}) {
  const {t} = useTranslation();

  return (
    <div className="breadcrumb">
      <Breadcrumb>
        <Breadcrumb.Item href="/">{t('Home')}</Breadcrumb.Item>
        <Dropdown direction="w">
          <summary>
            <Breadcrumb.Item href={`${stateCode}`} selected>
              {t(stateName)}
            </Breadcrumb.Item>
            <Dropdown.Caret className="caret" />
          </summary>
          <Dropdown.Menu direction="se">
            {stateCodes.map((stateCode) => (
              <Dropdown.Item key={stateCode} className="item">
                <Link to={`${stateCode}`}>{t(STATE_CODES[stateCode])}</Link>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Breadcrumb>
    </div>
  );
}

const Breadcrumbs = React.memo(PureBreadcrumbs);

function State(props) {
  const stateCode = useParams().stateCode.toUpperCase();
  const stateName = STATE_CODES[stateCode];

  const [mapOption, setMapOption] = useState('confirmed');
  const [mapSwitcher, {width}] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    state: stateName,
  });

  const {t} = useTranslation();

  useEffectOnce(() => {
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
  });

  const {data} = useSWR(
    'https://api.covid19india.org/v2/data.min.json',
    fetcher,
    {
      initialData: INITIAL_DATA,
      suspense: true,
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
      compare: (dataA, dataB) => {
        return dataA['TT'].last_updated - dataB['TT'].last_updated;
      },
    }
  );

  const population = STATE_POPULATIONS[stateName];

  const toggleShowAllDistricts = () => {
    setShowAllDistricts(!showAllDistricts);
  };

  const getGridRowCount = () => {
    const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
    const districtCount = Object.keys(data[stateCode].districts).length;
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
              {...{stateCode, stateName}}
              stateCodes={Object.keys(data)}
            />

            <div className="header">
              <div className="header-left">
                <h1>{t(stateName)}</h1>
                <h5>Last Updated on {data[stateCode].last_updated}</h5>
              </div>

              <div className="header-right">
                <h5>{t('Tested')}</h5>
                <h2>{formatNumber(data[stateCode].total.tested.samples)}</h2>
                <h5 className="timestamp">
                  {data[stateCode].total.tested.last_updated}
                </h5>
                <h5>
                  {'per '}
                  <a
                    href={data[stateCode].total.tested.source}
                    target="_noblank"
                  >
                    source
                  </a>
                </h5>
              </div>
            </div>

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

            <Level data={data[stateCode]} />
            <Minigraph timeseries={data[stateCode].timeseries} />

            {/*
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
            )*/}
            {/* fetched && (
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
            )*/}
            {/* fetched && (
              <StateMeta
                stateData={stateData[0]}
                population={population}
                lastSevenDaysData={timeseries.slice(-7)}
                totalData={allStateData.filter(
                  (state) => state.statecode === 'TT'
                )}
              />
            )*/}
          </div>

          <div className="state-right">
            <React.Fragment>
              {/*<div
                className="district-bar"
                style={!showAllDistricts ? {display: 'flex'} : {}}
              >
                <div
                  className="district-bar-left fadeInUp"
                  style={{animationDelay: '0.6s'}}
                >
                  <h2 className={mapOption}>Top districts</h2>
                  <div
                    className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
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
                            return districtB[mapOption] - districtA[mapOption];
                          })
                          .slice(0, showAllDistricts ? undefined : 5)
                          .map((district, index) => {
                            const cases =
                              districtData[stateName].districtData[district];
                            return (
                              <div key={index} className="district">
                                <h2>{cases[mapOption]}</h2>
                                <h5>{t(district)}</h5>
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
                  {(mapOption === 'confirmed' || mapOption === 'deceased') && (
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
                      caseType={`daily${mapOption}`}
                    />
                  }
                </div>
              </div>*/}

              <TimeSeriesExplorer
                timeseries={data[stateCode].timeseries}
                activeStateCode={stateCode}
              />
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default React.memo(State);
