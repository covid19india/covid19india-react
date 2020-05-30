import DeltaBarGraph from './deltabargraph';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import StateMeta from './statemeta';
import TimeSeriesExplorer from './timeseriesexplorer';

import {STATE_NAMES, STATE_POPULATIONS} from '../constants';
import {
  formatDateAbsolute,
  formatNumber,
  getStatistic,
} from '../utils/commonfunctions';

import Breadcrumb from '@primer/components/lib/Breadcrumb';
import Dropdown from '@primer/components/lib/Dropdown';
import anime from 'animejs';
import axios from 'axios';
import {format, parse} from 'date-fns';
import React, {useState, useMemo} from 'react';
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
                <Link to={`${stateCode}`}>{t(STATE_NAMES[stateCode])}</Link>
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
  const stateName = STATE_NAMES[stateCode];

  const [mapStatistic, setMapStatistic] = useState('confirmed');
  const [mapSwitcher, {width}] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: stateCode,
    districtName: null,
  });

  const {t} = useTranslation();

  useEffectOnce(() => {
    anime({
      targets: '.highlight',
      duration: 200,
      delay: 3000,
      translateX:
        mapStatistic === 'confirmed'
          ? `${width * 0}px`
          : mapStatistic === 'active'
          ? `${width * 0.25}px`
          : mapStatistic === 'recovered'
          ? `${width * 0.5}px`
          : mapStatistic === 'deceased'
          ? `${width * 0.75}px`
          : '0px',
      easing: 'spring(1, 80, 90, 10)',
      opacity: 1,
    });
  });

  const {data: timeseries} = useSWR(
    'https://api.covid19india.org/v3/min/timeseries.min.json',
    fetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
    }
  );

  const {data} = useSWR(
    'https://api.covid19india.org/v3/min/data.min.json',
    fetcher,
    {
      suspense: true,
      revalidateOnMount: true,
      refreshInterval: 100000,
      revalidateOnFocus: false,
    }
  );

  const population = STATE_POPULATIONS[stateName];

  const toggleShowAllDistricts = () => {
    setShowAllDistricts(!showAllDistricts);
  };

  const handleSort = (districtNameA, districtNameB) => {
    const districtA = data[stateCode].districts[districtNameA];
    const districtB = data[stateCode].districts[districtNameB];
    return districtB[mapStatistic] - districtA[mapStatistic];
  };

  const gridRowCount = useMemo(() => {
    const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
    const districtCount = data[stateCode]?.districts
      ? Object.keys(data[stateCode].districts).length
      : 0;
    const gridRowCount = Math.ceil(districtCount / gridColumnCount);
    return gridRowCount;
  }, [data, stateCode]);

  if (!stateName) {
    return <Redirect to="/" />;
  } else {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            Coronavirus Outbreak in {STATE_NAMES[stateCode]} - covid19india.org
          </title>
          <meta
            name="title"
            content={`Coronavirus Outbreak in ${STATE_NAMES[stateCode]}: Latest Map and Case Count`}
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
                <h5>Last Updated on {data[stateCode].meta.last_updated}</h5>
              </div>

              <div className="header-right">
                <h5>{t('Tested')}</h5>
                {data[stateCode]?.total?.tested && (
                  <React.Fragment>
                    <h2>{formatNumber(data[stateCode].total.tested)}</h2>
                    <h5 className="timestamp">
                      {`As of ${data[stateCode].meta.tested.last_updated}`}
                    </h5>
                    <h5>
                      {'per '}
                      <a
                        href={data[stateCode].meta.tested.source}
                        target="_noblank"
                      >
                        source
                      </a>
                    </h5>
                  </React.Fragment>
                )}
              </div>
            </div>

            <div className="map-switcher" ref={mapSwitcher}>
              <div
                className={`highlight ${mapStatistic}`}
                style={{
                  transform: `translateX(${width * 0}px)`,
                  opacity: 0,
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapStatistic('confirmed');
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
                  setMapStatistic('active');
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
                  setMapStatistic('recovered');
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
                  setMapStatistic('deceased');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.75}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
            </div>

            <Level data={data[stateCode]} />
            <Minigraph timeseries={timeseries[stateCode]} />

            <MapExplorer
              mapName={stateName}
              isCountryLoaded={false}
              {...{
                data,
                regionHighlighted,
                setRegionHighlighted,
                mapStatistic,
                setMapStatistic,
              }}
            />
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
              <div
                className="district-bar"
                style={!showAllDistricts ? {display: 'flex'} : {}}
              >
                <div
                  className="district-bar-left fadeInUp"
                  style={{animationDelay: '0.6s'}}
                >
                  <h2 className={mapStatistic}>Top districts</h2>
                  <div
                    className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
                    style={
                      showAllDistricts
                        ? {gridTemplateRows: `repeat(${gridRowCount}, 2rem)`}
                        : {}
                    }
                  >
                    {Object.keys(data[stateCode].districts)
                      .filter((districtName) => districtName !== 'Unknown')
                      .sort((a, b) => handleSort(a, b))
                      .slice(0, showAllDistricts ? undefined : 5)
                      .map((districtName) => {
                        return (
                          <div key={districtName} className="district">
                            <h2>
                              {formatNumber(
                                getStatistic(
                                  data[stateCode].districts[districtName],
                                  'total',
                                  mapStatistic
                                )
                              )}
                            </h2>
                            <h5>{t(districtName)}</h5>
                            {mapStatistic !== 'active' && (
                              <div className="delta">
                                <Icon.ArrowUp className={mapStatistic} />
                                <h6 className={mapStatistic}>
                                  {formatNumber(
                                    getStatistic(
                                      data[stateCode].districts[districtName],
                                      'delta',
                                      mapStatistic
                                    )
                                  )}
                                </h6>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {Object.keys(data[stateCode].districts).length > 5 && (
                    <button className="button" onClick={toggleShowAllDistricts}>
                      {showAllDistricts ? `View less` : `View all`}
                    </button>
                  )}
                </div>

                {/* <div className="district-bar-right">
                  {(mapStatistic === 'confirmed' || mapStatistic === 'deceased') && (
                    <div
                      className="happy-sign fadeInUp"
                      style={{animationDelay: '0.6s'}}
                    >
                      {timeseries
                        .slice(-5)
                        .every((day) => day[`daily${mapStatistic}`] === 0) && (
                        <div
                          className={`alert ${
                            mapStatistic === 'confirmed' ? 'is-green' : ''
                          }`}
                        >
                          <Icon.Smile />
                          <div className="alert-right">
                            No new {mapStatistic} cases in the past five days
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {
                    <DeltaBarGraph
                      timeseries={timeseries.slice(-5)}
                      caseType={`daily${mapStatistic}`}
                    />
                  }
                </div>*/}
              </div>

              <TimeSeriesExplorer
                timeseries={timeseries[stateCode]}
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
