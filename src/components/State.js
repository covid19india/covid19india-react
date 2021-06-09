import {DATA_API_ROOT, MAP_STATISTICS, STATE_NAMES} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {
  fetcher,
  formatNumber,
  getStatistic,
  parseIndiaDate,
  retry,
} from '../utils/commonFunctions';

import {SmileyIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {formatISO, max} from 'date-fns';
import {
  memo,
  useMemo,
  useState,
  useEffect,
  lazy,
  Suspense,
  useRef,
} from 'react';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useSessionStorage} from 'react-use';
import useSWR from 'swr';

const DeltaBarGraph = lazy(() => retry(() => import('./DeltaBarGraph')));
const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));
const VaccinationHeader = lazy(() =>
  retry(() => import('./VaccinationHeader'))
);
const MapExplorer = lazy(() => retry(() => import('./MapExplorer')));
const MapSwitcher = lazy(() => retry(() => import('./MapSwitcher')));
const Minigraphs = lazy(() => retry(() => import('./Minigraphs')));
const StateHeader = lazy(() => retry(() => import('./StateHeader')));
const StateMeta = lazy(() => retry(() => import('./StateMeta')));
const TimeseriesExplorer = lazy(() =>
  retry(() => import('./TimeseriesExplorer'))
);

function State() {
  const {t} = useTranslation();

  const stateCode = useParams().stateCode.toUpperCase();

  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active'
  );
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: stateCode,
    districtName: null,
  });
  const [delta7Mode, setDelta7Mode] = useState(false);

  useEffect(() => {
    if (regionHighlighted.stateCode !== stateCode) {
      setRegionHighlighted({
        stateCode: stateCode,
        districtName: null,
      });
      setShowAllDistricts(false);
    }
  }, [regionHighlighted.stateCode, stateCode]);

  const {data: timeseries, error: timeseriesResponseError} = useSWR(
    `${DATA_API_ROOT}/timeseries-${stateCode}.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data} = useSWR(`${DATA_API_ROOT}/data.min.json`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 100000,
  });

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
    if (!data) return;
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
  const isStateMetaVisible = useIsVisible(stateMetaElement);

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });
    return styles;
  }, []);

  const lookback = showAllDistricts ? (window.innerWidth >= 540 ? 10 : 8) : 6;

  const lastUpdatedDate = useMemo(() => {
    if (!data) {
      return null;
    }
    const updatedDates = [
      data[stateCode]?.meta?.['last_updated'],
      data[stateCode]?.meta?.tested?.['last_updated'],
    ];
    return formatISO(
      max(
        updatedDates.filter((date) => date).map((date) => parseIndiaDate(date))
      ),
      {representation: 'date'}
    );
  }, [stateCode, data]);

  const primaryStatistic = MAP_STATISTICS.includes(mapStatistic)
    ? mapStatistic
    : 'confirmed';

  return (
    <>
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
          <StateHeader data={data?.[stateCode]} stateCode={stateCode} />

          <div style={{position: 'relative'}}>
            <MapSwitcher {...{mapStatistic, setMapStatistic}} />
            <Level data={data?.[stateCode]} />
            <Minigraphs
              timeseries={timeseries?.[stateCode]?.dates}
              {...{stateCode}}
              forceRender={!!timeseriesResponseError}
            />
          </div>

          {data?.[stateCode]?.total?.vaccinated1 && (
            <VaccinationHeader data={data?.[stateCode]} />
          )}

          {data && (
            <Suspense fallback={<div style={{minHeight: '50rem'}} />}>
              <MapExplorer
                {...{
                  stateCode,
                  data,
                  regionHighlighted,
                  setRegionHighlighted,
                  mapStatistic,
                  setMapStatistic,
                  lastUpdatedDate,
                  delta7Mode,
                  setDelta7Mode,
                }}
              ></MapExplorer>
            </Suspense>
          )}

          <span ref={stateMetaElement} />

          {isStateMetaVisible && data && (
            <Suspense fallback={<div />}>
              <StateMeta
                {...{
                  stateCode,
                  data,
                }}
                timeseries={timeseries?.[stateCode]?.dates}
              />
            </Suspense>
          )}
        </div>

        <div className="state-right">
          <>
            <div className="district-bar">
              <div
                className={classnames('district-bar-top', {
                  expanded: showAllDistricts,
                })}
              >
                <div className="district-bar-left">
                  <h2
                    className={classnames(primaryStatistic, 'fadeInUp')}
                    style={trail[0]}
                  >
                    {t('Top districts')}
                  </h2>
                  <div
                    className={`districts fadeInUp ${
                      showAllDistricts ? 'is-grid' : ''
                    }`}
                    style={
                      showAllDistricts
                        ? {
                            gridTemplateRows: `repeat(${gridRowCount}, 2rem)`,
                            ...trail[1],
                          }
                        : trail[1]
                    }
                  >
                    {Object.keys(data?.[stateCode]?.districts || {})
                      .filter((districtName) => districtName !== 'Unknown')
                      .sort((a, b) => handleSort(a, b))
                      .slice(0, showAllDistricts ? undefined : 5)
                      .map((districtName) => {
                        const total = getStatistic(
                          data[stateCode].districts[districtName],
                          'total',
                          primaryStatistic
                        );
                        const delta = getStatistic(
                          data[stateCode].districts[districtName],
                          'delta',
                          primaryStatistic
                        );
                        return (
                          <div key={districtName} className="district">
                            <h2>{formatNumber(total)}</h2>
                            <h5>{t(districtName)}</h5>
                            {primaryStatistic !== 'active' && (
                              <div className="delta">
                                <h6 className={primaryStatistic}>
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
                </div>

                <div className="district-bar-right fadeInUp" style={trail[2]}>
                  {timeseries &&
                    (primaryStatistic === 'confirmed' ||
                      primaryStatistic === 'deceased') && (
                      <div className="happy-sign">
                        {Object.keys(timeseries[stateCode]?.dates || {})
                          .slice(-lookback)
                          .every(
                            (date) =>
                              getStatistic(
                                timeseries[stateCode].dates[date],
                                'delta',
                                primaryStatistic
                              ) === 0
                          ) && (
                          <div
                            className={`alert ${
                              primaryStatistic === 'confirmed' ? 'is-green' : ''
                            }`}
                          >
                            <SmileyIcon />
                            <div className="alert-right">
                              No new {primaryStatistic} cases in the past five
                              days
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  <DeltaBarGraph
                    timeseries={timeseries?.[stateCode]?.dates}
                    statistic={primaryStatistic}
                    {...{stateCode, lookback}}
                    forceRender={!!timeseriesResponseError}
                  />
                </div>
              </div>

              <div className="district-bar-bottom">
                {Object.keys(data?.[stateCode]?.districts || {}).length > 5 ? (
                  <button
                    className="button fadeInUp"
                    onClick={toggleShowAllDistricts}
                    style={trail[3]}
                  >
                    <span>
                      {t(showAllDistricts ? 'View less' : 'View all')}
                    </span>
                  </button>
                ) : (
                  <div style={{height: '3.75rem', flexBasis: '15%'}} />
                )}
              </div>
            </div>

            <Suspense fallback={<div />}>
              <TimeseriesExplorer
                {...{
                  stateCode,
                  timeseries,
                  regionHighlighted,
                  setRegionHighlighted,
                }}
                forceRender={!!timeseriesResponseError}
              />
            </Suspense>
          </>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default memo(State);
