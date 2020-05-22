import MapLegend from './maplegend';

import {MAP_META, MAP_TYPES, MAP_VIEWS} from '../constants';
import {capitalizeAll} from '../utils/commonfunctions';

import * as d3 from 'd3';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import useSWR from 'swr';
import * as topojson from 'topojson';

const colorInterpolator = (caseType, t) => {
  switch (caseType) {
    case 'confirmed':
      return d3.interpolateReds(t * 0.85);
    case 'active':
      return d3.interpolateBlues(t * 0.85);
    case 'recovered':
      return d3.interpolateGreens(t * 0.85);
    case 'deceased':
      return d3.interpolateGreys(t * 0.85);
    default:
      return;
  }
};

const caseColor = (caseType, alpha = '') => {
  switch (caseType) {
    case 'confirmed':
      return '#ff073a' + alpha;
    case 'active':
      return '#007bff' + alpha;
    case 'recovered':
      return '#28a745' + alpha;
    case 'deceased':
      return '#6c757d' + alpha;
    default:
      return;
  }
};

function ChoroplethMap({
  statistic,
  mapData,
  currentMap,
  changeMap,
  regionHighlighted,
  setRegionHighlighted,
  mapStatistic,
  isCountryLoaded,
}) {
  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[currentMap.name];
  const geoDataResponse = useSWR(mapMeta.geoDataFile, async (file) => {
    return await d3.json(file);
  });

  const mapScale = useMemo(() => {
    if (currentMap.option === MAP_TYPES.ZONE) {
      return d3.scaleOrdinal(
        ['Red', 'Orange', 'Green'],
        ['#d73027', '#fee08b', '#66bd63']
      );
    } else if (currentMap.option === MAP_TYPES.HOTSPOTS) {
      const {width} = svgRef.current.getBoundingClientRect();
      return d3
        .scaleSqrt([0, statistic[mapStatistic].max], [0, width / 10])
        .clamp(true);
    } else {
      return d3
        .scaleSequential([0, Math.max(1, statistic[mapStatistic].max)], (t) =>
          colorInterpolator(mapStatistic, t)
        )
        .clamp(true);
    }
  }, [currentMap.option, statistic, mapStatistic]);

  useEffect(() => {
    if (!geoDataResponse.data) return;
    const geoData = geoDataResponse.data;

    const topology = topojson.feature(
      geoData,
      geoData.objects[mapMeta.graphObjectStates || mapMeta.graphObjectDistricts]
    );

    const svg = d3.select(svgRef.current);

    if (!svg.attr('viewBox')) {
      const {
        width: widthDefault,
        height: heightDefault,
      } = svgRef.current.getBoundingClientRect();
      const projection = isCountryLoaded
        ? d3.geoMercator().fitWidth(widthDefault, topology)
        : d3.geoMercator().fitSize([widthDefault, heightDefault], topology);
      const path = d3.geoPath(projection);
      const bBox = path.bounds(topology);
      const [width, height] = [+bBox[1][0], bBox[1][1]];
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
    const bBox = svg.attr('viewBox').split(' ');
    const [width, height] = [+bBox[2], +bBox[3]];

    const projection = d3.geoMercator().fitSize([width, height], topology);
    const path = d3.geoPath(projection);

    // Add id to each feature
    let features =
      currentMap.option !== MAP_TYPES.HOTSPOTS
        ? currentMap.view === MAP_VIEWS.STATES
          ? topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectStates]
            ).features
          : topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectDistricts]
            ).features
        : [
            ...topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectStates]
            ).features,
            ...topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectDistricts]
            ).features,
          ];

    features = features.map((f) => {
      const district = f.properties.district;
      const state = f.properties.st_nm;
      const obj = Object.assign({}, f);
      obj.id = `${currentMap.name}-${state}${district ? '-' + district : ''}`;
      return obj;
    });

    /* Draw map */
    const t = d3.transition().duration(500);
    let onceTouchedRegion = null;
    const regionSelection = svg
      .select('.regions')
      .selectAll('path')
      .data(
        currentMap.option !== MAP_TYPES.HOTSPOTS ? features : [],
        (d) => d.id
      )
      .join((enter) => {
        const sel = enter
          .append('path')
          .attr('d', path)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0)
          .style('cursor', 'pointer')
          .on('mouseenter', (d) => {
            const region = {state: d.properties.st_nm};
            if (d.properties.district) region.district = d.properties.district;
            setRegionHighlighted(region);
          })
          .on('mouseleave', (d) => {
            if (onceTouchedRegion === d) onceTouchedRegion = null;
          })
          .on('touchstart', (d) => {
            if (onceTouchedRegion === d) onceTouchedRegion = null;
            else onceTouchedRegion = d;
          })
          .on('click', (d) => {
            d3.event.stopPropagation();
            if (onceTouchedRegion || mapMeta.mapType === MAP_TYPES.STATE)
              return;
            // Disable pointer events till the new map is rendered
            svg.attr('pointer-events', 'none');
            svg
              .select('.regions')
              .selectAll('path')
              .attr('pointer-events', 'none');
            // Switch map
            changeMap(d.properties.st_nm);
          });
        sel.append('title');
        return sel;
      })
      .attr('pointer-events', 'none');

    regionSelection
      .transition(t)
      .attr('fill', (d) => {
        let n;
        if (currentMap.option === MAP_TYPES.ZONE) {
          const state = d.properties.st_nm;
          const district = d.properties.district;
          n =
            mapData[state] && mapData[state][district]
              ? mapData[state][district]
              : 0;
        } else {
          const state = d.properties.st_nm;
          const district = d.properties.district;
          if (district)
            n =
              mapData[state] &&
              mapData[state][district] &&
              mapData[state][district][mapStatistic]
                ? mapData[state][district][mapStatistic]
                : 0;
          else
            n =
              mapData[state] && mapData[state][mapStatistic]
                ? mapData[state][mapStatistic]
                : 0;
        }
        const color = n === 0 ? '#ffffff00' : mapScale(n);
        return color;
      })
      .attr(
        'stroke',
        currentMap.option === MAP_TYPES.ZONE
          ? '#343a40'
          : caseColor(mapStatistic)
      )
      .on('end', function () {
        d3.select(this).attr('pointer-events', 'all');
      });

    regionSelection.select('title').text((d) => {
      if (currentMap.option === MAP_TYPES.TOTAL) {
        const state = d.properties.st_nm;
        const district = d.properties.district;
        let n;
        if (district)
          n =
            mapData[state] && mapData[state][district]
              ? mapData[state][district][mapStatistic]
              : 0;
        else n = mapData[state] ? mapData[state][mapStatistic] : 0;
        return (
          Number(
            parseFloat(
              100 * (n / (statistic[mapStatistic].total || 0.001))
            ).toFixed(2)
          ).toString() +
          '% from ' +
          capitalizeAll(district ? district : state)
        );
      }
    });

    svg
      .transition()
      .duration(mapMeta.mapType === MAP_TYPES.STATE ? t.duration() / 2 : 0)
      .on('end', () =>
        svg.attr('class', currentMap.option === MAP_TYPES.ZONE ? 'zone' : '')
      );

    /* ----------BUBBLE MAP----------*/
    let circlesData = [];
    if (currentMap.option === MAP_TYPES.HOTSPOTS) {
      circlesData = features
        .map((d) => {
          const district = d.properties.district;
          const state = d.properties.st_nm;
          if (district) {
            d.value =
              mapData[state] && mapData[state][district]
                ? mapData[state][district][mapStatistic]
                : 0;
          } else {
            d.value =
              mapData[state] && mapData[state].Unknown
                ? mapData[state].Unknown[mapStatistic]
                : 0;
          }
          return d;
        })
        .sort((a, b) => b.value - a.value);
    }

    svg
      .select('.circles')
      .selectAll('circle')
      .data(circlesData, (d) => d.id)
      .join((enter) =>
        enter
          .append('circle')
          .attr('transform', (d) => `translate(${path.centroid(d)})`)
          .attr('fill-opacity', 0.5)
          .style('cursor', 'pointer')
          .attr('pointer-events', 'all')
          .on('mouseenter', (d) => {
            const region = {
              state: d.properties.st_nm,
              district: d.properties.district || 'Unknown',
            };
            setRegionHighlighted(region);
          })
          .on('click', () => {
            d3.event.stopPropagation();
          })
      )
      .transition(t)
      .attr('fill', caseColor(mapStatistic, '70'))
      .attr('stroke', caseColor(mapStatistic, '70'))
      .attr('r', (d) => mapScale(d.value));
    /* ------------------------------*/

    let meshStates = [];
    if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
      meshStates = [
        topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectStates]),
      ];
      meshStates[0].id = mapMeta.graphObjectStates;
    }
    let meshDistricts = [];
    if (currentMap.view === MAP_VIEWS.DISTRICTS) {
      // Add id to mesh
      meshDistricts = [
        topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectDistricts]),
      ];
      meshDistricts[0].id = mapMeta.graphObjectDistricts;
    }

    svg
      .select(
        currentMap.view === MAP_VIEWS.STATES
          ? '.state-borders'
          : '.district-borders'
      )
      .attr('fill', 'none')
      .attr('stroke-width', function () {
        return mapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.view === MAP_VIEWS.DISTRICTS
          ? 0
          : width / 250;
      })
      .selectAll('path')
      .data(
        currentMap.view === MAP_VIEWS.STATES ? meshStates : meshDistricts,
        (d) => d.id
      )
      .join((enter) => enter.append('path').attr('d', path))
      .transition(t)
      .attr('stroke', () => {
        if (currentMap.option === MAP_TYPES.ZONE) {
          return '#00000060';
        } else {
          return caseColor(mapStatistic, '30');
        }
      });

    svg
      .select(
        currentMap.view === MAP_VIEWS.STATES
          ? '.district-borders'
          : '.state-borders'
      )
      .selectAll('path')
      .data(
        currentMap.view === MAP_VIEWS.STATES ? meshDistricts : meshStates,
        (d) => d.id
      )
      .join((enter) =>
        enter
          .append('path')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke-width', width / 250)
      )
      .transition(t)
      .attr('stroke', '#343a4099');

    // Reset on tapping outside map
    svg.attr('pointer-events', 'auto').on('click', () => {
      if (mapMeta.mapType !== MAP_TYPES.STATE) {
        setRegionHighlighted({
          state: 'Total',
        });
      }
    });
  }, [
    geoDataResponse.data,
    mapMeta,
    currentMap,
    setRegionHighlighted,
    changeMap,
    isCountryLoaded,
    mapScale,
    statistic,
    mapData,
    mapStatistic,
  ]);

  const highlightRegionInMap = useCallback(
    (state, district) => {
      const svg = d3.select(svgRef.current);
      if (currentMap.option === MAP_TYPES.HOTSPOTS) {
        svg
          .select('.circles')
          .selectAll('circle')
          .attr('fill-opacity', (d) => {
            const highlighted =
              district &&
              state === d.properties.st_nm &&
              (district === d.properties.district ||
                (district === 'Unknown' && !d.properties.district));
            return highlighted ? 1 : 0.5;
          });
      } else {
        svg
          .select('.regions')
          .selectAll('path')
          .each(function (d) {
            const highlighted =
              district === d.properties?.district &&
              state === d.properties.st_nm;
            if (highlighted) this.parentNode.appendChild(this);
            d3.select(this).attr('stroke-opacity', highlighted ? 1 : 0);
          });
      }
    },
    [currentMap.option]
  );

  useEffect(() => {
    if (!geoDataResponse.data) return;
    highlightRegionInMap(regionHighlighted.state, regionHighlighted.district);
  }, [
    geoDataResponse.data,
    highlightRegionInMap,
    regionHighlighted.state,
    regionHighlighted.district,
    mapStatistic,
  ]);

  return (
    <React.Fragment>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg id="chart" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
          <g className="regions" />
          <g className="state-borders" />
          {currentMap.view === MAP_VIEWS.DISTRICTS && (
            <g className="district-borders" />
          )}
          {currentMap.option === MAP_TYPES.HOTSPOTS && (
            <g className="circles" />
          )}
        </svg>
        {mapMeta.mapType === MAP_TYPES.STATE &&
        mapData[currentMap.name]?.Unknown &&
        mapData[currentMap.name]?.Unknown[mapStatistic] ? (
          <div className="disclaimer">
            <Icon.AlertCircle />
            {t('District-wise {{mapStatistic}} numbers need reconciliation', {
              mapStatistic: t(mapStatistic),
            })}
          </div>
        ) : (
          ''
        )}
      </div>

      {mapScale && (
        <MapLegend
          mapScale={mapScale}
          statistic={statistic}
          mapOption={currentMap.option}
          mapStatistic={mapStatistic}
        />
      )}

      <svg style={{position: 'absolute', height: 0}}>
        <defs>
          <filter id="balance-color" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.91372549  0           0            0  0.08627451
                      0           0.91372549  0            0  0.08627451
                      0           0           0.854901961  0  0.145098039
                      0           0           0            1  0"
            />
          </filter>
        </defs>
      </svg>
    </React.Fragment>
  );
}

export default ChoroplethMap;
