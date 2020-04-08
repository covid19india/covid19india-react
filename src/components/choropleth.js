import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import {MAP_TYPES} from '../constants';
import legend from './legend';

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
}) {
  const choroplethMap = useRef(null);
  const choroplethLegend = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').style('display', 'none');
      const propertyField = propertyFieldMap[mapMeta.mapType];
      const maxInterpolation = 0.8;

      const svg = d3.select(choroplethMap.current);
      const mapSelection = svg.select(`.${mapMeta.graphObjectName}`);
      if (!mapSelection.empty()) {
        console.log('here');
        mapSelection.style('display', 'block');
        return;
      }

      const handleMouseover = (name) => {
        try {
          setHoveredRegion(name, mapMeta);
          setSelectedRegion(name);
        } catch (err) {
          console.log('err', err);
        }
      };

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

      const projection = d3.geoMercator();
      let path;
      let width;
      let height;
      if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
        const widthStyle = parseInt(svg.style('width'));
        projection.fitWidth(widthStyle, topology);
        path = d3.geoPath(projection);
        const bBox = path.bounds(topology);
        width = +bBox[1][0];
        height = +bBox[1][1];
        svg.attr('viewBox', `0 0 ${width} ${height}`);
      } else {
        const bBox = svg.attr('viewBox').split(' ');
        width = +bBox[2];
        height = +bBox[3];
        projection.fitSize([width, height], topology);
        path = d3.geoPath(projection);
      }

      const colorScale = d3
        .scaleSequential(
          [0, statistic.maxConfirmed / maxInterpolation],
          d3.interpolateReds
        )
        .nice();

      let onceTouchedRegion = null;

      const g = svg.append('g').attr('class', mapMeta.graphObjectName);
      g.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .attr('fill', function (d) {
          const n = parseInt(mapData[d.properties[propertyField]]) || 0;
          const color = n === 0 ? '#ffffff' : colorScale(n);
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d) => {
          handleMouseover(d.properties[propertyField]);
        })
        .on('mouseleave', (d) => {
          setSelectedRegion(null);
          if (onceTouchedRegion === d) onceTouchedRegion = null;
        })
        .on('touchstart', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
          else onceTouchedRegion = d;
        })
        .on('click', clicked)
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
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        );

      function clicked(d) {
        if (onceTouchedRegion) return;
        if (mapMeta.mapType === MAP_TYPES.STATE) return;
        // Zoom
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        d3.event.stopPropagation();
        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(
                Math.min(
                  8,
                  0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
                )
              )
              .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.mouse(svg.node())
          )
          .on('end', () => {
            changeMap(d.properties[propertyField]);
          });
      }

      const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);

      function reset(t) {
        svg
          .transition()
          .duration(t)
          .call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
          );
      }

      function zoomed() {
        const {transform} = d3.event;
        g.attr('transform', transform);
        g.attr('stroke-width', 1 / transform.k);
      }

      // Reset on clicking outside map
      svg.on('click', () => {
        changeMap('India');
        // svg
        //   .call(
        //     zoom.transform,
        //     d3.zoomIdentity,
        //   );
        // reset(750);
      })
      svg
        .call(
          zoom.transform,
          d3.zoomIdentity,
        );
      // Reset zoom
      // reset(0);

      /* LEGEND */
      d3.selectAll('svg#legend > *').remove();
      const svgLegend = d3.select(choroplethLegend.current);
      // Colorbar
      const margin = {left: 0.05 * width, right: 0.2 * width};
      const barWidth = width - margin.left - margin.right;
      const heightLegend = +svgLegend.attr('height');
      const numTicks = Math.min(6, statistic.maxConfirmed)
      svgLegend
        .append('g')
        .style('transform', `translateX(${margin.left}px)`)
        .append(() =>
          legend({
            color: colorScale,
            title: 'Confirmed Cases',
            width: barWidth,
            height: 0.8 * heightLegend,
            ticks: numTicks,
            tickFormat: function (d, i, n) {
              if (Number.isInteger(d)) return n[i + 1] ? d : d + '+';
            },
          })
        );
      svgLegend.attr('viewBox', `0 0 ${width} ${heightLegend}`);
    },
    [
      mapData,
      mapMeta,
      statistic.total,
      statistic.maxConfirmed,
      changeMap,
      setHoveredRegion,
      setSelectedRegion,
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

      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
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

export default ChoroplethMap;
