import DeltaBarGraph from './deltabargraph';
import StateDropdown from './statedropdown';
import StateMeta from './statemeta';

import { NUM_BARS_STATEPAGE, STATE_NAMES } from '../constants';
import {
  fetcher,
  formatDate,
  formatNumber,
  getStatistic,
} from '../utils/commonfunctions';

import anime from 'animejs';
import React, { useState, useMemo, lazy, Suspense } from 'react';
import * as Icon from 'react-feather';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMeasure, useEffectOnce } from 'react-use';
import useSWR from 'swr';

const TimeSeriesExplorer = lazy(() =>
  import('./timeseriesexplorer' /* webpackChunkName: "TimeSeriesExplorer" */)
);

const MapExplorer = lazy(() =>
  import('./mapexplorer' /* webpackChunkName: "MapExplorer" */)
);

const Footer = lazy(() => import('./footer' /* webpackChunkName: "Footer" */));

const Minigraph = lazy(() =>
  import('./minigraph' /* webpackChunkName: "Minigraph" */)
);

const Level = lazy(() => import('./level' /* webpackChunkName: "Level" */));

function State(props) {
  const { t } = useTranslation();

  const stateCode = useParams().stateCode.toUpperCase();

  const [mapStatistic, setMapStatistic] = useState('confirmed');
  const [mapSwitcher, { width }] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: stateCode,
    districtName: null,
  });

  useEffectOnce(() => {
    anime({
      targets: '.highlight',
      duration: 200,
      delay: 500,
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

  const { data: timeseries } = useSWR(
    'https://api.covid19india.org/v3/min/timeseries.min.json',
    fetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
    }
  );

  const { data } = useSWR(
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
      ? Object.keys(data[stateCode].districts).length
      : 0;
    const gridRowCount = Math.ceil(districtCount / gridColumnCount);
    return gridRowCount;
  }, [data, stateCode]);

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
          <div className="header">
            <div className="header-left">
              <StateDropdown {...{ stateCode }} />
              <h5>{`Last Updated on ${formatDate(
                data[stateCode].meta.last_updated,
                'dd MMM, p'
              )} IST`}</h5>
            </div>
          </div>

          <div className="map-switcher" ref={mapSwitcher}>
            <div
              className={`highlight ${mapStatistic}`}
              style={{
                transform: `translateX(${width * 0}px) translateY(-12px)`,
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

          <Suspense fallback={<div />}>
            <MapExplorer
              isCountryLoaded={false}
              {...{
                stateCode,
                data,
                regionHighlighted,
                setRegionHighlighted,
                mapStatistic,
                setMapStatistic,
              }}
            />
          </Suspense>

          <StateMeta
            {...{
              stateCode,
              data,
              timeseries,
            }}
          />
        </div>

        <div className="state-right">
          <React.Fragment>
            <div
              className="district-bar"
              style={!showAllDistricts ? { display: 'flex' } : {}}
            >
              <div className="district-bar-left fadeInUp">
                <h2 className={mapStatistic}>Top districts</h2>
                <div
                  className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
                  style={
                    showAllDistricts
                      ? { gridTemplateRows: `repeat(${gridRowCount}, 2rem)` }
                      : {}
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
                </div>

                {Object.keys(data[stateCode]?.districts || {}).length > 5 && (
                  <button className="button" onClick={toggleShowAllDistricts}>
                    <span>{showAllDistricts ? `View less` : `View all`}</span>
                  </button>
                )}
              </div>

              <div className="district-bar-right">
                {(mapStatistic === 'confirmed' ||
                  mapStatistic === 'deceased') && (
                    <div className="happy-sign">
                      {Object.keys(timeseries[stateCode] || {})
                        .slice(-NUM_BARS_STATEPAGE)
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
                  timeseries={timeseries[stateCode]}
                  statistic={mapStatistic}
                />
              </div>
            </div>

            <Suspense fallback={<div />}>
              <TimeSeriesExplorer
                timeseries={timeseries[stateCode]}
                {...{ regionHighlighted, setRegionHighlighted }}
              />
            </Suspense>
          </React.Fragment>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default React.memo(State);
