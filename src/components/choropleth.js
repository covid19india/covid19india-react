import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {legendColor} from 'd3-svg-legend';
import * as topojson from 'topojson';
import {MAP_TYPES} from '../constants';

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
}) {
  const choroplethMap = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').remove();
      const propertyField = propertyFieldMap[mapMeta.mapType];
      const maxInterpolation = 0.8;
      const svg = d3.select(choroplethMap.current);
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const handleMouseover = (name) => {
        try {
          setHoveredRegion(name, mapMeta);
        } catch (err) {
          console.log('err', err);
        }
      };

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

      const projection = d3.geoMercator();

      if (mapMeta.mapType === MAP_TYPES.COUNTRY)
        projection.fitSize([width, height], topology);
      else
        projection.fitExtent(
          [
            [90, 20],
            [width, height],
          ],
          topology
        );

      const path = d3.geoPath(projection);

      let onceTouchedRegion = null;

      svg
        .append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .attr('fill', function (d) {
          const n = parseInt(mapData[d.properties[propertyField]]) || 0;
          const color =
            n === 0
              ? '#ffffff'
              : d3.interpolateReds(
                  (maxInterpolation * n) / (statistic.maxConfirmed || 0.001)
                );
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d) => {
          handleMouseover(d.properties[propertyField]);
          const target = d3.event.target;
          d3.select(target.parentNode.appendChild(target)).attr(
            'class',
            'map-hover'
          );
        })
        .on('mouseleave', (d) => {
          const target = d3.event.target;
          d3.select(target).attr('class', 'path-region map-default');
          if (onceTouchedRegion === d) onceTouchedRegion = null;
        })
        .on('touchstart', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
          else onceTouchedRegion = d;
        })
        .on('click', (d) => {
          if (onceTouchedRegion) {
            return;
          }
          if (mapMeta.mapType === MAP_TYPES.STATE) {
            return;
          }
          changeMap(d.properties[propertyField], mapMeta.mapType);
        })
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

      svg
        .append('path')
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        );
    },
    [
      mapData,
      mapMeta,
      statistic.total,
      statistic.maxConfirmed,
      changeMap,
      setHoveredRegion,
    ]
  );

  const toTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  const renderData = useCallback(() => {
    const svg = d3.select(choroplethMap.current);

    // Colorbar
    const maxInterpolation = 0.8;
    const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, statistic.maxConfirmed / maxInterpolation || 10]);

    let cells = null;
    let label = null;

    label = ({i, genLength, generatedLabels, labelDelimiter}) => {
      if (i === genLength - 1) {
        const n = Math.floor(generatedLabels[i]);
        return `${n}+`;
      } else {
        const n1 = 1 + Math.floor(generatedLabels[i]);
        const n2 = Math.floor(generatedLabels[i + 1]);
        return `${n1} - ${n2}`;
      }
    };

    const numCells = 6;
    const delta = Math.floor(
      (statistic.maxConfirmed < numCells ? numCells : statistic.maxConfirmed) /
        (numCells - 1)
    );

    cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

    svg
      .append('g')
      .attr('class', 'legendLinear')
      .attr('transform', 'translate(1, 335)');

    const legendLinear = legendColor()
      .shapeWidth(36)
      .shapeHeight(10)
      .cells(cells)
      .titleWidth(3)
      .labels(label)
      .title('Confirmed Cases')
      .orient('vertical')
      .scale(color);

    svg
      .select('.legendLinear')
      .call(legendLinear)
      .selectAll('text')
      .style('font-size', '10px');
  }, [statistic.maxConfirmed]);

  useEffect(() => {
    (async () => {
      const data = await d3.json(mapMeta.geoDataFile);
      if (statistic && choroplethMap.current) {
        ready(data);
        renderData();
        setSvgRenderCount((prevCount) => prevCount + 1);
      }
    })();
  }, [mapMeta.geoDataFile, statistic, renderData, ready]);

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
    <div className="svg-parent">
      <svg
        id="chart"
        width="480"
        height="450"
        viewBox="0 0 480 450"
        preserveAspectRatio="xMidYMid meet"
        ref={choroplethMap}
      ></svg>
    </div>
  );
}

export default ChoroplethMap;
