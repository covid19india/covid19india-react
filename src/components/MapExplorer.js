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
import {formatNumber, getStatistic, capitalize} from '../utils/commonFunctions';

import {
  DotFillIcon,
  ArrowLeftIcon,
  OrganizationIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  lazy,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {animated, config, useTrail} from 'react-spring';
import {useWindowSize} from 'react-use';

const MapVisualizer = lazy(() => import('./MapVisualizer'));

function MapExplorer({
  stateCode = 'TT',
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
  const mapExplorerRef = useRef();
  const {width} = useWindowSize();

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
          view: currentMap.view,
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
          view: currentMap.view,
          option: MAP_OPTIONS.HOTSPOTS,
        });
        return;

      default:
        return;
    }
  };

  const ChoroplethIcon = useMemo(
    () => (
      <svg
        width="314"
        height="314"
        viewBox="0 0 314 314"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78.2861 145.778C80.6671 155.387 84.6108 164.28 92.421 170.488C94.5409 174.766 93.7381 180.115 96.2412 184.535C99.7619 190.751 102.898 195.156 110.758 195.156C119.259 195.156 127.582 192.241 132.576 184.963C136.539 179.187 143.562 174.194 150.658 178.968C156.039 182.587 157.864 191.253 161.949 196.312C168.044 203.859 175.962 212.131 184.107 217.339C190.795 221.615 199.602 221.297 207.368 220.551C214.111 219.903 220.088 212.137 223.71 207.189C227.102 202.555 230.602 198.075 233.006 192.843C238.463 180.961 236.721 162.008 225.62 153.958C213.23 144.974 196.881 145.725 183.343 139.654C175.796 136.27 175.843 122.587 174.174 115.758C172.492 108.876 170.655 99.867 164.581 95.3733C155.36 88.5509 146.436 93.7458 137.075 96.444C133.325 97.525 131.816 100.817 129.095 103.424L129.093 103.426C126.105 106.29 121.531 110.674 117.974 112.632C113.709 114.979 111.262 119.456 105.834 119.612C104.487 119.651 98.6801 120.375 97.7693 119.227C94.2704 114.814 92.1979 113.445 86.6906 113.445C83.0636 113.445 77.14 118.241 77.14 122.31C77.14 130.086 76.4094 138.205 78.2861 145.778Z"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    []
  );

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
    }
  }, [history]);

  const trail = useTrail(7, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {
      transform: 'translate3d(0, 0px, 0)',
      opacity: 1,
    },
    config: config.stiff,
  });

  return (
    <div
      className={classnames(
        'MapExplorer',
        {stickied: anchor === 'mapexplorer'},
        {hidden: anchor && anchor !== 'mapexplorer'}
      )}
    >
      <div className="panel" ref={panelRef}>
        <animated.div className="panel-left" style={trail[0]}>
          <h2
            className={classnames(mapStatistic, {
              [hoveredRegion?.zone]: currentMap.option === MAP_OPTIONS.ZONES,
            })}
          >
            {t(hoveredRegion.name)}
            {hoveredRegion.name === UNKNOWN_DISTRICT_KEY &&
              ` (${t(STATE_NAMES[regionHighlighted.stateCode])})`}
          </h2>

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
                {t(capitalize(mapStatistic))}
                {currentMap.option === MAP_OPTIONS.PER_MILLION &&
                  ` ${t('per million')}`}
              </span>
            </h1>
          )}
        </animated.div>

        <div className={classnames('panel-right', `is-${mapStatistic}`)}>
          <div className="switch-type">
            <animated.div
              className={classnames('choropleth', {
                'is-highlighted': currentMap.option === MAP_OPTIONS.TOTAL,
              })}
              onClick={() => handleTabClick(MAP_OPTIONS.TOTAL)}
              style={trail[1]}
            >
              {ChoroplethIcon}
            </animated.div>
            <animated.div
              className={classnames('bubble', {
                'is-highlighted': currentMap.option === MAP_OPTIONS.HOTSPOTS,
              })}
              onClick={() => handleTabClick(MAP_OPTIONS.HOTSPOTS)}
              style={trail[2]}
            >
              {BubblesIcon}
            </animated.div>

            {currentMapMeta.mapType === MAP_TYPES.COUNTRY && (
              <React.Fragment>
                <div className="divider" />
                <animated.div
                  className={classnames('boundary', {
                    'is-highlighted': currentMap.view === MAP_VIEWS.DISTRICTS,
                  })}
                  onClick={() => {
                    setCurrentMap(
                      produce(currentMap, (currentMapDraft) => {
                        currentMapDraft.view =
                          currentMap.view === MAP_VIEWS.DISTRICTS
                            ? MAP_VIEWS.STATES
                            : MAP_VIEWS.DISTRICTS;
                      })
                    );
                  }}
                  style={trail[2]}
                >
                  <OrganizationIcon />
                </animated.div>
              </React.Fragment>
            )}

            {currentMapMeta.mapType === MAP_TYPES.STATE && (
              <animated.div
                className="back"
                onClick={() => {
                  history.push('/#MapExplorer');
                }}
                style={trail[3]}
              >
                <ArrowLeftIcon />
              </animated.div>
            )}
          </div>

          {width < 769 && (
            <animated.div className="switch-statistic" style={trail[5]}>
              {PRIMARY_STATISTICS.map((statistic) => (
                <div
                  key={statistic}
                  className={classnames('statistic-option', `is-${statistic}`, {
                    'is-highlighted': mapStatistic === statistic,
                  })}
                  onClick={() => {
                    setMapStatistic(statistic);
                  }}
                >
                  <DotFillIcon />
                </div>
              ))}
            </animated.div>
          )}
        </div>
      </div>

      <animated.div ref={mapExplorerRef} style={trail[3]}>
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
              regionHighlighted={regionHighlighted}
              setRegionHighlighted={setRegionHighlighted}
              statistic={mapStatistic}
              isCountryLoaded={isCountryLoaded}
            ></MapVisualizer>
          </Suspense>
        )}
      </animated.div>
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
