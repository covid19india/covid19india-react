import MapVisualizer from './mapvisualizer';
import {testedToolTip} from './tooltips';

import {
  MAP_META,
  MAP_OPTIONS,
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_CODES,
  STATE_CODES_REVERSE,
} from '../constants';
import {
  capitalize,
  formatNumber,
  formatDayMonth,
  formatLastUpdated,
  getStatistic,
} from '../utils/commonfunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import {PinIcon} from '@primer/octicons-v2-react';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ReactDOM from 'react-dom';
import {useHistory} from 'react-router-dom';
import {useSprings, animated} from 'react-spring';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';

const emptyData = () => {
  return Object.fromEntries(['total', 'delta'].map((ctype) => [
        ctype, {
          active: 0,
          confirmed: 0,
          deceased: 0,
          recovered: 0,
        }
      ]))};

function MapExplorer({
  mapName,
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

  const [currentMap, setCurrentMap] = useState({
    name: mapName,
    view:
      MAP_META[mapName].mapType === MAP_TYPES.COUNTRY
        ? MAP_VIEWS.STATES
        : MAP_VIEWS.DISTRICTS,
    option: MAP_OPTIONS.TOTAL,
  });
  const currentMapMeta = MAP_META[currentMap.name];
  const currentMapCode = useMemo(() => {
    let stateName = currentMap.name;
    if (stateName === 'India') stateName = 'Total';
    return STATE_CODES_REVERSE[stateName];
  }, [currentMap.name]);

  const currentMapData = currentMapMeta.mapType === MAP_TYPES.COUNTRY ? data : {[currentMapCode]: data[currentMapCode]};

  console.log(regionHighlighted)

  useEffect(() => {
    if (regionHighlighted.districtName) {
      if (
        currentMapCode !== regionHighlighted.stateCode &&
        !(
          currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.view === MAP_VIEWS.DISTRICTS
        )
      ) {
        const state = STATE_CODES[regionHighlighted.stateCode];
        const newMapMeta = MAP_META[state];
        if (!newMapMeta) {
          return;
        }
        setCurrentMap({
          name: state,
          view: MAP_VIEWS.DISTRICTS,
          option:
            currentMap.option === MAP_OPTIONS.PER_MILLION
              ? MAP_OPTIONS.TOTAL
              : currentMap.option,
        });
      }
    } else if (isCountryLoaded && currentMapMeta.mapType === MAP_TYPES.STATE) {
      setCurrentMap({
        name: 'India',
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
    currentMapCode,
    currentMap.option,
    currentMap.view,
    currentMapMeta.mapType,
  ]);

  const switchMap = useCallback(
    (state) => {
      const newMapMeta = MAP_META[state];
      if (!newMapMeta) {
        return;
      }
      if (newMapMeta.mapType === MAP_TYPES.STATE) {
        const districts = data[STATE_CODES_REVERSE[state]].districts;
        const topDistrict = Object.keys(districts)
          .filter((d) => d !== 'Unknown')
          .sort((a, b) =>
              getStatistic(districts[b], 'total', mapStatistic) -
              getStatistic(districts[a], 'total', mapStatistic)
          )[0];
        ReactDOM.unstable_batchedUpdates(() => {
          setRegionHighlighted({
            stateCode: STATE_CODES_REVERSE[state],
            districtName: topDistrict,
          });
          setCurrentMap({
            name: state,
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
            name: 'India',
            view:
              currentMap.option === MAP_OPTIONS.ZONES
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

  const panelState = useMemo(() => {
    const stateCode =
      currentMap.view === MAP_VIEWS.STATES
        ? regionHighlighted.stateCode
        : currentMapCode;
    const stateData = data[stateCode];
    return produce(stateData, (draft) => {
      draft.state = STATE_CODES[stateCode];
    });
  }, [data, regionHighlighted.stateCode, currentMap.view, currentMapCode]);

  const hoveredRegion = useMemo(() => {
    const hoveredData =
      (regionHighlighted.districtName
        ? data[regionHighlighted.stateCode].districts[regionHighlighted.districtName]
        : data[regionHighlighted.stateCode]) || emptyData();
    return produce(hoveredData, (draft) => {
      draft.name = regionHighlighted.districtName || STATE_CODES[regionHighlighted.stateCode];
    });
  }, [data, regionHighlighted.stateCode, regionHighlighted.districtName]);

  const handleTabClick = (option) => {
    switch (option) {
      case MAP_OPTIONS.TOTAL:
        setCurrentMap({
          name: currentMap.name,
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
          name: currentMap.name,
          view: MAP_VIEWS.STATES,
          option: MAP_OPTIONS.PER_MILLION,
        });
        setRegionHighlighted({
          stateCode: regionHighlighted.stateCode,
          districtName: null,
        });
        return;
      case MAP_OPTIONS.HOTSPOTS:
        if (currentMapMeta.mapType === MAP_TYPES.STATE) return;
        setCurrentMap({
          name: currentMap.name,
          view: MAP_VIEWS.DISTRICTS,
          option: MAP_OPTIONS.HOTSPOTS,
        });
        return;
      case MAP_OPTIONS.ZONES:
        setCurrentMap({
          name: currentMap.name,
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

  const springs = useSprings(MAP_STATISTICS.length, MAP_STATISTICS.map((statistic) => ({
    total: getStatistic(panelState, 'total', statistic) || '-',
    delta: getStatistic(panelState, 'delta', statistic) || '-',
    from: {
      total: getStatistic(panelState, 'total', statistic) || '-',
      delta: getStatistic(panelState, 'delta', statistic) || '-',
    },
    config: {
      tension: 500,
      clamp: true,
    },
  })));

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
          <PinIcon/>
        </div>
      )}

      <div className="header">
        <h1>
          {t(currentMap.name)} {t('Map')}
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
                {springs[index].total.interpolate((total) => formatNumber(Math.floor(total)))}
              </animated.h1>
              {statistic !== 'tested' &&
                <animated.h6>
                  {springs[index].delta.interpolate((delta) => (delta > 0 ? '+' : '') + formatNumber(Math.floor(delta)))}
                </animated.h6>}
              {statistic === 'tested' &&
                <h6>
                  {panelState.total.tested &&
                    t('As of {{date}}', {
                      date: formatDayMonth(panelState.total.tested.last_updated),
                    })}
                </h6>}
            </div>
            {statistic === 'tested' && panelState.total.tested &&
              <a href={panelState.total.tested.source} target="_noblank">
                <Icon.Link />
              </a>
            }
            {statistic === 'tested' &&
              panelState.state === 'Total' &&
              testedToolTip}
          </div>
        ))}
      </div>

      <div className="meta">
        {currentMapMeta.mapType === MAP_TYPES.STATE &&
          <div
            className='map-button'
            onClick={() => history.push(`state/${currentMapCode}`)}
          >
            {t('Visit state page')}
            <Icon.ArrowRightCircle />
          </div>
        }

        {currentMapMeta.mapType !== MAP_TYPES.STATE && panelState.last_updated && (
          <div className="last-update">
            <h6>{t('Last updated')}</h6>
            <h3>
              {`${formatLastUpdated(panelState.last_updated)} ${t('ago')}`}
            </h3>
          </div>
        )}

        <h2 className={classnames(mapStatistic, {[hoveredRegion?.zone?.status]: currentMap.option === MAP_OPTIONS.ZONES})}>
          {t(hoveredRegion.name)}
          {hoveredRegion.name === 'Unknown' &&
            ` (${t(STATE_CODES[regionHighlighted.stateCode])})`}
        </h2>

        {currentMapMeta.mapType === MAP_TYPES.STATE && (
          <div
            className='map-button'
            onClick={() => switchMap('India')}
          >
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

      <div>
        {mapStatistic && (
          <MapVisualizer
            currentMap={currentMap}
            data={currentMapData}
            changeMap={switchMap}
            regionHighlighted={regionHighlighted}
            setRegionHighlighted={setRegionHighlighted}
            statistic={mapStatistic}
            isCountryLoaded={isCountryLoaded}
          />
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

      <h6 className={classnames('footnote', 'table-fineprint')}>
        &dagger; {`${t('Based on 2019 population projection by NCP')} (`}
        <a
          href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
          target="_noblank"
          style={{color: '#6c757d'}}
        >
          {t('source')}
        </a>
        )
      </h6>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.regionHighlighted, currProps.regionHighlighted)) {
    return false;
  }
  if (!equal(prevProps.mapStatistic, currProps.mapStatistic)) {
    return false;
  }
  if (!equal(prevProps.anchor, currProps.anchor)) {
    return false;
  }
  let stateName = prevProps.mapName;
  if (stateName === 'India') stateName = 'Total';
  const stateCode = STATE_CODES_REVERSE[stateName];
  if (
    !equal(
      prevProps.data[stateCode].last_updated,
      currProps.data[stateCode].last_updated
    )
  ) {
    return false;
  }
  return true;
};

export default React.memo(MapExplorer, isEqual);
