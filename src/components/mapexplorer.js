import React, {useState, useEffect, useMemo} from 'react';
import ChoroplethMap, {highlightRegionInMap} from './choropleth';
import {MAP_TYPES, MAPS_DIR} from '../constants';

const mapMeta = {
  'India': {
    name: 'India',
    geoDataFile: `${MAPS_DIR}/india.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'india',
    center: [78.9, 22],
    scale: 1000,
  },
  'Andaman and Nicobar Islands': {
    name: 'Andaman and Nicobar Islands',
    geoDataFile: `${MAPS_DIR}/andamannicobarislands.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'andamannicobarislands_district',
    center: [92, 8],
    scale: 4000,
  },
  'Arunachal Pradesh': {
    name: 'Arunachal Pradesh',
    geoDataFile: `${MAPS_DIR}/arunachalpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'arunachalpradesh_district',
    center: [94, 27],
    scale: 1000,
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    geoDataFile: `${MAPS_DIR}/andhrapradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'andhrapradesh_district',
    center: [80, 16],
    scale: 3200,
  },

  'Assam': {
    name: 'Assam',
    geoDataFile: `${MAPS_DIR}/assam.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'assam_district',
    center: [92, 26],
    scale: 4500,
  },
  'Bihar': {
    name: 'Bihar',
    geoDataFile: `${MAPS_DIR}/bihar.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'bihar_district',
    center: [85, 25],
    scale: 6000,
  },
  'Chhattisgarh': {
    name: 'Chhattisgarh',
    geoDataFile: `${MAPS_DIR}/chhattisgarh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'chhattisgarh_district',
    center: [82, 21],
    scale: 4500,
  },
  'Delhi': {
    name: 'Delhi',
    geoDataFile: `${MAPS_DIR}/delhi.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'delhi_1997-2012_district',
    center: [77, 28.5],
    scale: 30000,
  },
  'Karnataka': {
    name: 'Karnataka',
    geoDataFile: `${MAPS_DIR}/karnataka.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'karnataka_district',
    center: [76, 15.05],
    scale: 4900,
  },
  'Kerala': {
    name: 'Kerala',
    geoDataFile: `${MAPS_DIR}/kerala.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kerala_district',
    center: [76, 10.5],
    scale: 5000,
  },
  'Goa': {
    name: 'Goa',
    geoDataFile: `${MAPS_DIR}/goa.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'goa_district',
    center: [74, 15],
    scale: 20000,
  },
  'Gujarat': {
    name: 'Gujarat',
    geoDataFile: `${MAPS_DIR}/gujarat.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'gujarat_district_2011',
    center: [70.5, 22],
    scale: 4000,
  },
  'Haryana': {
    name: 'Haryana',
    geoDataFile: `${MAPS_DIR}/haryana.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'haryana_district',
    center: [76, 29],
    scale: 8000,
  },
  'Himachal Pradesh': {
    name: 'Himachal Pradesh',
    geoDataFile: `${MAPS_DIR}/himachalpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'himachalpradesh_district',
    center: [77, 32],
    scale: 7000,
  },
  'Jammu and Kashmir': {
    name: 'Jammu and Kashmir',
    geoDataFile: `${MAPS_DIR}/jammukashmir.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jammukashmir_district',
    center: [75, 34],
    scale: 5000,
  },
  'Jharkhand': {
    name: 'Jharkhand',
    geoDataFile: `${MAPS_DIR}/jharkhand.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'jharkhand_district',
    center: [85, 23],
    scale: 4500,
  },
  'Ladakh': {
    name: 'Ladakh',
    geoDataFile: `${MAPS_DIR}/ladakh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'ladakh_district',
    center: [76, 33],
    scale: 3000,
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    geoDataFile: `${MAPS_DIR}/madhyapradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'madhyapradesh_district',
    center: [77, 23],
    scale: 3000,
  },
  'Maharashtra': {
    name: 'Maharashtra',
    geoDataFile: `${MAPS_DIR}/maharashtra.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'maharashtra_district',
    center: [75, 18],
    scale: 3000,
  },
  'Manipur': {
    name: 'Manipur',
    geoDataFile: `${MAPS_DIR}/manipur.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'manipur_pre2016_districts',
    center: [93.5, 24],
    scale: 9000,
  },
  'Meghalaya': {
    name: 'Meghalaya',
    geoDataFile: `${MAPS_DIR}/meghalaya.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'meghalaya_district',
    center: [91, 24],
    scale: 6500,
  },
  'Mizoram': {
    name: 'Mizoram',
    geoDataFile: `${MAPS_DIR}/mizoram.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'mizoram_district',
    center: [92.5, 23],
    scale: 10000,
  },
  'Nagaland': {
    name: 'Nagaland',
    geoDataFile: `${MAPS_DIR}/nagaland.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'nagaland_district',
    center: [94, 25],
    scale: 7500,
  },
  'Odisha': {
    name: 'Odisha',
    geoDataFile: `${MAPS_DIR}/odisha.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'odisha_district',
    center: [84, 20],
    scale: 4000,
  },
  'Punjab': {
    name: 'Punjab',
    geoDataFile: `${MAPS_DIR}/punjab.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'punjab_district',
    center: [75, 30.7],
    scale: 8000,
  },
  'Rajasthan': {
    name: 'Rajasthan',
    geoDataFile: `${MAPS_DIR}/rajasthan.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'rajasthan_district',
    center: [73, 25],
    scale: 3000,
  },
  'Sikkim': {
    name: 'Sikkim',
    geoDataFile: `${MAPS_DIR}/sikkim.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sikkim_district',
    center: [88, 27.5],
    scale: 15000,
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    geoDataFile: `${MAPS_DIR}/tamil-nadu.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'tamilnadu_district',
    center: [83, 18],
    scale: 1500,
  },
  'Telangana': {
    name: 'Telangana',
    geoDataFile: `${MAPS_DIR}/telugana.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'telugana',
    center: [79, 17],
    scale: 5000,
  },
  'Tripura': {
    name: 'Tripura',
    geoDataFile: `${MAPS_DIR}/tripura.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'tripura_district',
    center: [91.5, 23],
    scale: 10000,
  },
  'Uttarakhand': {
    name: 'Uttarakhand',
    geoDataFile: `${MAPS_DIR}/uttarakhand.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'uttarakhand_district',
    center: [79, 30],
    scale: 8000,
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    geoDataFile: `${MAPS_DIR}/uttarpradesh.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'uttarpradesh_district',
    center: [80, 27],
    scale: 3500,
  },

  'West Bengal': {
    name: 'West Bengal',
    geoDataFile: `${MAPS_DIR}/westbengal.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'westbengal_district',
    center: [87, 24],
    scale: 5000,
  },
};

export default function({states, stateDistrictWiseData, stateHighlighted}) {
  // const [states, setStates] = useState(props.states);
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
    if (currentMap.mapType === MAP_TYPES.STATE) {
      return;
    }

    if (stateHighlighted === null) {
      highlightRegionInMap(null, currentMap.mapType);
    } else {
      if (stateHighlighted !== undefined) {
        let regionHighlighted = getRegionFromState(stateHighlighted.state);
        setCurrentHoveredRegion(regionHighlighted);
        highlightRegionInMap(regionHighlighted.name, currentMap.mapType);
      }
    }
  }, [stateHighlighted]);

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
  }, [currentMap]);

  const setHoveredRegion = (name, currentMap) => {
    if (currentMap.mapType === MAP_TYPES.COUNTRY) {
      setCurrentHoveredRegion(
          getRegionFromState(states.filter((state) => name === state.state)[0]),
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
  };

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

  const switchMapToState = (name) => {
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
  };

  return (
    <div className="MapExplorer fadeInUp" style={{animationDelay: '1.2s'}}>

      <div className="header">
        <h1>{currentMap.name} Map</h1>
        <h6>
          Hover over a{' '}
          {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state' : 'district'} for
          more details
        </h6>
      </div>

      <div className="map-stats">
        <div className="stats">
          <h5>Confirmed</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.confirmed}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-blue">
          <h5>Active</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.active || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-green">
          <h5>Recovered</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.recovered || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-gray">
          <h5>Deceased</h5>
          <div className="stats-bottom">
            <h1>{currentHoveredRegion.deaths || ''}</h1>
            <h6>{}</h6>
          </div>
        </div>
      </div>

      <div className="meta">
        <h2>{currentHoveredRegion.name}</h2>
        {currentMap.mapType === MAP_TYPES.STATE && currentMapData.Unknown > 0 ? (
            <h4 className="unknown">Districts unknown for {currentMapData.Unknown} people</h4>
          ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <div className="button back-button" onClick={() => switchMapToState('India')}>
            Back
          </div>
      ) : null}
      </div>

      <ChoroplethMap
        statistic={statistic}
        mapMeta={currentMap}
        mapData={currentMapData}
        setHoveredRegion={(region) => setHoveredRegion(region, currentMap)}
        changeMap={switchMapToState}
      />

    </div>
  );
}
