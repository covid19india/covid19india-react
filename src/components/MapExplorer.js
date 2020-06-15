import MapVisualizerLoader from './loaders/MapVisualizer';

import {
  MAP_META,
  MAP_OPTIONS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_NAMES,
  STATE_POPULATIONS_MIL,
  UNKNOWN_DISTRICT_KEY,
  PRIMARY_STATISTICS,
} from '../constants';
import {formatNumber, getStatistic} from '../utils/commonFunctions';

import {DotFillIcon, ArrowLeftIcon} from '@primer/octicons-v2-react';
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
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

const MapVisualizer = lazy(() => import('./MapVisualizer'));

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
  children: Minigraphs,
}) {
  const {t} = useTranslation();

  const mapExplorerRef = useRef();

  const [currentMap, setCurrentMap] = useState({
    code: stateCode,
    view: MAP_VIEWS.DISTRICTS,
    option:
      MAP_META[stateCode].mapType === MAP_TYPES.COUNTRY
        ? MAP_OPTIONS.TOTAL
        : MAP_OPTIONS.HOTSPOTS,
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

  const BubblesIcon = useMemo(
    () => (
      <svg
        width="22"
        height="27"
        viewBox="-1 -5 22 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="5.5" cy="5.5" r="5.5" fillOpacity="0.4" />
        <circle cx="5.5" cy="5.5" r="5" strokeOpacity="0.5" />
        <circle cx="6.5" cy="11.5" r="3.5" fillOpacity="0.4" />
        <circle cx="6.5" cy="11.5" r="3" strokeOpacity="0.5" />
        <circle cx="13.5" cy="9.5" r="6.5" fillOpacity="0.4" />
        <circle cx="13.5" cy="9.5" r="6" strokeOpacity="0.5" />
      </svg>
    ),
    []
  );

  const history = useHistory();
  const panelRef = useRef();

  useEffect(() => {
    if (history.location.hash === '#MapExplorer') {
      panelRef.current.scrollIntoView();
    } else {
      window.scroll(0, 0);
    }
  }, [history]);

  return (
    <div
      className={classnames(
        'MapExplorer',
        {stickied: anchor === 'mapexplorer'},
        {hidden: anchor && anchor !== 'mapexplorer'}
      )}
    >
      <div className="panel" ref={panelRef}>
        <div className="panel-left">
          <h2
            className={classnames(mapStatistic, {
              [hoveredRegion?.zone]: currentMap.option === MAP_OPTIONS.ZONES,
            })}
          >
            {t(hoveredRegion.name)}
            {hoveredRegion.name === UNKNOWN_DISTRICT_KEY &&
              ` (${t(STATE_NAMES[regionHighlighted.stateCode])})`}
          </h2>

          {/* currentMapMeta.mapType === MAP_TYPES.STATE && (
          <div className="map-button" onClick={() => switchMap('TT')}>
            {t('Back')}
          </div>
        )*/}

          {((currentMap.view === MAP_VIEWS.DISTRICTS &&
            regionHighlighted.districtName) ||
            (currentMap.view === MAP_VIEWS.STATES && true)) && (
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

        <div className={classnames('panel-right', `is-${mapStatistic}`)}>
          <div className="switch-type">
            <div
              className={classnames('choropleth', {
                'is-highlighted': false,
              })}
            >
              <DotFillIcon size={36} />
            </div>
            <div
              className={classnames('bubble', {
                'is-highlighted': false,
              })}
            >
              {BubblesIcon}
            </div>
          </div>

          <div className="switch-statistic">
            {PRIMARY_STATISTICS.map((statistic) => (
              <div key={statistic} className={`is-${statistic}`}>
                <DotFillIcon />
              </div>
            ))}
          </div>

          {history.location.pathname !== '/' && (
            <div className="buttons">
              <div
                className="back"
                onClick={() => {
                  history.push('/#MapExplorer');
                }}
              >
                <ArrowLeftIcon />
              </div>
            </div>
          )}
        </div>
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
            ></MapVisualizer>
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
