import {
  COLORS,
  MINIGRAPH_LOOKBACK_DAYS,
  PRIMARY_STATISTICS,
} from '../constants';
import {getStatistic, getIndiaYesterdayISO} from '../utils/commonfunctions';

import classnames from 'classnames';
import * as d3 from 'd3';
import {interpolatePath} from 'd3-interpolate-path';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef, useMemo} from 'react';

function Minigraph({timeseries, date: timelineDate}) {
  const refs = useRef([]);

  const dates = useMemo(() => {
    const today = timelineDate || getIndiaYesterdayISO();
    const pastDates = Object.keys(timeseries).filter((date) => date <= today);
    const cutOffDate = formatISO(
      subDays(new Date(today), MINIGRAPH_LOOKBACK_DAYS),
      {representation: 'date'}
    );
    return pastDates.filter((date) => date >= cutOffDate);
  }, [timeseries, timelineDate]);

  useEffect(() => {
    const T = dates.length;

    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const xScale = d3
      .scaleTime()
      .clamp(true)
      .domain([new Date(dates[0]), new Date(dates[T - 1])])
      .range([margin.left, chartRight]);

    const dailyMin = d3.min(dates, (date) =>
      getStatistic(timeseries[date], 'delta', 'active')
    );

    const dailyMax = d3.max(dates, (date) =>
      Math.max(
        getStatistic(timeseries[date], 'delta', 'confirmed'),
        getStatistic(timeseries[date], 'delta', 'recovered'),
        getStatistic(timeseries[date], 'delta', 'deceased')
      )
    );

    const domainMinMax = Math.max(-dailyMin, dailyMax);

    const yScale = d3
      .scaleLinear()
      .clamp(true)
      .domain([-domainMinMax, domainMinMax])
      .range([chartBottom, margin.top]);

    refs.current.forEach((ref, index) => {
      const svg = d3.select(ref);
      const statistic = PRIMARY_STATISTICS[index];
      const color = COLORS[statistic];

      const line = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((date) => xScale(new Date(date)))
        .y((date) =>
          yScale(getStatistic(timeseries[date], 'delta', statistic))
        );

      let pathLength;
      svg
        .selectAll('path')
        .data([dates])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('fill', 'none')
              .attr('stroke', color + '99')
              .attr('stroke-width', 2.5)
              .attr('d', line)
              .attr('stroke-dasharray', function () {
                return (pathLength = this.getTotalLength());
              })
              .call((enter) =>
                enter
                  .attr('stroke-dashoffset', pathLength)
                  .transition()
                  .delay(100)
                  .duration(2500)
                  .attr('stroke-dashoffset', 0)
              ),
          (update) =>
            update
              .attr('stroke-dasharray', null)
              .transition()
              .duration(500)
              .attrTween('d', function (date) {
                const previous = d3.select(this).attr('d');
                const current = line(date);
                return interpolatePath(previous, current);
              })
        );

      svg
        .selectAll('circle')
        .data([dates[T - 1]])
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('fill', color)
              .attr('r', 2.5)
              .attr('cx', (date) => xScale(new Date(date)))
              .attr('cy', (date) =>
                yScale(getStatistic(timeseries[date], 'delta', statistic))
              )
              .style('opacity', 0)
              .call((enter) =>
                enter
                  .transition()
                  .delay(2100)
                  .duration(500)
                  .style('opacity', 1)
                  .attr('cx', (date) => xScale(new Date(date)))
                  .attr('cy', (date) =>
                    yScale(getStatistic(timeseries[date], 'delta', statistic))
                  )
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('cx', (date) => xScale(new Date(date)))
              .attr('cy', (date) =>
                yScale(getStatistic(timeseries[date], 'delta', statistic))
              )
        );
    });
  }, [dates, timeseries]);

  return (
    <div className="Minigraph">
      {PRIMARY_STATISTICS.map((statistic, index) => (
        <div key={statistic} className={classnames('svg-parent')}>
          <svg
            ref={(el) => {
              refs.current[index] = el;
            }}
            width="100"
            height="75"
            viewBox="0 0 100 75"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  }
  return true;
};

export default React.memo(Minigraph, isEqual);
