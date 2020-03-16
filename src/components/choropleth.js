import React, {useState, useEffect, useRef} from 'react';
import {geoPath, geoMercator} from 'd3-geo';
import * as d3 from 'd3';
import * as topojson from 'topojson';

function ChoroplethMap(props) {
  const [fetched, setFetched] = useState(false);
  const [states, setStates] = useState(props.states);
  const choroplethMap = useRef(null);

  useEffect(()=>{
    if (choroplethMap.current && props.states.length>0) {
      const theMap = mapData(choroplethMap.current);
      setStates(props.states);
    }
  });

  const mapData = (selector) => {
    const svg = d3.select(choroplethMap.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const unemployment = d3.map();

    const projection = d3.geoMercator()
        .center([78.9629, 22])
        .scale(900)
        .translate([width/2, height/2]);

    const path = d3.geoPath(projection);

    const x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([400, 660]);

    const color = d3.scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeBlues[9]);

    const g = svg.append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(0,40)');

    g.selectAll('rect')
        .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
        .enter().append('rect')
        .attr('height', 8)
        .attr('x', function(d) {
          return x(d[0]);
        })
        .attr('width', function(d) {
          return x(d[1]) - x(d[0]);
        })
        .attr('fill', function(d) {
          return color(d[0]);
        });

    g.append('text')
        .attr('class', 'caption')
        .attr('x', x.range()[0])
        .attr('y', -6)
        .attr('fill', '#fff')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text('Affected rate');

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) {
          return i ? x : x + '%';
        })
        .tickValues(color.domain()))
        .select('.domain')
        .remove();

    const promises = [
      d3.json('/india.json'),
    ];

    Promise.all(promises).then(ready);

    function ready([us]) {
      states.map((state, index) => {
        unemployment.set(state.name.toLowerCase(), parseInt(state.total_cases));
      });
      svg.append('g')
          .attr('class', 'states')
          .selectAll('path')
          .data(us.features)
          .enter().append('path')
          .attr('fill', function(d) {
            return color(d.rate = unemployment.get(d.properties.NAME_1));
          })
          .attr('d', path)
          .append('title')
          .text(function(d) {
            return d.rate + '%';
          });

      svg.append('path')
          .datum(topojson.mesh(us, us.features, function(a, b) {
            return a !== b;
          }))
          .attr('class', 'states-boundary')
          .attr('d', path);
    }
  };

  return (
    <div className="map">
      <svg width="700" height="500" preserveAspectRatio="none" ref={choroplethMap}></svg>
    </div>
  );
}

export default ChoroplethMap;
