import DeltaBarGraph from './DeltaBarGraph';
import Level from './Level';
import MapSwitcher from './MapSwitcher';
import StateHeader from './StateHeader';
import StateMeta from './StateMeta';

import {STATE_NAMES} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {fetcher, formatNumber, getStatistic} from '../utils/commonFunctions';

import React, {useMemo, useState, lazy, Suspense, useRef} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {animated, config, useTrail} from 'react-spring';
import useSWR from 'swr';

const TimeseriesExplorer = lazy(() => import('./TimeseriesExplorer'));
const MapExplorer = lazy(() => import('./MapExplorer'));
const Minigraphs = lazy(() => import('./Minigraphs'));

function State(props) {
  const {t} = useTranslation();

  const stateCode = useParams().stateCode.toUpperCase();

  const [mapStatistic, setMapStatistic] = useState('active');
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: stateCode,
    districtName: null,
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

  const toggleShowAllDistricts = () => {
    setShowAllDistricts(!showAllDistricts);
  };

  const handleSort = (districtNameA, districtNameB) => {
    const districtA = data[stateCode].districts[districtNameA];
    const districtB = data[stateCode].districts[districtNameB];
    return (
      getStatistic(districtB, 'total', mapStatistic) -
      getStatistic(districtA, 'total', mapStatistic)
    );
  };

  const gridRowCount = useMemo(() => {
    const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
    const districtCount = data[stateCode]?.districts
      ? Object.keys(data[stateCode].districts).filter(
          (districtName) => districtName !== 'Unknown'
        ).length
      : 0;
    const gridRowCount = Math.ceil(districtCount / gridColumnCount);
    return gridRowCount;
  }, [data, stateCode]);

  const stateMetaElement = useRef();
  const isStateMetaVisible = useIsVisible(stateMetaElement, {once: true});

  const trail = useTrail(4, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {
      transform: 'translate3d(0, 0px, 0)',
      opacity: 1,
    },
    delay: 150,
    config: config.gentle,
  });

  const lookback = showAllDistricts ? 10 : 6;

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
          <StateHeader data={data[stateCode]} stateCode={stateCode} />

          <div style={{position: 'relative'}}>
            <MapSwitcher {...{mapStatistic, setMapStatistic}} />
            <Level data={data[stateCode]} />
            <Minigraphs timeseries={timeseries[stateCode]} />
          </div>

          <Suspense fallback={<div style={{minHeight: '50rem'}} />}>
            <MapExplorer
              {...{
                stateCode,
                data,
                regionHighlighted,
                setRegionHighlighted,
                mapStatistic,
                setMapStatistic,
              }}
            ></MapExplorer>
          </Suspense>

          <span ref={stateMetaElement} />

          {data && timeseries && isStateMetaVisible && (
            <StateMeta
              {...{
                stateCode,
                data,
                timeseries,
              }}
            />
          )}
        </div>

        <div className="state-right">
          <React.Fragment>
            <div
              className="district-bar"
              style={!showAllDistricts ? {display: 'flex'} : {}}
            >
              <div className="district-bar-top">
                <div className="district-bar-left">
                  <animated.h2 className={mapStatistic} style={trail[0]}>
                    Top districts
                  </animated.h2>
                  <animated.div
                    className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
                    style={
                      showAllDistricts
                        ? {
                            gridTemplateRows: `repeat(${gridRowCount}, 2rem)`,
                            ...trail[1],
                          }
                        : trail[1]
                    }
                  >
                    {Object.keys(data[stateCode]?.districts || {})
                      .filter((districtName) => districtName !== 'Unknown')
                      .sort((a, b) => handleSort(a, b))
                      .slice(0, showAllDistricts ? undefined : 5)
                      .map((districtName) => {
                        const total = getStatistic(
                          data[stateCode].districts[districtName],
                          'total',
                          mapStatistic
                        );
                        const delta = getStatistic(
                          data[stateCode].districts[districtName],
                          'delta',
                          mapStatistic
                        );
                        return (
                          <div key={districtName} className="district">
                            <h2>{formatNumber(total)}</h2>
                            <h5>{t(districtName)}</h5>
                            {mapStatistic !== 'active' && (
                              <div className="delta">
                                <h6 className={mapStatistic}>
                                  {delta > 0
                                    ? '\u2191' + formatNumber(delta)
                                    : ''}
                                </h6>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </animated.div>
                </div>

                <animated.div className="district-bar-right" style={trail[2]}>
                  {(mapStatistic === 'confirmed' ||
                    mapStatistic === 'deceased') && (
                    <div className="happy-sign">
                      {Object.keys(timeseries[stateCode] || {})
                        .slice(-lookback)
                        .every(
                          (date) =>
                            getStatistic(
                              timeseries[stateCode][date],
                              'delta',
                              mapStatistic
                            ) === 0
                        ) && (
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
                  <DeltaBarGraph
                    timeseries={timeseries[stateCode] || {}}
                    {...{stateCode, lookback}}
                    statistic={mapStatistic}
                  />
                </animated.div>
              </div>

              <div className="district-bar-bottom">
                {Object.keys(data[stateCode]?.districts || {}).length > 5 ? (
                  <animated.button
                    className="button"
                    onClick={toggleShowAllDistricts}
                    style={trail[3]}
                  >
                    <span>{showAllDistricts ? `View less` : `View all`}</span>
                  </animated.button>
                ) : (
                  <div style={{height: '3.75rem', flexBasis: '15%'}} />
                )}
              </div>
            </div>

            <Suspense fallback={<div />}>
              <TimeseriesExplorer
                timeseries={timeseries[stateCode]}
                {...{regionHighlighted, setRegionHighlighted}}
              />
            </Suspense>
          </React.Fragment>
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(State);
