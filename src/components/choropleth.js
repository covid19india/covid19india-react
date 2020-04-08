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
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').remove();
      const propertyField = propertyFieldMap[mapMeta.mapType];
      const maxInterpolation = 0.8;
      const svg = d3.select(choroplethMap.current);

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

      let onceTouchedRegion = null;

      svg.on('click', () => reset(750));

      const g = svg.append("g");

      g
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

      g
        .append('path')
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
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.mouse(svg.node())
        )
        .on('end', () => {
          changeMap(d.properties[propertyField], mapMeta.mapType);
        });
      }

      const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .on("zoom", zoomed);

      function reset(t) {
        svg.transition().duration(t).call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
      }

      function zoomed() {
        const {transform} = d3.event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
      }
      reset(0);
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

  const renderData = useCallback(() => {
    const svg = d3.select(choroplethMap.current);

    // Colorbar
    const maxInterpolation = 0.8;
    const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, statistic.maxConfirmed / maxInterpolation || 10]);

    const barWidth = 240;
    // svg.append('g')
    //   .style('transform', `translateX(${+svg.attr('width') - barWidth - 20}px)`)
    //   .append(() => legend({
    //     color,
    //     title: 'Confirmed Cases',
    //     width: barWidth,
    //     height: 50,
    //     ticks: 5,
    //     tickFormat: function(d, i, n) { return n[i + 1] ? d : d + '+'; }
    //   }));

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
    <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
      <svg
        id="chart"
        preserveAspectRatio="xMidYMid meet"
        ref={choroplethMap}
      ></svg>
    </div>
  );
}

export default ChoroplethMap;
