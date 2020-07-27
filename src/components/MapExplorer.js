import MapVisualizerLoader from './loaders/MapVisualizer';

import {
  MAP_META,
  MAP_TYPES,
  MAP_VIEWS,
  MAP_VIZS,
  PRIMARY_STATISTICS,
  SPRING_CONFIG_NUMBERS,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY,
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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  lazy,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {animated, useSpring} from 'react-spring';
import {useSwipeable} from 'react-swipeable';
import {useWindowSize} from 'react-use';

const MapVisualizer = lazy(() => import('./MapVisualizer'));

function MapExplorer({
  stateCode: mapCode = 'TT',
  data,
  mapStatistic,
  setMapStatistic,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  expandTable,
}) {
  const {t} = useTranslation();
  const mapExplorerRef = useRef();
  const {width} = useWindowSize();

  const [mapView, setMapView] = useState(MAP_VIEWS.DISTRICTS);
  const [mapViz, setMapViz] = useState(
    MAP_META[mapCode].mapType === MAP_TYPES.COUNTRY
      ? MAP_VIZS.BUBBLES
      : MAP_VIZS.CHOROPLETH
  );

  const mapMeta = MAP_META[mapCode];
  const mapData =
    mapMeta.mapType === MAP_TYPES.COUNTRY ? data : {[mapCode]: data[mapCode]};

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
    });
  }, [data, regionHighlighted.stateCode, regionHighlighted.districtName]);

  const handleTabClick = useCallback(
    (option) => {
      switch (option) {
        case MAP_VIZS.CHOROPLETH:
          setMapViz(MAP_VIZS.CHOROPLETH);
          return;

        case MAP_VIZS.BUBBLES:
          setMapViz(MAP_VIZS.BUBBLES);
          return;

        default:
          return;
      }
    },
    [setMapViz]
  );

  const handleDistrictClick = useCallback(() => {
    const newMapView =
      mapView === MAP_VIEWS.DISTRICTS ? MAP_VIEWS.STATES : MAP_VIEWS.DISTRICTS;
    if (newMapView === MAP_VIEWS.STATES) {
      setRegionHighlighted({
        stateCode: regionHighlighted.stateCode,
        districtName: null,
      });
    }
    setMapView(newMapView);
  }, [mapView, setRegionHighlighted, regionHighlighted.stateCode]);

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

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0, 0, 0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });

    return styles;
  }, []);

  const spring = useSpring({
    total: getStatistic(hoveredRegion, 'total', mapStatistic),
    config: {tension: 250, ...SPRING_CONFIG_NUMBERS},
  });

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      const currentIndex = PRIMARY_STATISTICS.indexOf(mapStatistic);
      const toIndex =
        currentIndex > 0 ? currentIndex - 1 : PRIMARY_STATISTICS.length - 1;
      setMapStatistic(PRIMARY_STATISTICS[toIndex]);
    },
    onSwipedLeft: () => {
      const currentIndex = PRIMARY_STATISTICS.indexOf(mapStatistic);
      const toIndex =
        currentIndex < PRIMARY_STATISTICS.length - 1 ? currentIndex + 1 : 0;
      setMapStatistic(PRIMARY_STATISTICS[toIndex]);
    },
  });

  const statisticConfig = STATISTIC_CONFIGS[mapStatistic];

  return (
    <div
      className={classnames(
        'MapExplorer',
        {stickied: anchor === 'mapexplorer'},
        {
          hidden:
            anchor && (!expandTable || width < 769) && anchor !== 'mapexplorer',
        }
      )}
    >
      <div className="panel" ref={panelRef}>
        <div className="panel-left fadeInUp" style={trail[0]}>
          <h2 className={classnames(mapStatistic)}>
            {t(hoveredRegion.name)}
            {hoveredRegion.name === UNKNOWN_DISTRICT_KEY &&
              ` [${t(STATE_NAMES[regionHighlighted.stateCode])}]`}
          </h2>

          {regionHighlighted.stateCode && (
            <h1 className={classnames('district', mapStatistic)}>
              <animated.div>
                {spring.total.interpolate((total) =>
                  formatNumber(
                    total,
                    statisticConfig.format !== 'short'
                      ? statisticConfig.format
                      : 'int',
                    mapStatistic
                  )
                )}
              </animated.div>
              <span>{t(capitalize(statisticConfig.displayName))}</span>
            </h1>
          )}
        </div>

        <div className={classnames('panel-right', `is-${mapStatistic}`)}>
          <div className="switch-type">
            <div
              className={classnames('choropleth fadeInUp', {
                'is-highlighted': mapViz === MAP_VIZS.CHOROPLETH,
              })}
              onClick={handleTabClick.bind(this, MAP_VIZS.CHOROPLETH)}
              style={trail[1]}
            >
              {ChoroplethIcon}
            </div>
            <div
              className={classnames('bubble fadeInUp', {
                'is-highlighted': mapViz === MAP_VIZS.BUBBLES,
              })}
              onClick={handleTabClick.bind(this, MAP_VIZS.BUBBLES)}
              style={trail[2]}
            >
              {BubblesIcon}
            </div>

            {mapMeta.mapType === MAP_TYPES.COUNTRY && (
              <React.Fragment>
                <div className="divider" />
                <div
                  className={classnames('boundary fadeInUp', {
                    'is-highlighted': mapView === MAP_VIEWS.DISTRICTS,
                  })}
                  onClick={handleDistrictClick.bind(this)}
                  style={trail[3]}
                >
                  <OrganizationIcon />
                </div>
              </React.Fragment>
            )}

            {mapMeta.mapType === MAP_TYPES.STATE && (
              <div
                className="back fadeInUp"
                onClick={() => {
                  history.push('/#MapExplorer');
                }}
                style={trail[4]}
              >
                <ArrowLeftIcon />
              </div>
            )}
          </div>

          {(expandTable || width < 769) && (
            <div className="switch-statistic fadeInUp" style={trail[5]}>
              {PRIMARY_STATISTICS.map((statistic) => (
                <div
                  key={statistic}
                  className={classnames('statistic-option', `is-${statistic}`, {
                    'is-highlighted': mapStatistic === statistic,
                  })}
                  onClick={setMapStatistic.bind(this, statistic)}
                >
                  <DotFillIcon />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={mapExplorerRef}
        className="fadeInUp"
        style={trail[3]}
        {...swipeHandlers}
      >
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
              {...{mapCode, mapView, mapViz}}
              data={mapData}
              {...{regionHighlighted, setRegionHighlighted}}
              statistic={mapStatistic}
            ></MapVisualizer>
          </Suspense>
        )}
      </div>
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
  } else if (!equal(prevProps.expandTable, currProps.expandTable)) {
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
