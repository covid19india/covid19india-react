import {
  COLORS,
  MINIGRAPH_LOOKBACK_DAYS,
  PRIMARY_STATISTICS,
} from '../constants';
import {
  getStatistic,
  getIndiaYesterdayISO,
  parseIndiaDate,
} from '../utils/commonfunctions';

import classnames from 'classnames';
import {min, max} from 'd3-array';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
// eslint-disable-next-line
import {transition} from 'd3-transition';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef, useMemo} from 'react';

function Minigraph({timeseries, date: timelineDate}) {
  const refs = useRef([]);

  const dates = useMemo(() => {
    const today = timelineDate || getIndiaYesterdayISO();
    const pastDates = Object.keys(timeseries || {}).filter(
      (date) => date <= today
    );
    const cutOffDate = formatISO(
      subDays(parseIndiaDate(today), MINIGRAPH_LOOKBACK_DAYS),
      {representation: 'date'}
    );
    return pastDates.filter((date) => date >= cutOffDate);
  }, [timeseries, timelineDate]);

  useEffect(() => {
    const T = dates.length;

    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const xScale = scaleTime()
      .clamp(true)
      .domain([parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])])
      .range([margin.left, chartRight]);

    const dailyMin = min(dates, (date) =>
      getStatistic(timeseries[date], 'delta', 'active')
    );

    const dailyMax = max(dates, (date) =>
      Math.max(
        getStatistic(timeseries[date], 'delta', 'confirmed'),
        getStatistic(timeseries[date], 'delta', 'recovered'),
        getStatistic(timeseries[date], 'delta', 'deceased')
      )
    );

    const domainMinMax = Math.max(-dailyMin, dailyMax);

    const yScale = scaleLinear()
      .clamp(true)
      .domain([-domainMinMax, domainMinMax])
      .range([chartBottom, margin.top]);

    refs.current.forEach((ref, index) => {
      const svg = select(ref);
      const statistic = PRIMARY_STATISTICS[index];
      const color = COLORS[statistic];

      const linePath = line()
        .curve(curveMonotoneX)
        .x((date) => xScale(parseIndiaDate(date)))
        .y((date) =>
          yScale(getStatistic(timeseries[date], 'delta', statistic))
        );

      let pathLength;
      svg
        .selectAll('path')
        .data(T ? [dates] : [])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('fill', 'none')
              .attr('stroke', color + '99')
              .attr('stroke-width', 2.5)
              .attr('d', linePath)
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
                const previous = select(this).attr('d');
                const current = linePath(date);
                return interpolatePath(previous, current);
              })
        );

      svg
        .selectAll('circle')
        .data(T ? [dates[T - 1]] : [])
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('fill', color)
              .attr('r', 2.5)
              .attr('cx', (date) => xScale(parseIndiaDate(date)))
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
                  .attr('cx', (date) => xScale(parseIndiaDate(date)))
                  .attr('cy', (date) =>
                    yScale(getStatistic(timeseries[date], 'delta', statistic))
                  )
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('cx', (date) => xScale(parseIndiaDate(date)))
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
  if (!equal(currProps.stateCode, prevProps.stateCode)) {
    return false;
  } else if (!equal(currProps.date, prevProps.date)) {
    return false;
  }
  return true;
};

export default React.memo(Minigraph, isEqual);
