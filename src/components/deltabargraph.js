import {COLORS, D3_TRANSITION_DURATION, NUM_BARS_STATEPAGE} from '../constants';
import {
  formatDate,
  formatNumber,
  getIndiaYesterdayISO,
  getStatistic,
} from '../utils/commonfunctions';

import {min, max} from 'd3-array';
import {axisBottom} from 'd3-axis';
import {scaleBand, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
// eslint-disable-next-line
import {transition} from 'd3-transition';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef} from 'react';

const getDeltaStatistic = (data, statistic) => {
  return getStatistic(data, 'delta', statistic);
};

const [width, height] = [250, 250];
const margin = {top: 50, right: 0, bottom: 50, left: 0};

function DeltaBarGraph({timeseries, statistic}) {
  const svgRef = useRef();

  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaYesterdayISO()
  );
  const dates = pastDates.slice(-NUM_BARS_STATEPAGE);

  useEffect(() => {
    const svg = select(svgRef.current);

    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;
    const r = 5;

    // const formatTime = timeFormat('%e %b');
    const xScale = scaleBand()
      .domain(dates)
      .range([margin.left, chartRight])
      .paddingInner(0.33);

    const yScale = scaleLinear()
      .domain([
        Math.min(
          0,
          min(dates, (date) => getDeltaStatistic(timeseries[date], statistic))
        ),
        Math.max(
          1,
          max(dates, (date) => getDeltaStatistic(timeseries[date], statistic))
        ),
      ])
      .range([chartBottom, margin.top]);

    const xAxis = axisBottom(xScale)
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
      .text((date) =>
        formatNumber(getDeltaStatistic(timeseries[date], statistic))
      );

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
        if (!prevVal) return '';
        const delta = getDeltaStatistic(timeseries[date], statistic) - prevVal;
        return `${delta > 0 ? '+' : ''}${formatNumber(
          (100 * delta) / Math.abs(prevVal)
        )}%`;
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
        <g
          className="x-axis"
          transform={`translate(0, ${height - margin.bottom})`}
        />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.stateCode, currProps.stateCode)) {
    return false;
  } else if (!equal(prevProps.statistic, currProps.statistic)) {
    return false;
  }

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
