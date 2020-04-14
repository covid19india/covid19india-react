import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {timeFormat} from 'd3-time-format';

function DeltaBarGraph({timeseries, typeKey}) {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    setData(timeseries);
  }, [timeseries]);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const margin = {top: 50, right: 0, bottom: 50, left: 0};
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;
    const barRadius = 5;

    const formatTime = timeFormat('%e %b');
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => formatTime(d.date)))
      .range([margin.left, chartRight])
      .padding(0.33);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[typeKey])])
      .range([chartBottom, margin.top]); // - barRadius

    const xAxis = d3.axisBottom(xScale).tickSize(0);

    svg
      .select('.x-axis')
      .style('transform', `translateY(${chartBottom}px)`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .selectAll('text')
      .attr('y', 0)
      .attr('x', -40)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'start');

    const sel = svg.selectAll('.bar').data(data);

    sel
      .join('path')
      .attr('class', 'bar')
      .attr('d', (d) =>
        roundedBar(
          xScale(formatTime(d.date)),
          chartBottom,
          xScale.bandwidth(),
          chartBottom - yScale(d[typeKey]),
          barRadius
        )
      )
      .attr('fill', (d, i) => (i < data.length - 1 ? '#dc354590' : '#dc3545'));

    sel
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d[typeKey]) - 6)
      .attr('fill', (d, i) => (i < data.length - 1 ? '#dc354590' : '#dc3545'))
      .attr('font-weight', '900')
      .text((d) => d[typeKey])
      .append('tspan')
      .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
      .attr('dy', '-1em')
      .text((d) => '% here');
  }, [data, typeKey]);

  return (
    <div className="DeltaBarGraph fadeInUp" style={{animationDelay: '0.7s'}}>
      <svg
        ref={svgRef}
        width="250"
        height="250"
        viewBox="0 0 300 250"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default DeltaBarGraph;

function roundedBar(x, y, w, h, r, f) {
  if (!h) return;
  // Flag for sweep:
  if (f === undefined) f = 1;
  // x coordinates of top of arcs
  const x0 = x + r;
  const x1 = x + w - r;
  // y coordinates of bottom of arcs
  const y0 = y - h + r;

  const parts = [
    'M',
    x,
    y,
    'L',
    x,
    y0,
    'A',
    r,
    r,
    0,
    0,
    f,
    x0,
    y - h,
    'L',
    x1,
    y - h,
    'A',
    r,
    r,
    0,
    0,
    f,
    x + w,
    y0,
    'L',
    x + w,
    y,
    'Z',
  ];
  return parts.join(' ');
}
