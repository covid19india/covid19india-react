import MapLegend from './maplegend';

import {
  COLORS,
  D3_TRANSITION_DURATION,
  MAP_META,
  MAP_TYPES,
  MAP_OPTIONS,
  MAP_VIEWS,
  STATE_CODES,
  STATE_NAMES,
  STATE_POPULATIONS_MIL,
  ZONE_COLORS,
} from '../constants';
import {
  capitalizeAll,
  formatNumber,
  getStatistic,
} from '../utils/commonfunctions';

import * as d3 from 'd3';
import React, {useEffect, useMemo, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import useSWR from 'swr';
import * as topojson from 'topojson';

const colorInterpolator = {
  confirmed: (t) => d3.interpolateReds(t * 0.85),
  active: (t) => d3.interpolateBlues(t * 0.85),
  recovered: (t) => d3.interpolateGreens(t * 0.85),
  deceased: (t) => d3.interpolateGreys(t * 0.85),
  tested: (t) => d3.interpolatePurples(t * 0.85),
};

const getTotalStatistic = (data, statistic, normalizer = 1) => {
  return getStatistic(data, 'total', statistic, normalizer);
};

function MapVisualizer({
  currentMap,
  data,
  changeMap,
  regionHighlighted,
  setRegionHighlighted,
  statistic,
  isCountryLoaded,
}) {
  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[currentMap.name];
  const currentMapCode = useMemo(() => {
    let stateName = currentMap.name;
    if (stateName === 'India') stateName = 'Total';
    return STATE_CODES[stateName];
  }, [currentMap.name]);

  const geoDataResponse = useSWR(
    mapMeta.geoDataFile,
    async (file) => {
      return await d3.json(file);
    },
    {revalidateOnFocus: false, suspense: true}
  );

  const statisticMax = useMemo(() => {
    const {TT, UN, ...statesData} = data;
    return currentMap.view === MAP_VIEWS.STATES
      ? d3.max(Object.keys(statesData), (stateCode) =>
          getTotalStatistic(
            statesData[stateCode],
            statistic,
            currentMap.option === MAP_OPTIONS.PER_MILLION
              ? STATE_POPULATIONS_MIL[stateCode]
              : 1
          )
        )
      : d3.max(Object.values(statesData), (stateData) =>
          stateData?.districts
            ? d3.max(Object.values(stateData.districts), (districtData) =>
                getTotalStatistic(districtData, statistic)
              )
            : 0
        );
  }, [data, currentMap.option, currentMap.view, statistic]);

  const statisticTotal = useMemo(() => {
    return getTotalStatistic(
      data[currentMapCode],
      statistic,
      currentMap.option === MAP_OPTIONS.PER_MILLION
        ? STATE_POPULATIONS_MIL[currentMapCode]
        : 1
    );
  }, [data, currentMapCode, currentMap.option, statistic]);

  const mapScale = useMemo(() => {
    if (currentMap.option === MAP_OPTIONS.ZONES) {
      return d3.scaleOrdinal(
        Object.keys(ZONE_COLORS),
        Object.values(ZONE_COLORS)
      );
    } else if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      const {width} = svgRef.current.getBoundingClientRect();
      return d3
        .scaleSqrt([0, Math.max(statisticMax, 1)], [0, width / 10])
        .clamp(true)
        .nice(3);
    } else {
      return d3
        .scaleSequential(
          [0, Math.max(1, statisticMax)],
          colorInterpolator[statistic]
        )
        .clamp(true);
    }
  }, [currentMap.option, statistic, statisticMax]);

  useEffect(() => {
    if (!geoDataResponse.data) return;
    const geoData = geoDataResponse.data;

    const topology = topojson.feature(
      geoData,
      geoData.objects[mapMeta.graphObjectStates || mapMeta.graphObjectDistricts]
    );

    const svg = d3.select(svgRef.current);

    const {width, height} = svgRef.current.getBoundingClientRect();
    const projection = d3.geoMercator().fitSize([width, height], topology);
    const path = d3.geoPath(projection);

    // Add id to each feature
    let features =
      currentMap.option !== MAP_OPTIONS.HOTSPOTS
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
    const t = d3.transition().duration(D3_TRANSITION_DURATION);
    let onceTouchedRegion = null;
    const regionSelection = svg
      .select('.regions')
      .selectAll('path')
      .data(
        currentMap.option !== MAP_OPTIONS.HOTSPOTS ? features : [],
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
            setRegionHighlighted({
              stateCode: STATE_CODES[d.properties.st_nm],
              districtName: d.properties.district,
            });
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
      .attr('pointer-events', 'all');

    regionSelection
      .transition(t)
      .attr('fill', (d) => {
        const stateCode = STATE_CODES[d.properties.st_nm];
        const district = d.properties.district;
        const stateData = data[stateCode];
        const districtData = stateData?.districts?.[district];
        let n;
        if (currentMap.option === MAP_OPTIONS.ZONES) {
          n = districtData?.zone || 0;
        } else {
          if (district) n = getTotalStatistic(districtData, statistic);
          else
            n = getTotalStatistic(
              stateData,
              statistic,
              currentMap.option === MAP_OPTIONS.PER_MILLION
                ? STATE_POPULATIONS_MIL[stateCode]
                : 1
            );
        }
        const color = n === 0 ? '#ffffff00' : mapScale(n);
        return color;
      })
      .attr(
        'stroke',
        currentMap.option === MAP_OPTIONS.ZONES ? '#343a40' : COLORS[statistic]
      );

    regionSelection.select('title').text((d) => {
      if (currentMap.option === MAP_OPTIONS.TOTAL) {
        const state = d.properties.st_nm;
        const stateCode = STATE_CODES[state];
        const district = d.properties.district;

        const stateData = data[stateCode];
        const districtData = stateData?.districts?.[district];
        let n;
        if (district) n = getTotalStatistic(districtData, statistic);
        else n = getTotalStatistic(stateData, statistic);
        return (
          formatNumber(100 * (n / (statisticTotal || 0.001))) +
          '% from ' +
          capitalizeAll(district ? district : state)
        );
      }
    });

    svg
      .transition()
      .duration(mapMeta.mapType === MAP_TYPES.STATE ? t.duration() / 2 : 0)
      .on('end', () =>
        svg.attr('class', currentMap.option === MAP_OPTIONS.ZONES ? 'zone' : '')
      );

    /* ----------BUBBLE MAP----------*/
    let circlesData = [];
    if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      circlesData = features
        .map((d) => {
          const stateCode = STATE_CODES[d.properties.st_nm];
          const district = d.properties.district;

          const stateData = data[stateCode];
          const districtData = stateData?.districts?.[district];
          if (district) d.value = getTotalStatistic(districtData, statistic);
          else
            d.value = getTotalStatistic(
              stateData?.districts?.Unassigned,
              statistic
            );
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
            setRegionHighlighted({
              stateCode: STATE_CODES[d.properties.st_nm],
              districtName: d.properties.district || 'Unassigned',
            });
          })
          .on('click', () => {
            d3.event.stopPropagation();
          })
      )
      .transition(t)
      .attr('fill', COLORS[statistic] + '70')
      .attr('stroke', COLORS[statistic] + '70')
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
        if (currentMap.option === MAP_OPTIONS.ZONES) {
          return '#00000060';
        } else {
          return COLORS[statistic] + '30';
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
          stateCode: 'TT',
          districtName: null,
        });
      }
    });
  }, [
    geoDataResponse.data,
    data,
    mapMeta,
    currentMap,
    setRegionHighlighted,
    changeMap,
    isCountryLoaded,
    mapScale,
    statistic,
    statisticTotal,
  ]);

  useEffect(() => {
    if (!geoDataResponse.data) return;
    const state = STATE_NAMES[regionHighlighted.stateCode];
    const district = regionHighlighted.districtName;

    const svg = d3.select(svgRef.current);
    if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      svg
        .select('.circles')
        .selectAll('circle')
        .attr('fill-opacity', (d) => {
          const highlighted =
            state === d.properties.st_nm &&
            (!district ||
              district === d.properties?.district ||
              (district === 'Unassigned' && !d.properties.district));
          return highlighted ? 1 : 0.5;
        });
    } else {
      svg
        .select('.regions')
        .selectAll('path')
        .each(function (d) {
          const highlighted =
            state === d.properties.st_nm &&
            (currentMap.view === MAP_VIEWS.STATES ||
              district === d.properties?.district);
          if (highlighted) this.parentNode.appendChild(this);
          d3.select(this).attr('stroke-opacity', highlighted ? 1 : 0);
        });
    }
  }, [
    geoDataResponse.data,
    data,
    currentMap.option,
    currentMap.view,
    regionHighlighted.stateCode,
    regionHighlighted.districtName,
    statistic,
  ]);

  return (
    <React.Fragment>
      <div className="svg-parent map-parent">
        <svg id="chart" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
          <g className="regions" />
          <g className="state-borders" />
          {currentMap.view === MAP_VIEWS.DISTRICTS && (
            <g className="district-borders" />
          )}
          {currentMap.option === MAP_OPTIONS.HOTSPOTS && (
            <g className="circles" />
          )}
        </svg>
        {mapMeta.mapType === MAP_TYPES.STATE &&
          !!getTotalStatistic(
            data[currentMapCode]?.districts?.Unassigned,
            statistic
          ) && (
            <div className="disclaimer">
              <Icon.AlertCircle />
              {t('District-wise {{statistic}} numbers need reconciliation', {
                statistic: t(statistic),
              })}
            </div>
          )}
      </div>

      {mapScale && (
        <MapLegend
          data={data}
          mapScale={mapScale}
          mapOption={currentMap.option}
          statistic={statistic}
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

export default MapVisualizer;
