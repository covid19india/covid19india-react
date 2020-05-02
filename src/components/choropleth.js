import legend from './legend';

import {MAP_STATISTICS, MAP_TYPES} from '../constants';
import {formatNumber} from '../utils/commonfunctions';

import * as d3 from 'd3';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as Icon from 'react-feather';
import * as topojson from 'topojson';

const propertyFieldMap = {
  country: 'st_nm',
  state: 'district',
};

function ChoroplethMap({
  statistic,
  mapData,
  setHoveredRegion,
  mapMeta,
  changeMap,
  selectedRegion,
  setSelectedRegion,
  isCountryLoaded,
  mapOption,
  statisticOption,
}) {
  const choroplethMap = useRef(null);
  const choroplethLegend = useRef(null);
  const [mapName, setMapName] = useState();

  const ready = useCallback(
    (geoData, rerender = false) => {
      const propertyField = propertyFieldMap[mapMeta.mapType];
      const svg = d3.select(choroplethMap.current);

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

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
      if (rerender) {
        projection.fitSize([width, height], topology);
      }
      path = d3.geoPath(projection);

      /* Legend */
      const svgLegend = d3.select(choroplethLegend.current);
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
      const colorScale = d3
        .scaleSequential(
          [0, Math.max(1, statistic[mapOption].max)],
          colorInterpolator
        )
        .clamp(true);
      // Colorbar
      const widthLegend = parseInt(svgLegend.style('width'));
      const heightLegend = +svgLegend.attr('height');
      svgLegend.attr('viewBox', `0 0 ${widthLegend} ${heightLegend}`);
      svgLegend.call(() =>
        legend({
          color: colorScale,
          title:
            toTitleCase(mapOption) +
            ' cases' +
            (statisticOption === MAP_STATISTICS.PER_MILLION
              ? ' per million'
              : ''),
          width: widthLegend,
          height: 0.8 * heightLegend,
          ticks: 6,
          tickFormat: function (d, i, n) {
            if (
              statisticOption === MAP_STATISTICS.TOTAL &&
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

      /* Draw map */
      const t = svg.transition().duration(500);
      let onceTouchedRegion = null;
      const regionSelection = svg
        .select('.regions')
        .selectAll('path')
        .data(topology.features, (d) => {
          const state = d.properties[propertyFieldMap.country];
          const district = d.properties[propertyFieldMap.state];
          return district ? `${district} ${state}` : state;
        })
        .join((enter) => enter.append('path').attr('d', path))
        .attr('class', function (d) {
          const isHovered = d3.select(this).classed('map-hover');
          return `path-region ${mapOption} ${isHovered ? 'map-hover' : ''}`;
        })
        .style('cursor', 'pointer')
        .on('mouseenter', (d) => {
          handleMouseEnter(d.properties[propertyField]);
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

      regionSelection.append('title').text(function (d) {
        const region = d.properties[propertyField];
        const value = mapData[region] ? mapData[region][mapOption] : 0;
        if (statisticOption === MAP_STATISTICS.TOTAL) {
          return (
            Number(
              parseFloat(
                100 * (value / (statistic[mapOption].total || 0.001))
              ).toFixed(2)
            ).toString() +
            '% from ' +
            toTitleCase(region)
          );
        }
      });

      regionSelection
        .transition(t)
        .attr('fill', function (d) {
          const region = d.properties[propertyField];
          const n = mapData[region] ? mapData[region][mapOption] : 0;
          const color = n === 0 ? '#ffffff' : colorScale(n);
          return color;
        })
        .attr('stroke', function (d) {
          const isHovered = d3.select(this).classed('map-hover');
          if (isHovered) this.parentNode.appendChild(this);
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
        })
        .transition()
        .attr('pointer-events', 'all');

      svg
        .select('.borders')
        .selectAll('path')
        .data([geoData], (d) => d.objects[mapMeta.graphObjectName])
        .join((enter) =>
          enter.append('path').attr('d', (d) => {
            const mesh = topojson.mesh(d, d.objects[mapMeta.graphObjectName]);
            return path(mesh);
          })
        )
        .attr('fill', 'none')
        .attr('stroke-width', width / 250)
        .transition(t)
        .attr(
          'stroke',
          `${
            mapOption === 'confirmed'
              ? '#ff073a30'
              : mapOption === 'active'
              ? '#007bff30'
              : mapOption === 'recovered'
              ? '#28a74530'
              : mapOption === 'deceased'
              ? '#6c757d30'
              : ''
          }`
        );

      const handleMouseEnter = (name) => {
        try {
          setSelectedRegion(name);
          setHoveredRegion(name, mapMeta);
        } catch (err) {
          console.log('err', err);
        }
      };

      function handleClick(d) {
        d3.event.stopPropagation();
        if (onceTouchedRegion || mapMeta.mapType === MAP_TYPES.STATE) return;
        // Disable pointer events till the new map is rendered
        svg.attr('pointer-events', 'none');
        svg.selectAll('.path-region').attr('pointer-events', 'none');
        // Switch map
        changeMap(d.properties[propertyField]);
      }

      // Reset on tapping outside map
      svg.attr('pointer-events', 'auto').on('click', () => {
        if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
          setSelectedRegion(null);
          setHoveredRegion('Total', mapMeta);
        }
      });
    },
    [
      mapMeta,
      statistic,
      mapOption,
      isCountryLoaded,
      mapData,
      setSelectedRegion,
      setHoveredRegion,
      changeMap,
      statisticOption,
    ]
  );

  const toTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  useEffect(() => {
    (async () => {
      const data = await d3.json(mapMeta.geoDataFile);
      if (statistic && choroplethMap.current) {
        ready(data, mapName !== mapMeta.name);
        setMapName(mapMeta.name);
      }
    })();
  }, [mapName, mapMeta.geoDataFile, mapMeta.name, statistic, ready]);

  useEffect(() => {
    const highlightRegionInMap = (name) => {
      const paths = d3.selectAll('.path-region');
      paths.attr('stroke', null);
      paths.classed('map-hover', (d, i, nodes) => {
        const regionName = d.properties[propertyFieldMap.state]
          ? d.properties[propertyFieldMap.state]
          : d.properties[propertyFieldMap.country];
        if (name === regionName) {
          nodes[i].parentNode.appendChild(nodes[i]);
          d3.select(nodes[i]).attr('stroke', function (d) {
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
    highlightRegionInMap(selectedRegion);
  }, [mapName, selectedRegion]);

  return (
    <div>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg id="chart" preserveAspectRatio="xMidYMid meet" ref={choroplethMap}>
          <g className="regions" />
          <g className="borders" />
        </svg>
        {(mapOption === 'recovered' && mapData?.Unknown?.recovered) ||
        (mapOption === 'deceased' && mapData?.Unknown?.deceased) ? (
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
          height="65"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethLegend}
        >
          <image className="ramp" />
          <g className="axis">
            <text className="axistext" />
          </g>
        </svg>
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
    </div>
  );
}

export default React.memo(ChoroplethMap);
