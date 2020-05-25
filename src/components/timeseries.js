import useTimeseries from './hooks/usetimeseries';

import {COLORS, TIMESERIES_STATISTICS} from '../constants';
import {
  formatNumber,
  formatTimeseriesTickX,
  capitalize,
} from '../utils/commonfunctions';
import {useResizeObserver} from '../utils/hooks';

import classnames from 'classnames';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import React, {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';

function TimeSeries({timeseries, chartType, isUniform, isLog}) {
  const {t} = useTranslation();
  const refs = useRef([]);

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [statistics, dates, getDailyStatistic] = useTimeseries(
    timeseries,
    chartType
  );

  const [highlightedDate, setHighlightedDate] = useState(
    dates[dates.length - 1]
  );

  useEffect(() => {
    const {width, height} =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // Margins
    const margin = {top: 15, right: 35, bottom: 25, left: 25};
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const T = dates.length;
    const yBufferTop = 1.2;
    const yBufferBottom = 1.1;

    const dateMin = d3.min(dates);
    const dateMax = d3.max(dates);

    const xScale = d3
      .scaleTime()
      .clamp(true)
      .domain([new Date(dateMin), new Date(dateMax)])
      .range([margin.left, chartRight]);

    // Number of x-axis ticks
    const numTicksX = width < 480 ? 4 : 7;

    const xAxis = (g) =>
      g.attr('class', 'x-axis').call(
        d3
          .axisBottom(xScale)
          .ticks(numTicksX)
          .tickFormat((tick) => {
            return formatTimeseriesTickX(tick);
          })
      );

    const xAxis2 = (g, yScale) => {
      g.attr('class', 'x-axis2')
        .call(d3.axisBottom(xScale).tickValues([]).tickSize(0))
        .select('.domain')
        .style('transform', `translateY(${yScale(0)}px)`);

      if (yScale(0) !== chartBottom) g.select('.domain').attr('opacity', 0.4);
      else g.select('.domain').attr('opacity', 0);
    };

    const yAxis = (g, yScale) =>
      g
        .attr('class', 'y-axis')
        .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(5));

    const uniformScaleMin = d3.min([
      ...statistics[chartType].active,
      ...statistics[chartType].recovered,
      ...statistics[chartType].deceased,
    ]);

    const uniformScaleMax = d3.max([...statistics[chartType].confirmed]);

    const yScaleUniformLinear = d3
      .scaleLinear()
      .clamp(true)
      .domain([uniformScaleMin, Math.max(1, yBufferTop * uniformScaleMax)])
      .nice()
      .range([chartBottom, margin.top]);

    const yScaleUniformLog = d3
      .scaleLog()
      .clamp(true)
      .domain([
        Math.max(1, uniformScaleMin),
        Math.max(10, yBufferTop * uniformScaleMax),
      ])
      .nice()
      .range([chartBottom, margin.top]);

    const generateYScale = (statistic) => {
      if (isUniform && isLog && statistic !== 'tested') {
        return yScaleUniformLog;
      }

      if (isUniform && statistic !== 'tested') return yScaleUniformLinear;

      if (!isUniform && !isLog)
        return d3
          .scaleLog()
          .clamp(true)
          .domain([
            Math.max(1, d3.min(statistics[chartType][statistic])),
            Math.max(10, yBufferTop * d3.max(statistics[chartType][statistic])),
          ])
          .nice(4)
          .range([chartBottom, margin.top]);

      return d3
        .scaleLinear()
        .clamp(true)
        .domain([
          yBufferBottom * Math.min(0, d3.min(statistics[chartType][statistic])),
          Math.max(1, yBufferTop * d3.max(statistics[chartType][statistic])),
        ])
        .nice()
        .range([chartBottom, margin.top]);
    };

    function mousemove() {
      const xm = d3.mouse(this)[0];
      const date = xScale.invert(xm);
      const bisectDate = d3.bisector((date) => new Date(date)).left;
      const index = bisectDate(dates, date, 1);
      setHighlightedDate(dates[index]);
    }

    function mouseout() {
      setHighlightedDate(dates[T - 1]);
    }

    /* Begin drawing charts */
    refs.current.forEach((ref, i) => {
      const svg = d3.select(ref);
      const t = svg.transition().duration(300);

      const statistic = TIMESERIES_STATISTICS[i];
      const yScale = generateYScale(statistic);
      const color = COLORS[statistic];

      /* X axis */
      svg
        .select('.x-axis')
        .style('transform', `translateY(${chartBottom}px)`)
        .transition(t)
        .call(xAxis);
      svg.select('.x-axis2')
        .transition(t).call(xAxis2, yScale);

      /* Y axis */
      svg
        .select('.y-axis')
        .style('transform', `translateX(${chartRight}px)`)
        .transition(t)
        .call(yAxis, yScale);

      /* Path dots */
      svg
        .selectAll('circle')
        .data(dates)
        .join((enter) =>
          enter
            .append('circle')
            .attr('fill', color)
            .attr('stroke', color)
            .attr('r', 2)
            .attr('cy', chartBottom)
            .attr('cx', (date) => xScale(new Date(date)))
        )
        .transition(t)
        .attr('cx', (date) => xScale(new Date(date)))
        .attr('cy', (date, index) =>
          yScale(statistics[chartType][statistic][index])
        );

      if (chartType === 'cumulative') {
        svg.selectAll('.stem')
        .transition(t)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .remove();

        const path = svg
          .selectAll('.trend')
          .data([dates])
          .join('path')
          .attr('class', 'trend')
          .attr('fill', 'none')
          .attr('stroke', color + '99')
          .attr('stroke-width', 4);

        // HACK
        // Path interpolation is non-trivial. Ideally, a custom path tween
        // function should be defined which takes care that old path dots
        // transition synchronously along with the path transition. This hack
        // simulates that behaviour.
        if (path.attr('d')) {
          const n = path.node().getTotalLength();
          const p = path.node().getPointAtLength(n);
          // Append points at end of path for better interpolation
          path.attr('d', () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T));
        }

        path
          .transition(t)
          .attr('opacity', chartType === 'cumulative' ? 1 : 0)
          .attr(
            'd',
            d3
              .line()
              .x((date) => {
                xScale(new Date(date));
              })
              .y((date, index) => {
                yScale(statistics[chartType][statistic][index]);
              })
              .curve(d3.curveMonotoneX)
          );
      } else {
        /* DAILY TRENDS */
        svg.selectAll('.trend').remove();

        svg
          .selectAll('.stem')
          .data(dates, (date) => date)
          .join((enter) =>
            enter
              .append('line')
              .attr('class', 'stem')
              .style('stroke', color + '99')
              .style('stroke-width', 4)
              .attr('x1', (date) => xScale(new Date(date)))
              .attr('y1', chartBottom)
              .attr('x2', (date) => xScale(new Date(date)))
              .attr('y2', chartBottom)
          )
          .transition(t)
          .attr('x1', (date) => xScale(new Date(date)))
          .attr('y1', yScale(0))
          .attr('x2', (date) => xScale(new Date(date)))
          .attr('y2', (date, index) =>
            yScale(statistics[chartType][statistic][index])
          );
      }

      svg
        .selectAll('*').attr('pointer-events', 'none');
      svg
        .on('mousemove', mousemove)
        .on('touchmove', mousemove)
        .on('mouseout', mouseout)
        .on('touchend', mouseout);
    });
  }, [chartType, dimensions, isUniform, isLog, dates, statistics]);

  useEffect(() => {
    refs.current.forEach((ref) => {
      const svg = d3.select(ref);
      svg
        .selectAll('circle')
        .attr('r', (date) => date === highlightedDate ? 4 : 2);
    });
  }, [highlightedDate]);

  return (
    <React.Fragment>
      <div className="TimeSeries">
        {TIMESERIES_STATISTICS.map((statistic, index) => (
          <div
            key={statistic}
            className={classnames('svg-parent', `is-${statistic}`)}
            ref={wrapperRef}
          >
            <div className={classnames('stats', `is-${statistic}`)}>
              <h5 className="title">{capitalize(t(statistic))}</h5>
              <h5 className="">{`${highlightedDate}`}</h5>
              <div className="stats-bottom">
                <h2>
                  {formatNumber(
                    getDailyStatistic(highlightedDate, statistic, chartType)
                  )}
                </h2>
                <h6></h6>
              </div>
            </div>
            <svg
              ref={(el) => {
                refs.current[index] = el;
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <g className="x-axis" />
              <g className="x-axis2" />
              <g className="y-axis" />
            </svg>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.dates.length, prevProps.dates.length)) {
    return false;
  }
  if (!equal(currProps.chartType, prevProps.chartType)) {
    return false;
  }
  if (!equal(currProps.isUniform, prevProps.isUniform)) {
    return false;
  }
  if (!equal(currProps.isLog, prevProps.isLog)) {
    return false;
  }
  if (!equal(currProps.stateCode, prevProps.stateCode)) {
    return false;
  }
  return true;
};

export default React.memo(TimeSeries, isEqual);
