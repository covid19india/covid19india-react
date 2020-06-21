import MapVisualizerLoader from './loaders/mapvisualizer';

import {
  MAP_META,
  MAP_OPTIONS,
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_NAMES,
  STATE_POPULATIONS_MIL,
  UNKNOWN_DISTRICT_KEY,
} from '../constants';
import {
  capitalize,
  formatNumber,
  formatDate,
  formatLastUpdated,
  getStatistic,
} from '../utils/commonfunctions';

import {PinIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  lazy,
} from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSprings, animated} from 'react-spring';

const MapVisualizer = lazy(() =>
  import('./mapvisualizer' /* webpackChunkName: "MapVisualizer" */)
);

function MapExplorer({
  stateCode,
  data,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  mapStatistic,
  setMapStatistic,
  isCountryLoaded = true,
}) {
  const {t} = useTranslation();
  const history = useHistory();

  const mapExplorerRef = useRef();

  const [currentMap, setCurrentMap] = useState({
    code: stateCode,
    view: MAP_VIEWS.DISTRICTS,
    option:
      MAP_META[stateCode].mapType === MAP_TYPES.COUNTRY
        ? MAP_OPTIONS.HOTSPOTS
        : MAP_OPTIONS.TOTAL,
  });
  const currentMapMeta = MAP_META[currentMap.code];

  const currentMapData =
    currentMapMeta.mapType === MAP_TYPES.COUNTRY
      ? data
      : {[currentMap.code]: data[currentMap.code]};

  useEffect(() => {
    if (regionHighlighted.districtName) {
      if (
        currentMap.code !== regionHighlighted.stateCode &&
        !(
          currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.view === MAP_VIEWS.DISTRICTS
        )
      ) {
        const newMapMeta = MAP_META[regionHighlighted.stateCode];
        if (!newMapMeta) {
          return;
        }
        setCurrentMap({
          code: regionHighlighted.stateCode,
          view: MAP_VIEWS.DISTRICTS,
          option:
            currentMap.option === MAP_OPTIONS.PER_MILLION
              ? MAP_OPTIONS.TOTAL
              : currentMap.option,
        });
      }
    } else if (isCountryLoaded && currentMapMeta.mapType === MAP_TYPES.STATE) {
      setCurrentMap({
        code: 'TT',
        view:
          currentMap.option === MAP_OPTIONS.ZONES
            ? MAP_VIEWS.DISTRICTS
            : MAP_VIEWS.STATES,
        option: currentMap.option,
      });
    }
  }, [
    isCountryLoaded,
    regionHighlighted.stateCode,
    regionHighlighted.districtName,
    currentMap.code,
    currentMap.option,
    currentMap.view,
    currentMapMeta.mapType,
  ]);

  const switchMap = useCallback(
    (stateCode) => {
      const newMapMeta = MAP_META[stateCode];
      if (!newMapMeta) {
        return;
      }
      if (newMapMeta.mapType === MAP_TYPES.STATE) {
        const districts = data[stateCode].districts || {};
        const topDistrict = Object.keys(districts).sort(
          (a, b) =>
            getStatistic(districts[b], 'total', mapStatistic) -
            getStatistic(districts[a], 'total', mapStatistic)
        )[0];
        ReactDOM.unstable_batchedUpdates(() => {
          setRegionHighlighted({
            stateCode: stateCode,
            districtName: topDistrict,
          });
          setCurrentMap({
            code: stateCode,
            view: MAP_VIEWS.DISTRICTS,
            option:
              currentMap.option === MAP_OPTIONS.PER_MILLION
                ? MAP_OPTIONS.TOTAL
                : currentMap.option,
          });
        });
      } else {
        ReactDOM.unstable_batchedUpdates(() => {
          setCurrentMap({
            code: 'TT',
            view:
              currentMap.option === MAP_OPTIONS.HOTSPOTS
                ? MAP_VIEWS.DISTRICTS
                : MAP_VIEWS.STATES,
            option: currentMap.option,
          });
          setRegionHighlighted({
            stateCode: 'TT',
            districtName: null,
          });
        });
      }
    },
    [data, currentMap.option, mapStatistic, setRegionHighlighted]
  );

  useEffect(() => {
    switchMap(stateCode);
  }, [stateCode, switchMap]);

  const panelState = useMemo(() => {
    const stateCode =
      currentMap.view === MAP_VIEWS.STATES
        ? regionHighlighted.stateCode
        : currentMap.code;
    const stateData = data[stateCode] || {};
    return produce(stateData, (draft) => {
      draft.state = STATE_NAMES[stateCode];
    });
  }, [data, regionHighlighted.stateCode, currentMap.view, currentMap.code]);

  const hoveredRegion = useMemo(() => {
    const hoveredData =
      (regionHighlighted.districtName
        ? data[regionHighlighted.stateCode]?.districts?.[
            regionHighlighted.districtName
          ]
        : data[regionHighlighted.stateCode]) || {};
    return produce(hoveredData, (draft) => {
      draft.name =
        regionHighlighted.districtName ||
        STATE_NAMES[regionHighlighted.stateCode];
      if (!regionHighlighted.districtName)
        draft.population_millions =
          STATE_POPULATIONS_MIL[regionHighlighted.stateCode];
    });
  }, [data, regionHighlighted.stateCode, regionHighlighted.districtName]);

  const handleTabClick = (option) => {
    switch (option) {
      case MAP_OPTIONS.TOTAL:
        setCurrentMap({
          code: currentMap.code,
          view:
            currentMapMeta.mapType === MAP_TYPES.COUNTRY
              ? MAP_VIEWS.STATES
              : MAP_VIEWS.DISTRICTS,
          option: MAP_OPTIONS.TOTAL,
        });
        if (currentMapMeta.mapType === MAP_TYPES.COUNTRY)
          setRegionHighlighted({
            stateCode: regionHighlighted.stateCode,
            districtName: null,
          });
        return;
      case MAP_OPTIONS.PER_MILLION:
        if (currentMapMeta.mapType === MAP_TYPES.STATE) return;
        setCurrentMap({
          code: currentMap.code,
          view: MAP_VIEWS.STATES,
          option: MAP_OPTIONS.PER_MILLION,
        });
        setRegionHighlighted({
          stateCode: regionHighlighted.stateCode,
          districtName: null,
        });
        return;
      case MAP_OPTIONS.HOTSPOTS:
        setCurrentMap({
          code: currentMap.code,
          view: MAP_VIEWS.DISTRICTS,
          option: MAP_OPTIONS.HOTSPOTS,
        });
        return;
      case MAP_OPTIONS.ZONES:
        setCurrentMap({
          code: currentMap.code,
          view: MAP_VIEWS.DISTRICTS,
          option: MAP_OPTIONS.ZONES,
        });
        if (currentMapMeta.mapType === MAP_TYPES.COUNTRY)
          setRegionHighlighted({
            stateCode: 'TT',
            districtName: null,
          });
        return;
      default:
        return;
    }
  };

  const springs = useSprings(
    MAP_STATISTICS.length,
    MAP_STATISTICS.map((statistic) => ({
      total: getStatistic(panelState, 'total', statistic),
      delta: getStatistic(panelState, 'delta', statistic),
      from: {
        total: getStatistic(panelState, 'total', statistic),
        delta: getStatistic(panelState, 'delta', statistic),
      },
      config: {
        tension: 500,
        clamp: true,
      },
    }))
  );

  return (
    <div
      className={classnames(
        'MapExplorer',
        {stickied: anchor === 'mapexplorer'},
        {hidden: anchor && anchor !== 'mapexplorer'}
      )}
    >
      {window.innerWidth > 769 && (
        <div
          className={classnames('anchor', {stickied: anchor === 'mapexplorer'})}
          onClick={() => {
            setAnchor(anchor === 'mapexplorer' ? null : 'mapexplorer');
          }}
        >
          <PinIcon />
        </div>
      )}

      <div className="header">
        <h1>
          {currentMap.code === 'TT'
            ? t('India')
            : t(STATE_NAMES[currentMap.code])}{' '}
          {t('Map')}
        </h1>
        <h6>
          {t('{{action}} over a {{mapType}} for more details', {
            action: t(window.innerWidth <= 769 ? 'Tap' : 'Hover'),
            mapType: t(
              currentMapMeta.mapType === MAP_TYPES.COUNTRY
                ? 'state/UT'
                : 'District'
            ),
          })}
        </h6>
      </div>

      <div className="map-stats">
        {MAP_STATISTICS.map((statistic, index) => (
          <div
            key={statistic}
            className={classnames('stats', statistic, {
              focused: statistic === mapStatistic,
            })}
            onClick={() => setMapStatistic(statistic)}
          >
            <h5>{t(capitalize(statistic))}</h5>
            <div className="stats-bottom">
              <animated.h1>
                {springs[index].total.interpolate((total) =>
                  formatNumber(Math.floor(total))
                )}
              </animated.h1>
              {statistic !== 'tested' && statistic !== 'active' && (
                <animated.h6>
                  {springs[index].delta.interpolate((delta) =>
                    delta > 0 ? `+${formatNumber(Math.floor(delta))}` : '\u00A0'
                  )}
                </animated.h6>
              )}
              {statistic === 'tested' && (
                <h6>
                  {panelState?.total?.tested &&
                    t('As of {{date}}', {
                      date: formatDate(
                        panelState.meta.tested['last_updated'],
                        'dd MMM'
                      ),
                    })}
                </h6>
              )}
            </div>
            {statistic === 'tested' && panelState?.total?.tested && (
              <a href={panelState.meta.tested.source} target="_noblank">
                <Icon.Link />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="meta">
        {currentMapMeta.mapType === MAP_TYPES.STATE && (
          <div
            className="map-button"
            onClick={() => history.push(`state/${currentMap.code}`)}
          >
            {t('Visit state page')}
            <Icon.ArrowRightCircle />
          </div>
        )}

        {currentMapMeta.mapType !== MAP_TYPES.STATE &&
          panelState?.meta?.['last_updated'] && (
            <div className="last-update">
              <h6>{t('Last updated')}</h6>
              <h3>
                {`${formatLastUpdated(panelState.meta['last_updated'])} ${t(
                  'ago'
                )}`}
              </h3>
            </div>
          )}

        <h2
          className={classnames(mapStatistic, {
            [hoveredRegion?.zone]: currentMap.option === MAP_OPTIONS.ZONES,
          })}
        >
          {t(hoveredRegion.name)}
          {hoveredRegion.name === UNKNOWN_DISTRICT_KEY &&
            ` (${t(STATE_NAMES[regionHighlighted.stateCode])})`}
        </h2>

        {currentMapMeta.mapType === MAP_TYPES.STATE && (
          <div className="map-button" onClick={() => switchMap('TT')}>
            {t('Back')}
          </div>
        )}

        {currentMap.option !== MAP_OPTIONS.ZONES &&
          ((currentMap.view === MAP_VIEWS.DISTRICTS &&
            regionHighlighted.districtName) ||
            (currentMap.view === MAP_VIEWS.STATES &&
              currentMap.option !== MAP_OPTIONS.TOTAL)) && (
            <h1 className={classnames('district', mapStatistic)}>
              {formatNumber(
                getStatistic(
                  hoveredRegion,
                  'total',
                  mapStatistic,
                  currentMap.option === MAP_OPTIONS.PER_MILLION
                    ? hoveredRegion.population_millions
                    : 1
                )
              )}
              <br />
              <span>
                {t(mapStatistic)}
                {currentMap.option === MAP_OPTIONS.PER_MILLION &&
                  ` ${t('per million')}`}
              </span>
            </h1>
          )}
      </div>

      <div ref={mapExplorerRef}>
        {mapStatistic && (
          <Suspense
            fallback={
              <MapVisualizerLoader
                className="map-loader"
                {...{
                  width: mapExplorerRef.current?.clientWidth,
                  statistic: mapStatistic,
                }}
              />
            }
          >
            <MapVisualizer
              currentMap={currentMap}
              data={currentMapData}
              changeMap={switchMap}
              regionHighlighted={regionHighlighted}
              setRegionHighlighted={setRegionHighlighted}
              statistic={mapStatistic}
              isCountryLoaded={isCountryLoaded}
            />
          </Suspense>
        )}
      </div>

      <div className="tabs-map">
        {Object.values(MAP_OPTIONS).map((option) => (
          <div
            key={option}
            className={classnames('tab', {
              focused: currentMap.option === option,
            })}
            onClick={() => handleTabClick(option)}
          >
            <h4>
              {t(option)}
              {option === MAP_OPTIONS.PER_MILLION && <sup>&dagger;</sup>}
            </h4>
          </div>
        ))}
      </div>

      <h6 className={classnames('footnote')}>
        &dagger; {`${t('Based on 2019 population projection by NCP, see ')}`}
        <a
          href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
          target="_noblank"
          style={{color: '#6c757d'}}
        >
          {t('source')}
        </a>
      </h6>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.stateCode, currProps.stateCode)) {
    return false;
  } else if (!equal(prevProps.regionHighlighted, currProps.regionHighlighted)) {
    return false;
  } else if (!equal(prevProps.mapStatistic, currProps.mapStatistic)) {
    return false;
  } else if (!equal(prevProps.anchor, currProps.anchor)) {
    return false;
  } else if (
    !equal(
      prevProps.data?.TT?.meta?.['last_updated'],
      currProps.data?.TT?.meta?.['last_updated']
    )
  ) {
    return false;
  } else if (!equal(prevProps.data?.TT?.total, currProps.data?.TT?.total)) {
    return false;
  }
  return true;
};

export default React.memo(MapExplorer, isEqual);
