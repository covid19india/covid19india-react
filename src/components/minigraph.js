import {PRIMARY_STATISTICS} from '../constants';

import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useEffect, useRef, useCallback, useMemo} from 'react';

function Minigraph({timeseries}) {
  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const svgRef3 = useRef();
  const svgRef4 = useRef();

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

    const svg1 = d3.select(svgRef1.current);
    const svg2 = d3.select(svgRef2.current);
    const svg3 = d3.select(svgRef3.current);
    const svg4 = d3.select(svgRef4.current);

    const xScale = d3
      .scaleTime()
      .domain([new Date(d3.min(dates)), new Date(d3.max(dates))])
      .range([margin.left, chartRight]);

    const svgArray = [svg1, svg2, svg3, svg4];
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
      const type = PRIMARY_STATISTICS[index];
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
            .y((date) => yScale(timeseries[date][type]))
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
        .attr('cy', (date) => yScale(timeseries[date][type]))
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
      <div className="svg-parent fadeInUp" style={{animationDelay: '1.4s'}}>
        <svg
          ref={svgRef1}
          width="100"
          height="75"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-blue fadeInUp"
        style={{animationDelay: '1.5s'}}
      >
        <svg
          ref={svgRef2}
          width="100"
          height="75"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-green fadeInUp"
        style={{animationDelay: '1.6s'}}
      >
        <svg
          ref={svgRef3}
          width="100"
          height="75"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-gray fadeInUp"
        style={{animationDelay: '1.7s'}}
      >
        <svg
          ref={svgRef4}
          width="100"
          height="75"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
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
