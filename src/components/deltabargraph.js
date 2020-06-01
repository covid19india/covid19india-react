import {COLORS, D3_TRANSITION_DURATION} from '../constants';
import {formatDate, getStatistic} from '../utils/commonfunctions';

import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef} from 'react';

const getDeltaStatistic = (data, statistic) => {
  return getStatistic(data, 'delta', statistic);
};

const [width, height] = [250, 250];
const margin = {top: 50, right: 5, bottom: 50, left: 0};

function DeltaBarGraph({timeseries, dates, statistic}) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;
    const r = 5;

    // const formatTime = d3.timeFormat('%e %b');
    const xScale = d3
      .scaleBand()
      .domain(dates)
      .range([margin.left, chartRight])
      .paddingInner(0.33);

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(
          0,
          d3.min(dates, (date) =>
            getDeltaStatistic(timeseries[date], statistic)
          )
        ),
        Math.max(
          1,
          d3.max(dates, (date) =>
            getDeltaStatistic(timeseries[date], statistic)
          )
        ),
      ])
      .range([chartBottom, margin.top]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickFormat((date) => formatDate(date, 'dd MMM'));

    const t = svg.transition().duration(D3_TRANSITION_DURATION);
    svg
      .select('.x-axis')
      .transition(t)
      .style('transform', `translateY(${yScale(0)}px)`)
      .call(xAxis)
      .on('start', () => svg.select('.domain').remove())
      .selectAll('text')
      .attr('y', 0)
      .attr('dy', (date, i) =>
        getDeltaStatistic(timeseries[date], statistic) < 0 ? '-1em' : '1.5em'
      )
      .style('text-anchor', 'middle')
      .attr('fill', COLORS[statistic]);

    svg
      .selectAll('.bar')
      .data(dates)
      .join((enter) =>
        enter
          .append('path')
          .attr('class', 'bar')
          .attr('d', (date) =>
            roundedBar(xScale(date), yScale(0), xScale.bandwidth(), 0, r)
          )
      )
      .transition(t)
      .attr('d', (date) =>
        roundedBar(
          xScale(date),
          yScale(0),
          xScale.bandwidth(),
          yScale(0) - yScale(getDeltaStatistic(timeseries[date], statistic)),
          r
        )
      )
      .attr('fill', (date, i) => {
        return i < date.length - 1
          ? COLORS[statistic] + '90'
          : COLORS[statistic];
      });

    const textSelection = svg
      .selectAll('.label')
      .data(dates)
      .join('text')
      .attr('class', 'label')
      .attr('x', (date) => xScale(date) + xScale.bandwidth() / 2)
      .text((date) => getDeltaStatistic(timeseries[date], statistic));

    textSelection
      .transition(t)
      .attr('fill', COLORS[statistic])
      .attr('y', (date) => {
        const val = getDeltaStatistic(timeseries[date], statistic);
        return yScale(val) + (val < 0 ? 15 : -6);
      });

    textSelection
      .append('tspan')
      .attr(
        'dy',
        (date) =>
          `${getDeltaStatistic(timeseries[date], statistic) < 0 ? 1.2 : -1.2}em`
      )
      .attr('x', (date) => xScale(date) + xScale.bandwidth() / 2)
      .text((date, i) => {
        if (i === 0) return '';
        const prevVal = getDeltaStatistic(timeseries[dates[i - 1]], statistic);
        const val = getDeltaStatistic(timeseries[date], statistic);
        return prevVal
          ? d3.format('+.1~%')((val - prevVal) / Math.abs(prevVal))
          : '';
      })
      .transition(t)
      .attr('fill', COLORS[statistic] + '90');
  }, [dates, timeseries, statistic]);

  return (
    <div className="DeltaBarGraph">
      <svg
        ref={svgRef}
        width="250"
        height="250"
        viewBox="0 0 250 250"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="x-axis" transform={`translate(0, ${height - margin.bottom})`}/>
        <g className="y-axis" />
      </svg>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.statistic, currProps.statistic)) return false;
  return true;
};

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
