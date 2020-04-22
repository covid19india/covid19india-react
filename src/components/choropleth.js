import legend from './legend';

import {MAP_TYPES} from '../constants';

import * as d3 from 'd3';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
}) {
  const choroplethMap = useRef(null);
  const choroplethLegend = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').remove();

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
      projection.fitSize([width, height], topology);
      path = d3.geoPath(projection);

      /* Legend */
      const svgLegend = d3.select(choroplethLegend.current);
      svgLegend.selectAll('*').remove();
      const redInterpolator = (t) => d3.interpolateReds(t * 0.85);
      const colorScale = d3.scaleSequential(
        [0, statistic.maxConfirmed],
        redInterpolator
      );
      // Colorbar
      const widthLegend = parseInt(svgLegend.style('width'));
      const margin = {left: 0.02 * widthLegend, right: 0.02 * widthLegend};
      const barWidth = widthLegend - margin.left - margin.right;
      const heightLegend = +svgLegend.attr('height');
      svgLegend
        .append('g')
        .style('transform', `translateX(${margin.left}px)`)
        .append(() =>
          legend({
            color: colorScale,
            title: 'Confirmed Cases',
            width: barWidth,
            height: 0.8 * heightLegend,
            ticks: 6,
            tickFormat: function (d, i, n) {
              if (!Number.isInteger(d)) return;
              if (i === n.length - 1) return d + '+';
              return d;
            },
          })
        );
      svgLegend.attr('viewBox', `0 0 ${widthLegend} ${heightLegend}`);

      /* Draw map */
      let onceTouchedRegion = null;
      const g = svg.append('g').attr('class', mapMeta.graphObjectName);
      g.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .join('path')
        .attr('class', 'path-region')
        .attr('fill', function (d) {
          const n = parseInt(mapData[d.properties[propertyField]]) || 0;
          const color = n === 0 ? '#ffffff' : colorScale(n);
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
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
        .style('cursor', 'pointer')
        .append('title')
        .text(function (d) {
          const value = mapData[d.properties[propertyField]] || 0;
          return (
            Number(
              parseFloat(100 * (value / (statistic.total || 0.001))).toFixed(2)
            ).toString() +
            '% from ' +
            toTitleCase(d.properties[propertyField])
          );
        });

      g.append('path')
        .attr('class', 'borders')
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
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
        changeMap(d.properties[propertyField]);
      }

      // Reset on tapping outside map
      svg.on('click', () => {
        setSelectedRegion(null);
        if (mapMeta.mapType === MAP_TYPES.COUNTRY)
          setHoveredRegion('Total', mapMeta);
      });
    },
    [
      mapData,
      mapMeta,
      statistic.total,
      statistic.maxConfirmed,
      changeMap,
      setHoveredRegion,
      setSelectedRegion,
      isCountryLoaded,
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
        ready(data);
        setSvgRenderCount((prevCount) => prevCount + 1);
      }
    })();
  }, [mapMeta.geoDataFile, statistic, ready]);

  const highlightRegionInMap = (name) => {
    const paths = d3.selectAll('.path-region');
    paths.classed('map-hover', (d, i, nodes) => {
      const propertyField =
        'district' in d.properties
          ? propertyFieldMap['state']
          : propertyFieldMap['country'];
      if (name === d.properties[propertyField]) {
        nodes[i].parentNode.appendChild(nodes[i]);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    highlightRegionInMap(selectedRegion);
  }, [svgRenderCount, selectedRegion]);

  return (
    <div>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg
          id="chart"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethMap}
        ></svg>
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
        ></svg>
      </div>
    </div>
  );
}

export default React.memo(ChoroplethMap);
