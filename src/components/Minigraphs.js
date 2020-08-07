import {
  MINIGRAPH_LOOKBACK_DAYS,
  PRIMARY_STATISTICS,
  STATISTIC_CONFIGS,
} from '../constants';
import {
  getStatistic,
  getIndiaYesterdayISO,
  parseIndiaDate,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {max} from 'd3-array';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
// eslint-disable-next-line
import {transition} from 'd3-transition';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useEffect, useRef, useMemo} from 'react';

// Dimensions
const [width, height] = [100, 75];
const margin = {top: 10, right: 10, bottom: 2, left: 5};

function Minigraphs({timeseries, date: timelineDate}) {
  const refs = useRef([]);

  const dates = useMemo(() => {
    const cutOffDateUpper = timelineDate || getIndiaYesterdayISO();
    const pastDates = Object.keys(timeseries || {}).filter(
      (date) => date <= cutOffDateUpper
    );
    const lastDate = pastDates[pastDates.length - 1];

    const cutOffDateLower = formatISO(
      subDays(parseIndiaDate(lastDate), MINIGRAPH_LOOKBACK_DAYS),
      {representation: 'date'}
    );
    return pastDates.filter((date) => date >= cutOffDateLower);
  }, [timeseries, timelineDate]);

  useEffect(() => {
    const T = dates.length;

    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const xScale = scaleTime()
      .clamp(true)
      .domain(T ? [parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])] : [])
      .range([margin.left, chartRight]);

    refs.current.forEach((ref, index) => {
      const svg = select(ref);
      const statistic = PRIMARY_STATISTICS[index];
      const color = STATISTIC_CONFIGS[statistic].color;

      const dailyMaxAbs = max(dates, (date) =>
        Math.abs(getStatistic(timeseries[date], 'delta', statistic))
      );

      const yScale = scaleLinear()
        .clamp(true)
        .domain([-dailyMaxAbs, dailyMaxAbs])
        .range([chartBottom, margin.top]);

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
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (currProps.forceRender) {
    return false;
  } else if (!currProps.timeseries && prevProps.timeseries) {
    return true;
  } else if (currProps.timeseries && !prevProps.timeseries) {
    return false;
  } else if (!equal(currProps.stateCode, prevProps.stateCode)) {
    return false;
  } else if (!equal(currProps.date, prevProps.date)) {
    return false;
  }
  return true;
};

export default React.memo(Minigraphs, isEqual);
