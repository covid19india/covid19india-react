import legend from './legend';

import {MAP_META, MAP_STATISTICS, MAP_TYPES, MAP_VIEWS} from '../constants';
import {capitalizeAll, formatNumber} from '../utils/commonfunctions';

import * as d3 from 'd3';
import React, {useCallback, useEffect, useRef} from 'react';
import * as Icon from 'react-feather';
import * as topojson from 'topojson';

function ChoroplethMap({
  statistic,
  mapData,
  currentMap,
  changeMap,
  regionHighlighted,
  setRegionHighlighted,
  isCountryLoaded,
  mapOption,
}) {
  const choroplethMap = useRef(null);
  const choroplethLegend = useRef(null);

  const mapMeta = MAP_META[currentMap.name];

  const ready = useCallback(
    (geoData) => {
      const svg = d3.select(choroplethMap.current);

      const topologyStates =
        mapMeta.mapType === MAP_TYPES.COUNTRY
          ? topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectStates]
            )
          : {features: []};
      const topologyDistricts =
        currentMap.view === MAP_VIEWS.DISTRICTS
          ? topojson.feature(
              geoData,
              geoData.objects[mapMeta.graphObjectDistricts]
            )
          : {features: []};

      const topology =
        currentMap.view === MAP_VIEWS.STATES
          ? topologyStates
          : topologyDistricts;

      const projection = d3.geoMercator();

      // Set size of the map
      let path;
      let width;
      let height;
      if (!svg.attr('viewBox')) {
        const widthStyle = parseInt(svg.style('width'));
        if (isCountryLoaded) projection.fitWidth(widthStyle, topology);
        else {
          const heightStyle = parseInt(svg.style('height'));
          projection.fitSize([widthStyle, heightStyle], topology);
        }
        path = d3.geoPath(projection);
        const bBox = path.bounds(topology);
        width = +bBox[1][0];
        height = +bBox[1][1];
        svg.attr('viewBox', `0 0 ${width} ${height}`);
      }
      const bBox = svg.attr('viewBox').split(' ');
      width = +bBox[2];
      height = +bBox[3];
      projection.fitSize([width, height], topology);
      path = d3.geoPath(projection);

      /* Legend */
      const svgLegend = d3.select(choroplethLegend.current);
      const widthLegend = parseInt(svgLegend.style('width'));
      const heightLegend = +svgLegend.attr('height');
      svgLegend.attr('viewBox', `0 0 ${widthLegend} ${heightLegend}`);

      // Colorbar
      let colorScale;
      if (currentMap.stat === MAP_STATISTICS.ZONE) {
        colorScale = d3.scaleOrdinal(
          ['Red', 'Orange', 'Green'],
          ['#d73027', '#fee08b', '#66bd63']
        );

        svgLegend.call(() =>
          legend({
            color: colorScale,
            width: widthLegend,
            height: heightLegend,
            tickValues: [],
            marginLeft: 2,
            marginRight: 20,
            svg: svgLegend,
            ordinalWeights: Object.values(statistic),
          })
        );
      } else {
        const colorInterpolator = (t) => {
          switch (mapOption) {
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
        colorScale = d3
          .scaleSequential(
            [0, Math.max(1, statistic[mapOption].max)],
            colorInterpolator
          )
          .clamp(true);
        svgLegend.call(() =>
          legend({
            color: colorScale,
            title:
              capitalizeAll(mapOption) +
              (currentMap.stat === MAP_STATISTICS.PER_MILLION
                ? ' cases per million'
                : ' cases'),
            width: widthLegend,
            height: heightLegend,
            ticks: 6,
            tickFormat: function (d, i, n) {
              if (
                currentMap.stat === MAP_STATISTICS.TOTAL &&
                !Number.isInteger(d)
              )
                return;
              if (i === n.length - 1) return formatNumber(d) + '+';
              return formatNumber(d);
            },
            marginLeft: 2,
            marginRight: 20,
            svg: svgLegend,
          })
        );
      }
      svgLegend.attr(
        'class',
        currentMap.stat === MAP_STATISTICS.ZONE ? 'zone' : ''
      );

      // Add id to each feature
      const featureStates = topologyStates.features.map((f) => {
        const state = f.properties.st_nm;
        const obj = Object.assign({}, f);
        obj.id = `${mapMeta.graphObjectStates}-${state}`;
        return obj;
      });

      // Add id to each feature
      const featureDistricts = topologyDistricts.features.map((f) => {
        const district = f.properties.district;
        const state = f.properties.st_nm;
        const obj = Object.assign({}, f);
        obj.id = `${mapMeta.graphObjectDistricts}-${state}${district}`;
        return obj;
      });

      /* Draw map */
      const t = svg.transition().duration(500);
      let onceTouchedRegion = null;
      const regionSelection = svg
        .select(currentMap.view === MAP_VIEWS.STATES ? '.states' : '.districts')
        .selectAll('path')
        .data(
          currentMap.view === MAP_VIEWS.STATES
            ? featureStates
            : featureDistricts,
          (d) => d.id
        )
        .join((enter) => {
          const sel = enter.append('path').attr('d', path);
          sel.append('title');
          return sel;
        })
        .attr('class', function (d) {
          const isHovered = d3.select(this).classed('map-hover');
          return `path-region ${mapOption} ${isHovered ? 'map-hover' : ''}`;
        })
        .style('cursor', 'pointer')
        .on('mouseenter', function (d) {
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
        .on('click', handleClick)
        .attr('pointer-events', 'none');

      regionSelection.select('title').text(function (d) {
        if (currentMap.stat === MAP_STATISTICS.TOTAL) {
          const state = d.properties.st_nm;
          const district = d.properties.district;
          let n;
          if (district)
            n =
              mapData[state] && mapData[state][district]
                ? mapData[state][district][mapOption]
                : 0;
          else n = mapData[state] ? mapData[state][mapOption] : 0;
          return (
            Number(
              parseFloat(
                100 * (n / (statistic[mapOption].total || 0.001))
              ).toFixed(2)
            ).toString() +
            '% from ' +
            capitalizeAll(district ? district : state)
          );
        }
      });

      regionSelection
        .transition(t)
        .attr('fill', function (d) {
          let n;
          if (currentMap.stat === MAP_STATISTICS.ZONE) {
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
                mapData[state] && mapData[state][district]
                  ? mapData[state][district][mapOption]
                  : 0;
            else n = mapData[state] ? mapData[state][mapOption] : 0;
          }
          const color = n === 0 ? '#ffffff00' : colorScale(n);
          return color;
        })
        .attr('stroke', function () {
          const isHovered = d3.select(this).classed('map-hover');
          if (isHovered) this.parentNode.appendChild(this);
          if (currentMap.stat === MAP_STATISTICS.ZONE) {
            return isHovered ? '#343a40' : null;
          } else {
            return isHovered
              ? `${
                  mapOption === 'confirmed'
                    ? '#ff073a'
                    : mapOption === 'active'
                    ? '#007bff'
                    : mapOption === 'recovered'
                    ? '#28a745'
                    : mapOption === 'deceased'
                    ? '#6c757d'
                    : ''
                }`
              : null;
          }
        })
        .transition()
        .attr('pointer-events', 'all');

      svg
        .transition()
        .duration(mapMeta.mapType === MAP_TYPES.STATE ? 250 : 0)
        .on('end', () =>
          svg.attr(
            'class',
            currentMap.stat === MAP_STATISTICS.ZONE ? 'zone' : ''
          )
        );

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
        .selectAll('path')
        .data(
          currentMap.view === MAP_VIEWS.STATES ? meshStates : meshDistricts,
          (d) => d.id
        )
        .join((enter) =>
          enter
            .append('path')
            .attr('d', path)
            .attr('stroke-width', width / 250)
        )
        .attr('fill', 'none')
        .transition(t)
        .attr('stroke-width', function () {
          return mapMeta.mapType === MAP_TYPES.COUNTRY &&
            currentMap.view === MAP_VIEWS.DISTRICTS
            ? 0
            : width / 250;
        })
        .attr('stroke', function () {
          if (currentMap.stat === MAP_STATISTICS.ZONE) {
            return '#00000060';
          } else {
            return `${
              mapOption === 'confirmed'
                ? '#ff073a30'
                : mapOption === 'active'
                ? '#007bff30'
                : mapOption === 'recovered'
                ? '#28a74530'
                : mapOption === 'deceased'
                ? '#6c757d30'
                : ''
            }`;
          }
        });

      svg
        .select(currentMap.view === MAP_VIEWS.STATES ? '.districts' : '.states')
        .selectAll('path')
        .data(
          currentMap.view === MAP_VIEWS.STATES
            ? featureDistricts
            : featureStates,
          (d) => d.id
        )
        .join((enter) => enter.append('path').attr('d', path))
        .attr('class', 'path-region')
        .attr('fill', 'none')
        .attr('stroke', 'none')
        .attr('pointer-events', 'none');

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
        .join((enter) => enter.append('path').attr('d', path))
        .attr('fill', 'none')
        .transition(t)
        .attr('stroke-width', width / 250)
        .attr('stroke', '#343a4099');

      function handleClick(d) {
        d3.event.stopPropagation();
        if (onceTouchedRegion || mapMeta.mapType === MAP_TYPES.STATE) return;
        // Disable pointer events till the new map is rendered
        svg.attr('pointer-events', 'none');
        svg.selectAll('.path-region').attr('pointer-events', 'none');
        // Switch map
        changeMap(d.properties.st_nm);
      }

      // Reset on tapping outside map
      svg.attr('pointer-events', 'auto').on('click', () => {
        if (mapMeta.mapType !== MAP_TYPES.STATE) {
          setRegionHighlighted({
            state: 'Total',
          });
        }
      });
    },
    [
      mapMeta,
      currentMap.stat,
      currentMap.view,
      statistic,
      mapOption,
      isCountryLoaded,
      mapData,
      setRegionHighlighted,
      changeMap,
    ]
  );

  useEffect(() => {
    (async () => {
      const data = await d3.json(mapMeta.geoDataFile);
      if (statistic && choroplethMap.current) {
        ready(data);
      }
    })();
  }, [mapMeta, statistic, ready]);

  useEffect(() => {
    const highlightRegionInMap = (region) => {
      const paths = d3.selectAll('.path-region');
      paths.attr('stroke', null);
      paths.classed('map-hover', (d, i, nodes) => {
        if (
          region.district === d.properties?.district &&
          region.state === d.properties.st_nm
        ) {
          nodes[i].parentNode.appendChild(nodes[i]);
          d3.select(nodes[i]).attr('stroke', function (d) {
            if (currentMap.stat === MAP_STATISTICS.ZONE) return '#343a40';
            return d3.select(this).classed('confirmed')
              ? '#ff073a'
              : d3.select(this).classed('active')
              ? '#007bff'
              : d3.select(this).classed('recovered')
              ? '#28a745'
              : d3.select(this).classed('deceased')
              ? '#6c757d'
              : null;
          });
          return true;
        }
        return false;
      });
    };
    highlightRegionInMap(regionHighlighted);
  }, [regionHighlighted, currentMap.stat]);

  return (
    <React.Fragment>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg id="chart" preserveAspectRatio="xMidYMid meet" ref={choroplethMap}>
          <g className="states" />
          <g className="districts" />
          <g className="state-borders" />
          <g className="district-borders" />
        </svg>
        {mapMeta.mapType === MAP_TYPES.STATE &&
        mapData[currentMap.name]?.Unknown &&
        mapData[currentMap.name]?.Unknown[mapOption] ? (
          <div className="disclaimer">
            <Icon.AlertCircle />
            {`District-wise ${mapOption} numbers are under reconciliation`}
          </div>
        ) : (
          ''
        )}
      </div>
      <div
        className="svg-parent legend fadeInUp"
        style={{animationDelay: '2.5s'}}
      >
        <svg
          id="legend"
          height="50"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethLegend}
        >
          <image className="ramp" />
          <g className="axis">
            <text className="axistext" />
          </g>
        </svg>
        <canvas
          className="color-scale"
          style={{position: 'absolute', height: 0}}
        />
      </div>
      <svg style={{position: 'absolute', height: 0}}>
        <defs>
          <filter id="balance-color" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.91372549 0 0 0 0.08627451 0 0.91372549 0 0 0.08627451 0 0 0.854901961 0 0.145098039 0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </React.Fragment>
  );
}

export default ChoroplethMap;
