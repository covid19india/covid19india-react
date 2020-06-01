import ChoroplethMap from './choropleth';
import {testedToolTip} from './tooltips';

import {
  MAP_META,
  MAP_OPTIONS,
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_CODES_REVERSE,
  STATE_POPULATIONS,
} from '../constants';
import {
  capitalize,
  formatNumber,
  formatDayMonth,
  formatLastUpdated,
} from '../utils/commonfunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

const preProcess = (original) => {
  if (!original)
    return {
      ...['total', 'delta'].map((ctype) => {
        return {
          [ctype]: {
            active: 0,
            confirmed: 0,
            deceased: 0,
            recovered: 0,
          },
        };
      }),
    };
  return produce(original, (draft) => {
    draft.total.active =
      draft.total.confirmed - draft.total.recovered - draft.total.deceased;
    draft.delta.active =
      draft.delta.confirmed - draft.delta.recovered - draft.delta.deceased;
  });
};

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
  const [currentMap, setCurrentMap] = useState({
    name: mapName,
    view:
      MAP_META[mapName].mapType === MAP_TYPES.COUNTRY
        ? MAP_VIEWS.STATES
        : MAP_VIEWS.DISTRICTS,
    option: MAP_OPTIONS.TOTAL,
  });
  const currentMapMeta = MAP_META[currentMap.name];

  useEffect(() => {
    if (regionHighlighted.district) {
      if (
        currentMap.name !== regionHighlighted.state &&
        !(
          currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.view === MAP_VIEWS.DISTRICTS
        )
      ) {
        const state = regionHighlighted.state;
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
          currentMap.option === MAP_OPTIONS.ZONE
            ? MAP_VIEWS.DISTRICTS
            : MAP_VIEWS.STATES,
        option: currentMap.option,
      });
    }
  }, [
    isCountryLoaded,
    regionHighlighted.state,
    regionHighlighted.district,
    currentMap,
    currentMapMeta.mapType,
  ]);

  const switchMap = useCallback(
    (state) => {
      const newMapMeta = MAP_META[state];
      if (!newMapMeta) {
        return;
      }
      if (newMapMeta.mapType === MAP_TYPES.STATE) {
        const districts = data[state].districts;
        const topDistrict = Object.keys(districts)
          .filter((d) => d !== 'Unknown')
          .sort((a, b) => {
            return (
              districts[b].total[mapStatistic] -
              districts[a].total[mapStatistic]
            );
          })[0];
        ReactDOM.unstable_batchedUpdates(() => {
          setRegionHighlighted({
            district: topDistrict,
            state: state,
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
              currentMap.option === MAP_OPTIONS.ZONE
                ? MAP_VIEWS.DISTRICTS
                : MAP_VIEWS.STATES,
            option: currentMap.option,
          });
          setRegionHighlighted({
            state: 'Total',
          });
        });
      }
    },
    [data, currentMap.option, mapStatistic, setRegionHighlighted]
  );

  const panelState = useMemo(() => {
    let state =
      currentMap.view === MAP_VIEWS.STATES
        ? regionHighlighted.state
        : currentMap.name;
    if (state === 'India') state = 'Total';
    const stateCode = STATE_CODES_REVERSE[state];
    const stateData = preProcess(data[stateCode]);
    return {
      state: state,
      stateCode: stateCode,
      lastUpdated: data[stateCode].last_updated,
      ...stateData,
    };
  }, [data, regionHighlighted.state, currentMap.name, currentMap.view]);

  const hoveredRegion = useMemo(() => {
    const stateCode = STATE_CODES_REVERSE[regionHighlighted.state];
    let hoveredData = preProcess(
      regionHighlighted.district
        ? data[stateCode].districts[regionHighlighted.district]
        : data[stateCode]
    );
    if (currentMap.option === MAP_OPTIONS.PER_MILLION) {
      const population = STATE_POPULATIONS[stateCode];
      hoveredData = produce(hoveredData, (draft) => {
        ['total', 'delta'].forEach((ctype) => {
          MAP_STATISTICS.forEach((statistic) => {
            draft[ctype][statistic] *= 1e6 / population;
          });
        });
      });
    }
    return {
      name: regionHighlighted.district || regionHighlighted.state,
      ...hoveredData,
    };
  }, [
    data,
    regionHighlighted.state,
    regionHighlighted.district,
    currentMap.option,
  ]);

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
            state: regionHighlighted.state,
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
          state: regionHighlighted.state,
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
            state: 'Total',
          });
        return;
      default:
        return;
    }
  };

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
          <Icon.Anchor />
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
        {MAP_STATISTICS.map((statistic) => (
          <div
            key={statistic}
            className={classnames('stats', statistic, {
              focused: statistic === mapStatistic,
            })}
            onClick={() => setMapStatistic(statistic)}
          >
            <h5>{t(capitalize(statistic))}</h5>
            <div className="stats-bottom">
              <h1>
                {formatNumber(
                  statistic !== 'tested'
                    ? panelState.total[statistic]
                    : panelState.total.tested.samples
                )}
              </h1>
              <h6>
                {statistic !== 'tested' &&
                  panelState.delta[statistic] > 0 &&
                  '+'}
                {statistic !== 'tested' &&
                  formatNumber(panelState.delta[statistic])}
                {statistic === 'tested' &&
                  t('As of {{date}}', {
                    date: formatDayMonth(panelState.total.tested.last_updated),
                  })}
              </h6>
            </div>
            {statistic === 'tested' && (
              <a href={panelState.total.tested.source} target="_noblank">
                <Icon.Link />
              </a>
            )}
            {statistic === 'tested' &&
              panelState.state === 'Total' &&
              testedToolTip}
          </div>
        ))}
      </div>

      <div className="meta">
        <h2 className={classnames(mapStatistic, hoveredRegion?.zone?.status)}>
          {t(hoveredRegion.name)}
          {hoveredRegion.name === 'Unknown' &&
            ` (${t(regionHighlighted.state)})`}
        </h2>

        {currentMapMeta.mapType !== MAP_TYPES.STATE && panelState.last_updated && (
          <div className="last-update">
            <h6>{t('Last updated')}</h6>
            <h3>
              {`${formatLastUpdated(panelState.last_updated)} ${t('ago')}`}
            </h3>
          </div>
        )}

        {currentMapMeta.mapType === MAP_TYPES.STATE && (
          <Link to={`state/${STATE_CODES_REVERSE[currentMap.name]}`}>
            <div className="button state-page-button">
              <abbr>{t('Visit state page')}</abbr>
              <Icon.ArrowRightCircle />
            </div>
          </Link>
        )}

        {currentMap.option !== MAP_OPTIONS.ZONE &&
          ((currentMap.view === MAP_VIEWS.DISTRICTS &&
            regionHighlighted.district) ||
            (currentMap.view === MAP_VIEWS.STATES &&
              currentMap.option !== MAP_OPTIONS.TOTAL)) && (
            <h1 className={classnames('district', mapStatistic)}>
              {formatNumber(hoveredRegion.total[mapStatistic])}
              <br />
              <span>
                {t(mapStatistic)}
                {currentMap.option === MAP_OPTIONS.PER_MILLION &&
                  ` ${t('per million')}`}
              </span>
            </h1>
          )}

        {currentMapMeta.mapType === MAP_TYPES.STATE && (
          <div
            className={classnames('button', 'back-button')}
            onClick={() => switchMap('India')}
          >
            {t('Back')}
          </div>
        )}
      </div>

      {/* <div>
        {mapStatistic && (
          <ChoroplethMap
            currentMap={currentMap}
            mapData={currentMapData}
            regionHighlighted={regionHighlighted}
            setRegionHighlighted={setRegionHighlighted}
            changeMap={switchMap}
            mapStatistic={mapStatistic}
            isCountryLoaded={isCountryLoaded}
          />
        )}
      </div>*/}

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
