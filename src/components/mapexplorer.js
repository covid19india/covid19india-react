import ChoroplethMap from './choropleth';
import {testedToolTip} from './tooltips';

import {
  MAP_STATISTICS,
  MAP_TYPES,
  MAP_META,
  STATE_POPULATIONS,
} from '../constants';
import {formatDate, formatNumber} from '../utils/commonfunctions';

import {formatDistance, format, parse} from 'date-fns';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {useLocalStorage} from 'react-use';

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
  mapMeta,
  states,
  stateDistrictWiseData,
  stateTestData,
  regionHighlighted,
  onMapHighlightChange,
  isCountryLoaded,
  anchor,
  setAnchor,
  mapOptionProp,
}) {
  const [selectedRegion, setSelectedRegion] = useState({});
  const [panelRegion, setPanelRegion] = useState(getRegionFromState(states[0]));
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState(
    getRegionFromState(states[0])
  );
  const [testObj, setTestObj] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta);
  const [statisticOption, setStatisticOption] = useState(MAP_STATISTICS.TOTAL);
  const [mapOption, setMapOption] = useLocalStorage('mapOption', 'active');

  const [statistic, currentMapData] = useMemo(() => {
    const dataTypes = ['confirmed', 'active', 'recovered', 'deceased'];
    const statistic = dataTypes.reduce((acc, dtype) => {
      acc[dtype] = {total: 0, max: 0};
      return acc;
    }, {});
    let currentMapData = {};

    if (currentMap.mapType === MAP_TYPES.COUNTRY) {
      currentMapData = states.reduce((acc, state) => {
        acc[state.state] = {};

        dataTypes.forEach((dtype) => {
          let typeCount = parseInt(
            state[dtype !== 'deceased' ? dtype : 'deaths']
          );
          if (statisticOption)
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
    } else if (currentMap.mapType === MAP_TYPES.STATE) {
      setStatisticOption(MAP_STATISTICS.TOTAL);
      const districtWiseData = (
        stateDistrictWiseData[currentMap.name] || {districtData: {}}
      ).districtData;
      currentMapData = Object.keys(districtWiseData).reduce((acc, district) => {
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
      }, {});
      currentMapData[currentMap.name] = states.find(
        (state) => currentMap.name === state.state
      );
    }
    return [statistic, currentMapData];
  }, [
    currentMap.mapType,
    currentMap.name,
    states,
    stateDistrictWiseData,
    statisticOption,
  ]);

  const setHoveredRegion = useCallback(
    (name, currentMap) => {
      if (currentMap.mapType === MAP_TYPES.COUNTRY) {
        const region = getRegionFromState(
          states.find((state) => name === state.state)
        );
        setCurrentHoveredRegion(region);
        setPanelRegion(region);
        onMapHighlightChange(region);
      } else if (currentMap.mapType === MAP_TYPES.STATE) {
        const state = stateDistrictWiseData[currentMap.name] || {
          districtData: {},
        };
        let districtData = state.districtData[name];
        if (!districtData) {
          districtData = {
            confirmed: 0,
            active: 0,
            recovered: 0,
            deaths: 0,
          };
        }
        const currentHoveredRegion = getRegionFromDistrict(districtData, name);
        const panelRegion = getRegionFromState(
          states.find((state) => currentMap.name === state.state)
        );
        setPanelRegion(panelRegion);
        currentHoveredRegion.statecode = panelRegion.statecode;
        setCurrentHoveredRegion(currentHoveredRegion);
        panelRegion.districtName = currentHoveredRegion.name;
        if (onMapHighlightChange) onMapHighlightChange(panelRegion);
      }
    },
    [states, stateDistrictWiseData, onMapHighlightChange]
  );

  useEffect(() => {
    if (mapOptionProp) setMapOption(mapOptionProp);
  }, [mapOptionProp, setMapOption]);

  useEffect(() => {
    if (regionHighlighted === undefined || regionHighlighted === null) return;

    const isState = !('district' in regionHighlighted);
    if (isState) {
      const newMap = MAP_META['India'];
      setCurrentMap(newMap);
      const region = getRegionFromState(regionHighlighted.state);
      setHoveredRegion(region.name, newMap);
      setSelectedRegion(region.name);
    } else {
      const newMap = MAP_META[regionHighlighted.state.state];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setHoveredRegion(regionHighlighted.district, newMap);
      setSelectedRegion(regionHighlighted.district);
    }
  }, [regionHighlighted, setHoveredRegion]);

  const switchMapToState = useCallback(
    (name) => {
      const newMap = MAP_META[name];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setSelectedRegion(null);
      if (newMap.mapType === MAP_TYPES.COUNTRY) {
        setHoveredRegion(states[0].state, newMap);
      } else if (newMap.mapType === MAP_TYPES.STATE) {
        const {districtData} = stateDistrictWiseData[name] || {
          districtData: {},
        };
        const topDistrict = Object.keys(districtData)
          .filter((name) => name !== 'Unknown')
          .sort((a, b) => {
            return districtData[b].confirmed - districtData[a].confirmed;
          })[0];
        setHoveredRegion(topDistrict, newMap);
        setSelectedRegion(topDistrict);
      }
    },
    [setHoveredRegion, stateDistrictWiseData, states]
  );

  useEffect(() => {
    setTestObj(
      stateTestData.find(
        (obj) => obj.state === panelRegion.name && obj.totaltested !== ''
      )
    );
  }, [panelRegion, stateTestData, testObj]);

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
          {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state/UT' : 'district'}{' '}
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
          {currentHoveredRegion.name === 'Total' ? testedToolTip : ''}
        </div>
      </div>

      <div className="meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2 className={`${mapOption !== 'confirmed' ? mapOption : ''}`}>
          {currentHoveredRegion.name}
        </h2>

        {currentHoveredRegion.lastupdatedtime && (
          <div className="last-update">
            <h6>Last updated</h6>
            <h3>
              {isNaN(
                Date.parse(formatDate(currentHoveredRegion.lastupdatedtime))
              )
                ? ''
                : formatDistance(
                    new Date(formatDate(currentHoveredRegion.lastupdatedtime)),
                    new Date()
                  ) + ' ago'}
            </h3>
          </div>
        )}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <Link to={`state/${currentHoveredRegion.statecode}`}>
            <div className="button state-page-button">
              <abbr>Visit state page</abbr>
              <Icon.ArrowRightCircle />
            </div>
          </Link>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ||
        (currentMap.mapType === MAP_TYPES.COUNTRY &&
          statisticOption === MAP_STATISTICS.PER_MILLION) ? (
          <h1
            className={`district ${mapOption !== 'confirmed' ? mapOption : ''}`}
          >
            {currentMapData[currentHoveredRegion.name]
              ? statisticOption === MAP_STATISTICS.PER_MILLION
                ? Number(
                    parseFloat(
                      currentMapData[currentHoveredRegion.name][mapOption]
                    ).toFixed(2)
                  )
                : currentMapData[currentHoveredRegion.name][mapOption]
              : 0}
            <br />
            <span>
              {mapOption}{' '}
              {statisticOption === MAP_STATISTICS.PER_MILLION
                ? ' per million'
                : ''}
            </span>
          </h1>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => switchMapToState('India')}
          >
            Back
          </div>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE &&
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
          mapMeta={currentMap}
          mapData={currentMapData}
          setHoveredRegion={setHoveredRegion}
          changeMap={switchMapToState}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isCountryLoaded={isCountryLoaded}
          mapOption={mapOption}
          statisticOption={statisticOption}
        />
      )}

      <div className="tabs-map">
        <div
          className={`tab ${
            statisticOption === MAP_STATISTICS.TOTAL ? 'focused' : ''
          }`}
          onClick={() => {
            setStatisticOption(MAP_STATISTICS.TOTAL);
          }}
        >
          <h4>Total Cases</h4>
        </div>
        <div
          className={`tab ${
            currentMap.mapType === MAP_TYPES.COUNTRY &&
            statisticOption === MAP_STATISTICS.PER_MILLION
              ? 'focused'
              : ''
          }`}
          onClick={() => {
            if (currentMap.mapType === MAP_TYPES.COUNTRY)
              setStatisticOption(MAP_STATISTICS.PER_MILLION);
          }}
        >
          <h4>
            Cases per million<sup>&dagger;</sup>
          </h4>
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

export default React.memo(MapExplorer);
