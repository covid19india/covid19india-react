import ChoroplethMap from './choropleth';
import {testedToolTip} from './tooltips';

import {
  MAP_META,
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_VIEWS,
  STATE_POPULATIONS,
} from '../constants';
import {formatDate, formatNumber} from '../utils/commonfunctions';

import {formatDistance, format, parse} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import * as Icon from 'react-feather';
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
  if (!region.name) region.name = region.state;
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = {...districtData};
  if (!region.name) region.name = name;
  return region;
};

function MapExplorer({
  mapName,
  states,
  districts,
  zones,
  stateTestData,
  regionHighlighted,
  isCountryLoaded,
  anchor,
  setAnchor,
  mapOption,
  setMapOption,
}) {
  const [selectedRegion, setSelectedRegion] = useState(
    getRegionFromState(states[0])
  );
  const [currentMap, setCurrentMap] = useState({
    name: mapName,
    stat: MAP_STATISTICS.TOTAL,
    view: MAP_VIEWS.STATES,
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
      currentMapData = zones;
      if (currentMapMeta.mapType === MAP_TYPES.COUNTRY) {
        statistic = Object.values(zones).reduce((acc1, d1) => {
          acc1 = Object.values(d1).reduce((acc2, d2) => {
            if (d2.zone) acc2[d2.zone] += 1;
            return acc2;
          }, acc1);
          return acc1;
        }, statistic);
      } else if (currentMapMeta.mapType === MAP_TYPES.STATE) {
        statistic = Object.values(zones[currentMap.name]).reduce((acc, d) => {
          if (d.zone) acc[d.zone] += 1;
          return acc;
        }, statistic);
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
    if (!selectedRegion.district) {
      const state = getRegionFromState(
        states.find((state) => selectedRegion.state === state.state)
      );
      return [state, state];
    } else {
      const stateDistrictObj = districts[selectedRegion.state] || {
        districtData: {},
      };
      const districtData = stateDistrictObj.districtData[
        selectedRegion.district
      ] || {
        confirmed: 0,
        active: 0,
        recovered: 0,
        deaths: 0,
      };
      const district = getRegionFromDistrict(
        districtData,
        selectedRegion.district
      );
      const state = getRegionFromState(
        states.find((state) => selectedRegion.state === state.state)
      );
      district.statecode = state.statecode;
      return [district, state];
    }
  }, [states, districts, selectedRegion]);

  useEffect(() => {
    if (regionHighlighted === undefined || regionHighlighted === null) return;

    const isState = !('district' in regionHighlighted);
    if (isState) {
      if (currentMapMeta.mapType === MAP_TYPES.STATE) {
        setCurrentMap({
          name: 'India',
          view:
            currentMap.stat === MAP_STATISTICS.ZONE
              ? MAP_VIEWS.DISTRICTS
              : MAP_VIEWS.STATES,
          stat: currentMap.stat,
        });
      }
      setSelectedRegion({
        state: regionHighlighted.state.state,
      });
    } else {
      if (
        currentMap.name !== regionHighlighted.state.state &&
        !(
          currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.view === MAP_VIEWS.DISTRICTS
        )
      ) {
        const state = regionHighlighted.state.state;
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
      setSelectedRegion({
        district: regionHighlighted.district,
        state: regionHighlighted.state.state,
      });
    }
  }, [regionHighlighted, currentMap, currentMapMeta.mapType]);

  const switchMapToState = useCallback(
    (name) => {
      const newMapMeta = MAP_META[name];
      if (!newMapMeta) {
        return;
      }
      setCurrentMap({
        name: name,
        view: currentMap.view,
        stat: currentMap.stat,
      });
      if (newMapMeta.mapType === MAP_TYPES.STATE) {
        const {districtData} = districts[name] || {
          districtData: {},
        };
        const topDistrict = Object.keys(districtData)
          .filter((name) => name !== 'Unknown')
          .sort((a, b) => {
            return districtData[b].confirmed - districtData[a].confirmed;
          })[0];
        setSelectedRegion({
          district: topDistrict,
          state: name,
        });
      } else {
        setSelectedRegion({
          state: 'Total',
        });
      }
    },
    [districts, currentMap.view, currentMap.stat]
  );

  const testObj = useMemo(
    () =>
      stateTestData.find(
        (obj) => obj.state === panelRegion.name && obj.totaltested !== ''
      ),
    [stateTestData, panelRegion]
  );

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
        <h1>{currentMap.name} Map</h1>
        <h6>
          {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
          {currentMapMeta.mapType === MAP_TYPES.COUNTRY
            ? 'state/UT'
            : 'district'}{' '}
          for more details
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
          <h5>{window.innerWidth <= 769 ? 'Cnfmd' : 'Confirmed'}</h5>
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
          <h5>{window.innerWidth <= 769 ? 'Actv' : 'Active'}</h5>
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
          <h5>{window.innerWidth <= 769 ? 'Rcvrd' : 'Recovered'}</h5>
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
          <h5>{window.innerWidth <= 769 ? 'Dcsd' : 'Deceased'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.deaths)}</h1>
            <h6>{`+${formatNumber(panelRegion.deltadeaths)}`}</h6>
          </div>
        </div>

        <div
          className="stats is-purple tested fadeInUp"
          style={{animationDelay: '2.4s'}}
        >
          <h5>Tested</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(testObj?.totaltested)}</h1>
          </div>
          <h6 className="timestamp">
            {!isNaN(parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()))
              ? `As of ${format(
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
          {hoveredRegion.name === 'Total' ? testedToolTip : ''}
        </div>
      </div>

      <div className="meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2 className={`${mapOption !== 'confirmed' ? mapOption : ''}`}>
          {hoveredRegion.name}
        </h2>

        {currentMapMeta.mapType !== MAP_TYPES.STATE &&
          hoveredRegion.lastupdatedtime && (
            <div className="last-update">
              <h6>Last updated</h6>
              <h3>
                {isNaN(Date.parse(formatDate(hoveredRegion.lastupdatedtime)))
                  ? ''
                  : formatDistance(
                      new Date(formatDate(hoveredRegion.lastupdatedtime)),
                      new Date()
                    ) + ' ago'}
              </h3>
            </div>
          )}

        {currentMapMeta.mapType === MAP_TYPES.STATE ? (
          <Link to={`state/${hoveredRegion.statecode}`}>
            <div className="button state-page-button">
              <abbr>Visit state page</abbr>
              <Icon.ArrowRightCircle />
            </div>
          </Link>
        ) : null}

        {currentMapMeta.mapType === MAP_TYPES.STATE ||
        (currentMapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.stat === MAP_STATISTICS.PER_MILLION) ? (
          <h1
            className={`district ${mapOption !== 'confirmed' ? mapOption : ''}`}
          >
            {currentMapData[hoveredRegion.name]
              ? currentMap.stat === MAP_STATISTICS.PER_MILLION
                ? Number(
                    parseFloat(
                      currentMapData[hoveredRegion.name][mapOption]
                    ).toFixed(2)
                  )
                : currentMapData[hoveredRegion.name][mapOption]
              : 0}
            <br />
            <span>
              {mapOption}{' '}
              {currentMap.stat === MAP_STATISTICS.PER_MILLION
                ? ' per million'
                : ''}
            </span>
          </h1>
        ) : null}

        {currentMapMeta.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => {
              setCurrentMap({
                name: 'India',
                view:
                  currentMap.stat === MAP_STATISTICS.ZONE
                    ? MAP_VIEWS.DISTRICTS
                    : MAP_VIEWS.STATES,
                stat: currentMap.stat,
              });
            }}
          >
            Back
          </div>
        ) : null}

        {currentMapMeta.mapType === MAP_TYPES.STATE &&
        currentMapData.Unknown &&
        currentMapData.Unknown[mapOption] > 0 ? (
          <h4 className="unknown">
            Districts unknown for {currentMapData.Unknown[mapOption]} people
          </h4>
        ) : null}
      </div>

      {mapOption && (
        <ChoroplethMap
          statistic={statistic}
          currentMap={currentMap}
          mapData={currentMapData}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          changeMap={switchMapToState}
          isCountryLoaded={isCountryLoaded}
          mapOption={mapOption}
        />
      )}

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
          }}
        >
          <h4>Total Cases</h4>
        </div>
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
          }}
        >
          <h4>
            Cases per million<sup>&dagger;</sup>
          </h4>
        </div>
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
          }}
        >
          <h4>Zones</h4>
        </div>
      </div>

      <h6 className="footnote table-fineprint">
        &dagger; Based on 2019 population projection by NCP (
        <a
          href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
          target="_noblank"
          style={{color: '#6c757d'}}
        >
          report
        </a>
        )
      </h6>
    </div>
  );
}

export default React.memo(MapExplorer, isEqual);
