import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef, useState} from 'react';

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.arrayKey, currProps.arrayKey)) return false;
  if (!equal(prevProps.timeseries, currProps.timeseries)) return false;
  return true;
};

function DeltaBarGraph({timeseries, arrayKey}) {
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
          d3.min(data, (d) => d[arrayKey])
        ),
        Math.max(
          1,
          d3.max(data, (d) => d[arrayKey])
        ),
      ])
      .range([chartBottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).tickSize(0);

    const t = svg.transition().duration(500);
    svg.selectAll('.delta').remove();
    svg
      .select('.x-axis')
      .transition(t)
      .style('transform', `translateY(${yScale(0)}px)`)
      .call(xAxis)
      .on('start', () => svg.select('.domain').remove())
      .selectAll('text')
      .attr('y', 0)
      .attr('dy', (d, i) => (data[i][arrayKey] < 0 ? '-1.5em' : '1.5em'))
      .style('text-anchor', 'middle')
      .attr('fill', (d, i) => {
        switch (arrayKey) {
          case 'dailyconfirmed':
            return '#dc3545';
          case 'dailyrecovered':
            return '#28a745';
          case 'dailyactive':
            return '#0479fb';
          default:
            return '#6c757d';
        }
      });

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
          yScale(0) - yScale(d[arrayKey]),
          r
        )
      )
      .attr('fill', (d, i) => {
        if (arrayKey === 'dailyconfirmed')
          return i < data.length - 1 ? '#dc354590' : '#dc3545';
        else if (arrayKey === 'dailyrecovered')
          return i < data.length - 1 ? '#28a74590' : '#28a745';
        else if (arrayKey === 'dailyactive')
          return i < data.length - 1 ? '#007bff90' : '#007bff';
        else return i < data.length - 1 ? '#6c757d90' : '#6c757d';
      })
      .on('end', () =>
        svg
          .selectAll('.delta')
          .data(arrayKey === 'dailyconfirmed' ? data : [])
          .join('text')
          .attr('class', 'delta')
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
          .attr('y', (d) => yScale(d[arrayKey]) - 6)
          .text((d) => d[arrayKey])
          .append('tspan')
          .attr('class', 'percent')
          .attr('x', (d) => xScale(formatTime(d.date)) + xScale.bandwidth() / 2)
          .attr('dy', '-1.2em')
          .text((d, i) =>
            i && data[i - 1][arrayKey]
              ? d3.format('+.1%')(
                  (data[i][arrayKey] - data[i - 1][arrayKey]) /
                    data[i - 1][arrayKey]
                )
              : ''
          )
      );
  }, [data, arrayKey]);

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
