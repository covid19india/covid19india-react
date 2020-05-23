import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef, useState} from 'react';

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.caseType, currProps.caseType)) return false;
  if (!equal(prevProps.timeseries, currProps.timeseries)) return false;
  return true;
};

const caseColor = (ctype, alpha = '') => {
  switch (ctype) {
    case 'dailyconfirmed':
      return '#ff073a' + alpha;
    case 'dailyactive':
      return '#007bff' + alpha;
    case 'dailyrecovered':
      return '#28a745' + alpha;
    case 'dailydeceased':
      return '#6c757d' + alpha;
    default:
      return;
  }
};

function DeltaBarGraph({timeseries, caseType}) {
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

    const margin = {top: 50, right: 5, bottom: 50, left: 0};
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;
    const r = 5;

    const formatTime = d3.timeFormat('%e %b');
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => formatTime(d.date)))
      .range([margin.left, chartRight])
      .paddingInner(0.33);

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(
          0,
          d3.min(data, (d) => d[caseType])
        ),
        Math.max(
          1,
          d3.max(data, (d) => d[caseType])
        ),
      ])
      .range([chartBottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).tickSize(0);

    const t = svg.transition().duration(500);
    svg
      .select('.x-axis')
      .transition(t)
      .style('transform', `translateY(${yScale(0)}px)`)
      .call(xAxis)
      .on('start', () => svg.select('.domain').remove())
      .selectAll('text')
      .attr('y', 0)
      .attr('dy', (d, i) => (data[i][caseType] < 0 ? '-1em' : '1.5em'))
      .style('text-anchor', 'middle')
      .attr('fill', caseColor(caseType));

    svg
      .selectAll('.bar')
      .data(data)
      .join('path')
      .attr('class', 'bar')
      .transition(t)
      .attr('d', (d) =>
        roundedBar(
          xScale(formatTime(d.date)),
          yScale(0),
          xScale.bandwidth(),
          yScale(0) - yScale(d[caseType]),
          r
        )
      )
      .attr('fill', (d, i) => {
        return i < data.length - 1
          ? caseColor(caseType, '90')
          : caseColor(caseType);
      });

    const textSelection = svg
      .selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
      .text((d) => d[caseType]);

    textSelection
      .transition(t)
      .attr('fill', caseColor(caseType))
      .attr('y', (d) => yScale(d[caseType]) + (d[caseType] < 0 ? 15 : -6));

    textSelection
      .append('tspan')
      .attr('dy', (d) => `${d[caseType] < 0 ? 1.2 : -1.2}em`)
      .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
      .text((d, i) =>
        i && data[i - 1][caseType]
          ? d3.format('+.1~%')(
              (data[i][caseType] - data[i - 1][caseType]) /
                Math.abs(data[i - 1][caseType])
            )
          : ''
      )
      .transition(t)
      .attr('fill', caseColor(caseType, '90'));
  }, [data, caseType]);

  return (
    <div className="DeltaBarGraph fadeInUp" style={{animationDelay: '0.8s'}}>
      <svg
        ref={svgRef}
        width="250"
        height="250"
        viewBox="0 0 250 250"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default React.memo(DeltaBarGraph, isEqual);

function roundedBar(x, y, w, h, r) {
  r = Math.sign(h) * Math.min(Math.abs(h), r);
  const paths = [
    `M ${x} ${y}`,
    `v ${-h + r}`,
    `q 0 ${-r} ${Math.abs(r)} ${-r}`,
    `h ${w - 2 * Math.abs(r)}`,
    `q ${Math.abs(r)} 0 ${Math.abs(r)} ${r}`,
    `v ${h - r}`,
    'Z',
  ];
  return paths.join(' ');
}
