import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ChoroplethMap, {highlightRegionInMap} from './choropleth';
import {MAP_TYPES, MAPS_DIR} from '../constants';
import {formatDate} from '../utils/common-functions';
import {formatDistance} from 'date-fns';
import LocalizedStrings from 'react-localization';

const translate = require('../translate/' +
  localStorage.getItem('language') +
  '.json');

const strings = new LocalizedStrings({
  en: {
    hover: 'Hover over a',
    state: 'state',
    district: 'district',
    moreDetails: ' for more details',
    confirmed: 'Confirmed ',
    recovered: 'Recovered ',
    active: 'Active',
    deceased: 'Deceased ',
    map: 'Map',
    back: 'Back',
    lastUpdated: 'Last Updated',
    ago: ' Ago',
    unknownDist: 'Districts unknown for {0} people',
  },
  kan: {
    hover: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ',
    state: 'ರಾಜ್ಯದ ನಕ಼ೆಯ',
    district: 'ಜಿಲ್ಲೆಯ ನಕ಼ೆಯ',
    moreDetails: ' ಮೇಲೆ ಇಣುಕಿ',
    confirmed: 'ಖಚಿತ ',
    recovered: 'ವಾಸಿ ',
    active: 'ಸಕ್ರಿಯ',
    deceased: 'ಸಾವು ',
    map: 'ನಕ಼ೆ',
    back: 'ಹಿಂದಿರುಗು',
    lastUpdated: 'ಕೊನೆ ಬದಲಾವಣೆ',
    ago: ' ಹಿಂದೆ',
    unknownDist: '{0} ಜನರ ಜಿಲ್ಲೆ ಗೊತ್ತಿಲ್ಲ',
  },
});

