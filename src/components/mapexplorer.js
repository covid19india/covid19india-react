import ChoroplethMap from './choropleth';
import {testedToolTip} from './tooltips';

import {
  MAP_META,
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_CODES_REVERSE,
  STATE_POPULATIONS,
} from '../constants';
import {formatDate, formatNumber} from '../utils/commonfunctions';

import {formatDistance, format, parse} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.regionHighlighted, currProps.regionHighlighted)) {
    return false;
  }
  if (!equal(prevProps.mapOption, currProps.mapOption)) {
    return false;
  }
  if (!equal(prevProps.anchor, currProps.anchor)) {
    return false;
  }
  return true;
};

const getRegionFromState = (state) => {
  if (!state) return;
  const region = {...state};
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = {...districtData};
  return region;
};

function MapExplorer({
  mapName,
  states,
  districts,
  zones,
  stateTestData,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  mapOption,
  setMapOption,
  isCountryLoaded = true,
}) {
  const {t} = useTranslation();
  const [currentMap, setCurrentMap] = useState({
    name: mapName,
    stat: MAP_STATISTICS.TOTAL,
    view:
      MAP_META[mapName].mapType === MAP_TYPES.COUNTRY
        ? MAP_VIEWS.STATES
        : MAP_VIEWS.DISTRICTS,
  });
  const currentMapMeta = MAP_META[currentMap.name];

  const [statistic, currentMapData] = useMemo(() => {
    let currentMapData = {};
    let statistic = {};
    if (currentMap.stat === MAP_STATISTICS.ZONE) {
      const dataTypes = ['Red', 'Orange', 'Green'];
      statistic = dataTypes.reduce((acc, dtype) => {
        acc[dtype] = 0;
        return acc;
      }, {});
      if (currentMapMeta.mapType === MAP_TYPES.COUNTRY) {
        currentMapData = Object.keys(zones).reduce((acc1, state) => {
          acc1[state] = Object.keys(zones[state]).reduce((acc2, district) => {
            const zone = zones[state][district].zone;
            if (zone) {
              acc2[district] = zone;
              statistic[zone] += 1;
            }
            return acc2;
          }, {});
          return acc1;
        }, {});
      } else if (currentMapMeta.mapType === MAP_TYPES.STATE) {
        const state = currentMap.name;
        currentMapData[state] = Object.keys(zones[state]).reduce(
          (acc, district) => {
            const zone = zones[state][district].zone;
            if (zone) {
              acc[district] = zone;
              statistic[zone] += 1;
            }
            return acc;
          },
          {}
        );
      }
    } else {
      const dataTypes = ['confirmed', 'active', 'recovered', 'deceased'];
      statistic = dataTypes.reduce((acc, dtype) => {
        acc[dtype] = {total: 0, max: 0};
        return acc;
      }, {});
      if (currentMapMeta.mapType === MAP_TYPES.COUNTRY) {
        currentMapData = states.reduce((acc, state) => {
          acc[state.state] = {};
          dataTypes.forEach((dtype) => {
            let typeCount = parseInt(
              state[dtype !== 'deceased' ? dtype : 'deaths']
            );
            if (currentMap.stat === MAP_STATISTICS.PER_MILLION)
              typeCount = (1e6 * typeCount) / STATE_POPULATIONS[state.state];
            if (state.state !== 'Total') {
              statistic[dtype].total += typeCount;
              if (typeCount > statistic[dtype].max) {
                statistic[dtype].max = typeCount;
              }
            }
            acc[state.state][dtype] = typeCount;
          });
          return acc;
        }, {});
      } else if (currentMapMeta.mapType === MAP_TYPES.STATE) {
        const districtWiseData = (
          districts[currentMap.name] || {districtData: {}}
        ).districtData;
        currentMapData[currentMap.name] = Object.keys(districtWiseData).reduce(
          (acc, district) => {
            acc[district] = {};
            dataTypes.forEach((dtype) => {
              const typeCount = parseInt(districtWiseData[district][dtype]);
              statistic[dtype].total += typeCount;
              if (typeCount > statistic[dtype].max) {
                statistic[dtype].max = typeCount;
              }
              acc[district][dtype] = typeCount;
            });
            return acc;
          },
          {}
        );
        currentMapData[currentMap.name].Total = states.find(
          (state) => currentMap.name === state.state
        );
      }
    }
    return [statistic, currentMapData];
  }, [
    currentMap.name,
    currentMap.stat,
    currentMapMeta.mapType,
    districts,
    zones,
    states,
  ]);

  const [hoveredRegion, panelRegion] = useMemo(() => {
    if (!regionHighlighted.district) {
      const state = getRegionFromState(
        states.find((state) => regionHighlighted.state === state.state)
      );
      return [state, state];
    } else {
      const stateDistrictObj = districts[regionHighlighted.state] || {
        districtData: {},
      };
      const districtData = stateDistrictObj.districtData[
        regionHighlighted.district
      ] || {
        confirmed: 0,
        active: 0,
        recovered: 0,
        deaths: 0,
      };
      const district = getRegionFromDistrict(
        districtData,
        regionHighlighted.district
      );
      let state = getRegionFromState(
        states.find((state) => state.state === regionHighlighted.state)
      );
      district.district = regionHighlighted.district;
      district.state = state.state;
      if (currentMapMeta.mapType === MAP_TYPES.COUNTRY)
        state = states.find((state) => state.state === 'Total');
      return [district, state];
    }
  }, [states, districts, currentMapMeta.mapType, regionHighlighted]);

  useEffect(() => {
    if (regionHighlighted === undefined || regionHighlighted === null) return;

    if ('district' in regionHighlighted) {
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
          stat:
            currentMap.stat === MAP_STATISTICS.PER_MILLION
              ? MAP_STATISTICS.TOTAL
              : currentMap.stat,
        });
      }
    } else if (isCountryLoaded && currentMapMeta.mapType === MAP_TYPES.STATE) {
      setCurrentMap({
        name: 'India',
        view:
          currentMap.stat === MAP_STATISTICS.ZONE
            ? MAP_VIEWS.DISTRICTS
            : MAP_VIEWS.STATES,
        stat: currentMap.stat,
      });
    }
  }, [isCountryLoaded, regionHighlighted, currentMap, currentMapMeta.mapType]);

  const switchMapToState = useCallback(
    (state) => {
      const newMapMeta = MAP_META[state];
      if (!newMapMeta) {
        return;
      }
      if (newMapMeta.mapType === MAP_TYPES.STATE) {
        const {districtData} = districts[state] || {
          districtData: {},
        };
        const topDistrict = Object.keys(districtData)
          .filter((state) => state !== 'Unknown')
          .sort((a, b) => {
            return districtData[b].confirmed - districtData[a].confirmed;
          })[0];
        ReactDOM.unstable_batchedUpdates(() => {
          setRegionHighlighted({
            district: topDistrict,
            state: state,
          });
          setCurrentMap({
            name: state,
            view: MAP_VIEWS.DISTRICTS,
            stat:
              currentMap.stat === MAP_STATISTICS.PER_MILLION
                ? MAP_STATISTICS.TOTAL
                : currentMap.stat,
          });
        });
      } else {
        ReactDOM.unstable_batchedUpdates(() => {
          setCurrentMap({
            name: 'India',
            view:
              currentMap.stat === MAP_STATISTICS.ZONE
                ? MAP_VIEWS.DISTRICTS
                : MAP_VIEWS.STATES,
            stat: currentMap.stat,
          });
          setRegionHighlighted({
            state: 'Total',
          });
        });
      }
    },
    [currentMap.stat, districts, setRegionHighlighted]
  );

  const testObj = useMemo(
    () =>
      stateTestData.find(
        (obj) => obj.state === panelRegion.state && obj.totaltested !== ''
      ),
    [stateTestData, panelRegion]
  );

  let hoveredRegionCount;
  let hoveredRegionZone;
  if (currentMap.stat !== MAP_STATISTICS.ZONE) {
    const data =
      hoveredRegion.district && currentMapData[hoveredRegion.state]
        ? currentMapData[hoveredRegion.state][hoveredRegion.district]
        : hoveredRegion.state !== currentMap.name
        ? currentMapData[hoveredRegion.state]
        : currentMapData[hoveredRegion.state].Total;
    hoveredRegionCount = data
      ? currentMap.stat === MAP_STATISTICS.PER_MILLION
        ? Number(parseFloat(data[mapOption]).toFixed(2))
        : data[mapOption]
      : 0;
  } else {
    hoveredRegionZone =
      zones[hoveredRegion.state] &&
      zones[hoveredRegion.state][hoveredRegion.district]
        ? zones[hoveredRegion.state][hoveredRegion.district].zone
        : '';
  }

  return (
    <div
      className={`MapExplorer fadeInUp ${
        anchor === 'mapexplorer' ? 'stickied' : ''
      }`}
      style={{
        animationDelay: '1.5s',
        display: anchor === 'timeseries' ? 'none' : '',
      }}
    >
      {window.innerWidth > 769 && (
        <div
          className={`anchor ${anchor === 'mapexplorer' ? 'stickied' : ''}`}
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
          {window.innerWidth <= 769 ? t('Tap') : t('Hover')} over a{' '}
          {currentMapMeta.mapType === MAP_TYPES.COUNTRY
            ? t('state/UT')
            : t('district')}{' '}
          {t('for more details')}
        </h6>
      </div>

      <div className="map-stats">
        <div
          className={`stats fadeInUp ${
            mapOption === 'confirmed' ? 'focused' : ''
          }`}
          style={{animationDelay: '2s'}}
          onClick={() => setMapOption('confirmed')}
        >
          <h5>{window.innerWidth <= 769 ? t('Cnfmd') : t('Confirmed')}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.confirmed)}</h1>
            <h6>{`+${formatNumber(panelRegion.deltaconfirmed)}`}</h6>
          </div>
        </div>

        <div
          className={`stats is-blue fadeInUp ${
            mapOption === 'active' ? 'focused' : ''
          }`}
          style={{animationDelay: '2.1s'}}
          onClick={() => setMapOption('active')}
        >
          <h5>{window.innerWidth <= 769 ? t('Actv') : t('Active')}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.active)}</h1>
            <h6>{` `}</h6>
          </div>
        </div>

        <div
          className={`stats is-green fadeInUp ${
            mapOption === 'recovered' ? 'focused' : ''
          }`}
          style={{animationDelay: '2.2s'}}
          onClick={() => setMapOption('recovered')}
        >
          <h5>{window.innerWidth <= 769 ? t('Rcvrd') : t('Recovered')}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.recovered)}</h1>
            <h6>{`+${formatNumber(panelRegion.deltarecovered)}`}</h6>
          </div>
        </div>

        <div
          className={`stats is-gray fadeInUp ${
            mapOption === 'deceased' ? 'focused' : ''
          }`}
          style={{animationDelay: '2.3s'}}
          onClick={() => setMapOption('deceased')}
        >
          <h5>{window.innerWidth <= 769 ? t('Dcsd') : t('Deceased')}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.deaths)}</h1>
            <h6>{`+${formatNumber(panelRegion.deltadeaths)}`}</h6>
          </div>
        </div>

        <div
          className="stats is-purple tested fadeInUp"
          style={{animationDelay: '2.4s'}}
        >
          <h5>{t('Tested')}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(testObj?.totaltested)}</h1>
          </div>
          <h6 className="timestamp">
            {!isNaN(parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()))
              ? `${t('As of')} ${format(
                  parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()),
                  'dd MMM'
                )}`
              : ''}
          </h6>
          {testObj?.totaltested?.length > 1 && (
            <a href={testObj.source} target="_noblank">
              <Icon.Link />
            </a>
          )}
          {panelRegion.state === 'Total' ? testedToolTip : ''}
        </div>
      </div>

      <div className="meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2
          className={`${
            currentMap.stat !== MAP_STATISTICS.ZONE
              ? mapOption !== 'confirmed'
                ? mapOption
                : ''
              : hoveredRegionZone
          }`}
        >
          {hoveredRegion.district
            ? t(hoveredRegion.district)
            : t(hoveredRegion.state)}
        </h2>

        {currentMapMeta.mapType !== MAP_TYPES.STATE &&
          panelRegion.lastupdatedtime && (
            <div className="last-update">
              <h6>{t('Last updated')}</h6>
              <h3>
                {isNaN(Date.parse(formatDate(panelRegion.lastupdatedtime)))
                  ? ''
                  : formatDistance(
                      new Date(formatDate(panelRegion.lastupdatedtime)),
                      new Date()
                    ) +
                    ' ' +
                    t('ago')}
              </h3>
            </div>
          )}

        {currentMapMeta.mapType === MAP_TYPES.STATE ? (
          <Link to={`state/${STATE_CODES_REVERSE[panelRegion.state]}`}>
            <div className="button state-page-button">
              <abbr>{t('Visit state page')}</abbr>
              <Icon.ArrowRightCircle />
            </div>
          </Link>
        ) : null}

        {currentMap.stat !== MAP_STATISTICS.ZONE &&
        (currentMapMeta.mapType === MAP_TYPES.STATE ||
          (currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
            currentMap.stat !== MAP_STATISTICS.TOTAL)) ? (
          <h1
            className={`district ${mapOption !== 'confirmed' ? mapOption : ''}`}
          >
            {hoveredRegionCount}
            <br />
            <span>
              {mapOption}{' '}
              {currentMap.stat === MAP_STATISTICS.PER_MILLION
                ? ` ${t('per million')}`
                : ''}
            </span>
          </h1>
        ) : null}

        {currentMapMeta.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => switchMapToState('India')}
          >
            Back
          </div>
        ) : null}

        {currentMapMeta.mapType === MAP_TYPES.STATE &&
        currentMapData.Unknown &&
        currentMapData.Unknown[mapOption] > 0 ? (
          <h4 className="unknown">
            {t('Districts unknown for')} {currentMapData.Unknown[mapOption]}{' '}
            {t('people')}
          </h4>
        ) : null}
      </div>

      <div>
        {mapOption && (
          <ChoroplethMap
            statistic={statistic}
            currentMap={currentMap}
            mapData={currentMapData}
            regionHighlighted={regionHighlighted}
            setRegionHighlighted={setRegionHighlighted}
            changeMap={switchMapToState}
            isCountryLoaded={isCountryLoaded}
            mapOption={mapOption}
          />
        )}
      </div>

      <div className="tabs-map">
        <div
          className={`tab ${
            currentMap.stat === MAP_STATISTICS.TOTAL ? 'focused' : ''
          }`}
          onClick={() => {
            setCurrentMap({
              name: currentMap.name,
              view:
                currentMapMeta.mapType === MAP_TYPES.COUNTRY
                  ? MAP_VIEWS.STATES
                  : MAP_VIEWS.DISTRICTS,
              stat: MAP_STATISTICS.TOTAL,
            });
            if (currentMapMeta.mapType === MAP_TYPES.COUNTRY)
              setRegionHighlighted({
                state: regionHighlighted.state,
              });
          }}
        >
          <h4>{t('Total Cases')}</h4>
        </div>
        {isCountryLoaded && (
          <div
            className={`tab ${
              currentMap.stat === MAP_STATISTICS.PER_MILLION ? 'focused' : ''
            }`}
            onClick={() => {
              if (currentMapMeta.mapType === MAP_TYPES.STATE) return;
              setCurrentMap({
                name: currentMap.name,
                view: MAP_VIEWS.STATES,
                stat: MAP_STATISTICS.PER_MILLION,
              });
              setRegionHighlighted({
                state: regionHighlighted.state,
              });
            }}
          >
            <h4>
              {t('Cases per million')}
              <sup>&dagger;</sup>
            </h4>
          </div>
        )}
        <div
          className={`tab ${
            currentMap.stat === MAP_STATISTICS.ZONE ? 'focused' : ''
          }`}
          onClick={() => {
            setCurrentMap({
              name: currentMap.name,
              view: MAP_VIEWS.DISTRICTS,
              stat: MAP_STATISTICS.ZONE,
            });
            if (currentMapMeta.mapType === MAP_TYPES.COUNTRY)
              setRegionHighlighted({
                state: 'Total',
              });
          }}
        >
          <h4>Zones</h4>
        </div>
      </div>

      <h6 className="footnote table-fineprint">
        &dagger; {t('Based on 2019 population projection by NCP') + '('}
        <a
          href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
          target="_noblank"
          style={{color: '#6c757d'}}
        >
          {t('report')}
        </a>
        )
      </h6>
    </div>
  );
}

export default React.memo(MapExplorer, isEqual);
