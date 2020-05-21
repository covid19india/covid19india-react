import {COLORS, PRIMARY_STATISTICS} from '../constants';

import classnames from 'classnames';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useEffect, useRef, useMemo} from 'react';

function Minigraph({timeseries}) {
  const refs = useRef([]);

  const dates = useMemo(() => {
    return Object.keys(timeseries).slice(-20);
  }, [timeseries]);

  dates.forEach((date) => {
    timeseries = produce(timeseries, (draftTimeseries) => {
      draftTimeseries[date].active =
        draftTimeseries[date].confirmed -
        draftTimeseries[date].recovered -
        draftTimeseries[date].deceased;
    });
  });

  useEffect(() => {
    if (!timeseries) return;
    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;
    const T = dates.length;

    const svgArray = [];
    refs.current.forEach((ref) => {
      svgArray.push(d3.select(ref));
    });

    const xScale = d3
      .scaleTime()
      .domain([new Date(dates[0]), new Date(dates[T - 1])])
      .range([margin.left, chartRight]);

    const dailyMin = d3.min(dates, (date) => timeseries[date].active);
    const dailyMax = d3.max(dates, (date) =>
      Math.max(
        timeseries[date].confirmed,
        timeseries[date].recovered,
        timeseries[date].deceased
      )
    );

    const domainMinMax = Math.max(-dailyMin, dailyMax);

    const yScale = d3
      .scaleLinear()
      .domain([-domainMinMax, domainMinMax])
      .range([chartBottom, margin.top]);

    svgArray.forEach((svg, index) => {
      const statistic = PRIMARY_STATISTICS[index];
      const color = COLORS[statistic];

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
              .attr(
                'd',
                d3
                  .line()
                  .x((date) => xScale(new Date(date)))
                  .y((date) => yScale(timeseries[date][statistic]))
                  .curve(d3.curveMonotoneX)
              )
              .attr('stroke-dasharray', function () {
                return (pathLength = this.getTotalLength());
              })
              .call((enter) =>
                enter
                  .attr('stroke-dashoffset', pathLength)
                  .transition()
                  .delay(500)
                  .duration(2500)
                  .attr('stroke-dashoffset', 0)
                  .transition()
                  .duration(0)
                  .attr('stroke-dasharray', null)
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr(
                'd',
                d3
                  .line()
                  .x((date) => xScale(new Date(date)))
                  .y((date) => yScale(timeseries[date][statistic]))
                  .curve(d3.curveMonotoneX)
              )
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
              .attr('cy', (date) => yScale(timeseries[date][statistic]))
              .style('opacity', 0)
              .call((enter) =>
                enter
                  .transition()
                  .delay(2500)
                  .duration(500)
                  .style('opacity', 1)
                  .attr('cx', (date) => xScale(new Date(date)))
                  .attr('cy', (date) => yScale(timeseries[date][statistic]))
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('cx', (date) => xScale(new Date(date)))
              .attr('cy', (date) => yScale(timeseries[date][statistic]))
        );
    });
  }, [dates, timeseries]);

  return (
    <div className="Minigraph">
      {PRIMARY_STATISTICS.map((statistic, i) => (
        <div key={statistic} className={classnames('svg-parent')}>
          <svg
            ref={(el) => {
              refs.current[i] = el;
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

const isEqual = (currProps, prevProps) => {
  if (equal(currProps, prevProps)) {
    return true;
  }
  return false;
};

export default React.memo(Minigraph, isEqual);