const mapMeta = {
  India: {
    name: 'India',
    geoDataFile: `${MAPS_DIR}/india.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'india',
  },
  'Andaman and Nicobar Islands': {
    name: 'Andaman and Nicobar Islands',
    geoDataFile: `${MAPS_DIR}/andamannicobarislands.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'andamannicobarislands_district',
  },
  'Arunachal Pradesh': {
    name: 'Arunachal Pradesh',
    geoDataFile: `${MAPS_DIR}/arunachalpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'arunachalpradesh_district',
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    geoDataFile: `${MAPS_DIR}/andhrapradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'andhrapradesh_district',
  },

  Assam: {
    name: 'Assam',
    geoDataFile: `${MAPS_DIR}/assam.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'assam_district',
  },
  Bihar: {
    name: 'Bihar',
    geoDataFile: `${MAPS_DIR}/bihar.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'bihar_district',
  },
  Chhattisgarh: {
    name: 'Chhattisgarh',
    geoDataFile: `${MAPS_DIR}/chhattisgarh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'chhattisgarh_district',
  },
  Delhi: {
    name: 'Delhi',
    geoDataFile: `${MAPS_DIR}/delhi.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'delhi_1997-2012_district',
  },
  Karnataka: {
    name: 'Karnataka',
    geoDataFile: `${MAPS_DIR}/karnataka.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'karnataka_district',
  },
  Kerala: {
    name: 'Kerala',
    geoDataFile: `${MAPS_DIR}/kerala.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kerala_district',
  },
  Goa: {
    name: 'Goa',
    geoDataFile: `${MAPS_DIR}/goa.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'goa_district',
  },
  Gujarat: {
    name: 'Gujarat',
    geoDataFile: `${MAPS_DIR}/gujarat.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'gujarat_district_2011',
  },
  Haryana: {
    name: 'Haryana',
    geoDataFile: `${MAPS_DIR}/haryana.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'haryana_district',
  },
  'Himachal Pradesh': {
    name: 'Himachal Pradesh',
    geoDataFile: `${MAPS_DIR}/himachalpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'himachalpradesh_district',
  },
  'Jammu and Kashmir': {
    name: 'Jammu and Kashmir',
    geoDataFile: `${MAPS_DIR}/jammukashmir.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jammukashmir_district',
  },
  Jharkhand: {
    name: 'Jharkhand',
    geoDataFile: `${MAPS_DIR}/jharkhand.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jharkhand_district',
  },
  Ladakh: {
    name: 'Ladakh',
    geoDataFile: `${MAPS_DIR}/ladakh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'ladakh_district',
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    geoDataFile: `${MAPS_DIR}/madhyapradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'madhyapradesh_district',
  },
  Maharashtra: {
    name: 'Maharashtra',
    geoDataFile: `${MAPS_DIR}/maharashtra.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'maharashtra_district',
  },
  Manipur: {
    name: 'Manipur',
    geoDataFile: `${MAPS_DIR}/manipur.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'manipur_pre2016_districts',
  },
  Meghalaya: {
    name: 'Meghalaya',
    geoDataFile: `${MAPS_DIR}/meghalaya.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'meghalaya_district',
  },
  Mizoram: {
    name: 'Mizoram',
    geoDataFile: `${MAPS_DIR}/mizoram.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'mizoram_district',
  },
  Nagaland: {
    name: 'Nagaland',
    geoDataFile: `${MAPS_DIR}/nagaland.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'nagaland_district',
  },
  Odisha: {
    name: 'Odisha',
    geoDataFile: `${MAPS_DIR}/odisha.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'odisha_district',
  },
  Punjab: {
    name: 'Punjab',
    geoDataFile: `${MAPS_DIR}/punjab.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'punjab_district',
  },
  Rajasthan: {
    name: 'Rajasthan',
    geoDataFile: `${MAPS_DIR}/rajasthan.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'rajasthan_district',
  },
  Sikkim: {
    name: 'Sikkim',
    geoDataFile: `${MAPS_DIR}/sikkim.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sikkim_district',
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    geoDataFile: `${MAPS_DIR}/tamil-nadu.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'tamilnadu_district',
  },
  Telangana: {
    name: 'Telangana',
    geoDataFile: `${MAPS_DIR}/telugana.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'telugana',
  },
  Tripura: {
    name: 'Tripura',
    geoDataFile: `${MAPS_DIR}/tripura.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'tripura_district',
  },
  Uttarakhand: {
    name: 'Uttarakhand',
    geoDataFile: `${MAPS_DIR}/uttarakhand.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'uttarakhand_district',
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    geoDataFile: `${MAPS_DIR}/uttarpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'uttarpradesh_district',
  },

  'West Bengal': {
    name: 'West Bengal',
    geoDataFile: `${MAPS_DIR}/westbengal.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'westbengal_district',
  },
};

strings.setLanguage(localStorage.getItem('language'));

export default function ({
  states,
  stateDistrictWiseData,
  stateHighlighted,
  districtHighlighted,
}) {
  const [selectedRegion, setSelectedRegion] = useState({});
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta.India);

  useEffect(() => {
    // setStates(props.states);
    // setCurrentHoveredRegion()
  }, [states]);

  useEffect(() => {
    const region = getRegionFromState(states[1]);
    setCurrentHoveredRegion(region);
  }, [states]);

  useEffect(() => {
    if (stateHighlighted === null) {
      highlightRegionInMap(null, currentMap.mapType);
    } else {
      if (stateHighlighted !== undefined) {
        const newMap = mapMeta['India'];
        setCurrentMap(newMap);
        const regionHighlighted = getRegionFromState(stateHighlighted.state);
        setCurrentHoveredRegion(regionHighlighted);
        highlightRegionInMap(regionHighlighted.name, currentMap.mapType);
        setSelectedRegion(regionHighlighted.name);
      }
    }
  }, [stateHighlighted, currentMap.mapType]);

  if (!currentHoveredRegion) {
    return null;
  }

  const [statistic, currentMapData] = useMemo(() => {
    const statistic = {total: 0, maxConfirmed: 0};
    let currentMapData = {};

    if (currentMap.mapType === MAP_TYPES.COUNTRY) {
      currentMapData = states.reduce((acc, state) => {
        if (state.state === 'Total') {
          return acc;
        }
        const confirmed = parseInt(state.confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }

        acc[state.state] = state.confirmed;
        return acc;
      }, {});
    } else if (currentMap.mapType === MAP_TYPES.STATE) {
      const districtWiseData = (
        stateDistrictWiseData[currentMap.name] || {districtData: {}}
      ).districtData;
      currentMapData = Object.keys(districtWiseData).reduce((acc, district) => {
        const confirmed = parseInt(districtWiseData[district].confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }
        acc[district] = districtWiseData[district].confirmed;
        return acc;
      }, {});
    }
    return [statistic, currentMapData];
  }, [currentMap, states, stateDistrictWiseData]);

  const setHoveredRegion = useCallback(
    (name, currentMap) => {
      if (currentMap.mapType === MAP_TYPES.COUNTRY) {
        setCurrentHoveredRegion(
          getRegionFromState(states.filter((state) => name === state.state)[0])
        );
      } else if (currentMap.mapType === MAP_TYPES.STATE) {
        const state = stateDistrictWiseData[currentMap.name] || {
          districtData: {},
        };
        let districtData = state.districtData[name];
        if (!districtData) {
          districtData = {
            confirmed: 0,
            active: 0,
            deaths: 0,
            recovered: 0,
          };
        }
        setCurrentHoveredRegion(getRegionFromDistrict(districtData, name));
      }
    },
    [stateDistrictWiseData, states]
  );

  useEffect(() => {
    if (districtHighlighted === null) {
      highlightRegionInMap(null, currentMap.mapType);
      return;
    }
    const newMap = mapMeta[districtHighlighted?.state.state];
    if (!newMap) {
      return;
    }
    setCurrentMap(newMap);
    setHoveredRegion(districtHighlighted?.district, newMap);
    highlightRegionInMap(districtHighlighted?.district, currentMap.mapType);
    setSelectedRegion(districtHighlighted?.district);
  }, [districtHighlighted, currentMap.mapType, setHoveredRegion]);

  const getRegionFromDistrict = (districtData, name) => {
    if (!districtData) {
      return;
    }
    const region = {...districtData};
    if (!region.name) {
      region.name = name;
    }
    return region;
  };

  const getRegionFromState = (state) => {
    if (!state) {
      return;
    }
    const region = {...state};
    if (!region.name) {
      region.name = region.state;
    }
    return region;
  };

  const switchMapToState = useCallback(
    (name) => {
      const newMap = mapMeta[name];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      if (newMap.mapType === MAP_TYPES.COUNTRY) {
        setHoveredRegion(states[1].state, newMap);
      } else if (newMap.mapType === MAP_TYPES.STATE) {
        const districtData = (stateDistrictWiseData[name] || {districtData: {}})
          .districtData;
        const topDistrict = Object.keys(districtData)
          .filter((name) => name !== 'Unknown')
          .sort((a, b) => {
            return districtData[b].confirmed - districtData[a].confirmed;
          })[0];
        setHoveredRegion(topDistrict, newMap);
      }
    },
    [setHoveredRegion, stateDistrictWiseData, states]
  );
  const {name, lastupdatedtime} = currentHoveredRegion;

  return (
    <div className="MapExplorer fadeInUp" style={{animationDelay: '1.2s'}}>
      <div className="header">
        <h1>
          {translate[currentMap.name]} {strings.map}
        </h1>
        <h6>
          {strings.hover}
          {currentMap.mapType === MAP_TYPES.COUNTRY
            ? strings.state
            : strings.district}
          {strings.moreDetails}
        </h6>
      </div>

      <div className="map-stats">
        <div className="stats">
          <h5>{strings.confirmed}</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.confirmed}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-blue">
          <h5>{strings.active}</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.active || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-green">
          <h5>{strings.recovered}</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.recovered || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-gray">
          <h5>{strings.deceased}</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.deaths || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>
      </div>

      <div className="meta">
        <h2>{translate[name]}</h2>
        {lastupdatedtime && (
          <div
            className={`last-update ${
              currentMap.mapType === MAP_TYPES.STATE
                ? 'district-last-update'
                : 'state-last-update'
            }`}
          >
            <h6>{strings.lastUpdated}</h6>
            <h3>
              {isNaN(Date.parse(formatDate(lastupdatedtime)))
                ? ''
                : formatDistance(
                    new Date(formatDate(lastupdatedtime)),
                    new Date()
                  ) + strings.ago}
            </h3>
          </div>
        )}

        {currentMap.mapType === MAP_TYPES.STATE &&
        currentMapData.Unknown > 0 ? (
          <h4 className={`unknown-${localStorage.getItem('language')}`}>
            {strings.formatString(strings.unknownDist, currentMapData.Unknown)}
          </h4>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => switchMapToState('India')}
          >
            {strings.back}
          </div>
        ) : null}
      </div>

      <ChoroplethMap
        statistic={statistic}
        mapMeta={currentMap}
        mapData={currentMapData}
        setHoveredRegion={setHoveredRegion}
        changeMap={switchMapToState}
        selectedRegion={selectedRegion}
      />
    </div>
  );
}
