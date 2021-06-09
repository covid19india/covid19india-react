import MapVisualizerLoader from './loaders/MapVisualizer';
import {Delta7Icon, PerLakhIcon} from './snippets/Icons';

import {
  MAP_META,
  MAP_TYPES,
  MAP_VIEWS,
  MAP_VIZS,
  MAP_STATISTICS,
  SPRING_CONFIG_NUMBERS,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY,
} from '../constants';
import {
  formatNumber,
  getStatistic,
  capitalize,
  retry,
} from '../utils/commonFunctions';

import {
  ArrowLeftIcon,
  DotFillIcon,
  PinIcon,
  OrganizationIcon,
} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import {
  memo,
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
import {useLocalStorage, useWindowSize} from 'react-use';

const MapVisualizer = lazy(() => retry(() => import('./MapVisualizer')));

function MapExplorer({
  stateCode: mapCode = 'TT',
  data,
  mapStatistic,
  setMapStatistic,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  expandTable = false,
  hideDistrictData = false,
  lastUpdatedDate,
  delta7Mode,
  setDelta7Mode,
}) {
  const {t} = useTranslation();
  const mapExplorerRef = useRef();
  const {width} = useWindowSize();

  const [mapView, setMapView] = useLocalStorage('mapView', MAP_VIEWS.DISTRICTS);
  const [isPerLakh, setIsPerLakh] = useState(false);

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
  }, [mapView, regionHighlighted.stateCode, setMapView, setRegionHighlighted]);

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

  const getMapStatistic = useCallback(
    (data) => {
      const statisticConfig = STATISTIC_CONFIGS[mapStatistic];
      const type =
        statisticConfig?.showDelta && delta7Mode ? 'delta7' : 'total';

      return getStatistic(data, type, mapStatistic, {
        expiredDate: lastUpdatedDate,
        normalizedByPopulationPer: isPerLakh ? 'lakh' : null,
        canBeNaN: true,
      });
    },
    [mapStatistic, isPerLakh, lastUpdatedDate, delta7Mode]
  );

  let currentVal = getMapStatistic(hoveredRegion);
  if (isNaN(currentVal)) currentVal = '-';

  const spring = useSpring({
    total: currentVal,
    config: {tension: 250, ...SPRING_CONFIG_NUMBERS},
  });

  const handleStatisticChange = useCallback(
    (direction) => {
      const currentIndex = MAP_STATISTICS.indexOf(mapStatistic);
      const toIndex =
        (MAP_STATISTICS.length + currentIndex + direction) %
        MAP_STATISTICS.length;
      setMapStatistic(MAP_STATISTICS[toIndex]);
    },
    [mapStatistic, setMapStatistic]
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleStatisticChange.bind(this, 1),
    onSwipedRight: handleStatisticChange.bind(this, -1),
  });

  const statisticConfig = STATISTIC_CONFIGS[mapStatistic];

  const mapViz =
    isPerLakh || statisticConfig?.mapConfig?.colorScale
      ? MAP_VIZS.CHOROPLETH
      : MAP_VIZS.BUBBLES;

  const handleDeltaClick = useCallback(() => {
    if (statisticConfig?.showDelta) {
      setDelta7Mode((delta7Mode) => !delta7Mode);
    }
  }, [statisticConfig, setDelta7Mode]);

  const isDistrictView = mapView === MAP_VIEWS.DISTRICTS && !hideDistrictData;

  const stickied = anchor === 'mapexplorer' || (expandTable && width >= 769);

  const transformStatistic = useCallback(
    (val) =>
      statisticConfig?.mapConfig?.transformFn
        ? statisticConfig.mapConfig.transformFn(val)
        : val,
    [statisticConfig]
  );

  const zoneColor = statisticConfig?.mapConfig?.colorScale
    ? statisticConfig.mapConfig.colorScale(transformStatistic(currentVal))
    : '';

  return (
    <div
      className={classnames(
        'MapExplorer',
        {stickied},
        {
          hidden:
            anchor && anchor !== 'mapexplorer' && (!expandTable || width < 769),
        }
      )}
    >
      <div
        className={classnames('anchor', 'fadeInUp', {
          stickied,
        })}
        style={{
          display: width < 769 || (width >= 769 && expandTable) ? 'none' : '',
        }}
        onClick={
          setAnchor &&
          setAnchor.bind(this, anchor === 'mapexplorer' ? null : 'mapexplorer')
        }
      >
        <PinIcon />
      </div>
      <div className="panel" ref={panelRef}>
        <div className="panel-left fadeInUp" style={trail[0]}>
          <h2 className={classnames(mapStatistic)} style={{color: zoneColor}}>
            {t(hoveredRegion.name)}
            {hoveredRegion.name === UNKNOWN_DISTRICT_KEY &&
              ` [${t(STATE_NAMES[regionHighlighted.stateCode])}]`}
          </h2>

          {regionHighlighted.stateCode && (
            <h1
              className={classnames('district', mapStatistic)}
              style={{color: zoneColor}}
            >
              <animated.div>
                {spring.total.to((total) =>
                  formatNumber(
                    total,
                    statisticConfig.format === 'short'
                      ? 'long'
                      : statisticConfig.format,
                    mapStatistic
                  )
                )}
              </animated.div>
              <span>{`${t(capitalize(statisticConfig.displayName))}${
                isPerLakh && !statisticConfig?.nonLinear
                  ? ` ${t('per lakh')}`
                  : ''
              }${
                delta7Mode && statisticConfig?.showDelta
                  ? ` ${t('last 7 days')}`
                  : ''
              }`}</span>
            </h1>
          )}
        </div>

        <div className={classnames('panel-right', `is-${mapStatistic}`)}>
          <div className="switch-type">
            <div
              className={classnames('fadeInUp', {
                'is-highlighted': statisticConfig?.showDelta && delta7Mode,
                disabled: !statisticConfig?.showDelta,
              })}
              onClick={handleDeltaClick}
              style={trail[1]}
            >
              <Delta7Icon />
            </div>

            <div
              className={classnames('fadeInUp', {
                'is-highlighted': mapViz === MAP_VIZS.CHOROPLETH,
              })}
              onClick={setIsPerLakh.bind(this, !isPerLakh)}
              style={trail[2]}
            >
              <PerLakhIcon />
            </div>

            {mapMeta.mapType === MAP_TYPES.COUNTRY && (
              <div
                className={classnames('boundary fadeInUp', {
                  'is-highlighted': isDistrictView,
                })}
                onClick={handleDistrictClick}
                style={trail[3]}
              >
                <OrganizationIcon />
              </div>
            )}

            {mapMeta.mapType === MAP_TYPES.STATE && (
              <>
                <div className="divider" />
                <div
                  className="back fadeInUp"
                  onClick={() => {
                    history.push('/#MapExplorer');
                  }}
                  style={trail[4]}
                >
                  <ArrowLeftIcon />
                </div>
              </>
            )}
          </div>

          {(expandTable || width < 769) && (
            <div className="switch-statistic fadeInUp" style={trail[5]}>
              {MAP_STATISTICS.map((statistic) => (
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
              data={mapData}
              statistic={mapStatistic}
              {...{
                mapCode,
                isDistrictView,
                mapViz,
                regionHighlighted,
                setRegionHighlighted,
                getMapStatistic,
                transformStatistic,
              }}
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
  } else if (!equal(prevProps.hideDistrictData, currProps.hideDistrictData)) {
    return false;
  } else if (!equal(prevProps.expandTable, currProps.expandTable)) {
    return false;
  } else if (!equal(prevProps.delta7Mode, currProps.delta7Mode)) {
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

export default memo(MapExplorer, isEqual);
