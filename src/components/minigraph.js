import {PRIMARY_STATISTICS} from '../constants';

import classnames from 'classnames';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useEffect, useRef, useCallback, useMemo} from 'react';

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

  const graphData = useCallback(() => {
    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const svgArray = [];
    refs.current.forEach((ref) => {
      svgArray.push(d3.select(ref));
    });

    console.log(svgArray);

    const xScale = d3
      .scaleTime()
      .domain([new Date(d3.min(dates)), new Date(d3.max(dates))])
      .range([margin.left, chartRight]);
    const colors = ['#ff073a', '#007bff', '#28a745', '#6c757d'];

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
      const color = colors[index];

      const path = svg
        .append('path')
        .datum(dates)
        .attr('fill', 'none')
        .attr('stroke', color + '99')
        .attr('stroke-width', 2.5)
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x((date) => xScale(new Date(date)))
            .y((date) => yScale(timeseries[date][statistic]))
            .curve(d3.curveMonotoneX)
        );

      const totalLength = path.node().getTotalLength();

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .delay(500)
        .duration(2500)
        .attr('stroke-dashoffset', 0);

      svg
        .selectAll('.dot')
        .data(dates.slice(-1))
        .enter()
        .append('circle')
        .attr('fill', color)
        .attr('stroke', color)
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', (date) => xScale(new Date(date)))
        .attr('cy', (date) => yScale(timeseries[date][statistic]))
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .delay(500)
        .duration(2500)
        .style('opacity', 1);
    });
  }, [dates, timeseries]);

  useEffect(() => {
    if (timeseries) {
      graphData();
    }
  }, [timeseries, graphData]);

  return (
    <div className="Minigraph">
      {PRIMARY_STATISTICS.map((statistic) => (
        <div key={statistic} className={classnames('svg-parent')}>
          <svg
            ref={(ref) => {
              refs.current.push(ref);
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
