import {
  COLORS,
  D3_TRANSITION_DURATION,
  TIMESERIES_STATISTICS,
} from '../constants';
import {useResizeObserver} from '../hooks/useresizeobserver';
import {
  capitalize,
  formatNumber,
  formatDate,
  getStatistic,
  parseIndiaDate,
} from '../utils/commonfunctions';

import classnames from 'classnames';
import * as d3 from 'd3';
import {interpolatePath} from 'd3-interpolate-path';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

function TimeSeries({timeseries, dates, chartType, isUniform, isLog}) {
  const {t} = useTranslation();
  const refs = useRef([]);

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [highlightedDate, setHighlightedDate] = useState();

  useEffect(() => {
    setHighlightedDate(dates[dates.length - 1]);
  }, [dates]);

  useEffect(() => {
    const T = dates.length;

    const {width, height} =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // Margins
    const margin = {top: 15, right: 35, bottom: 25, left: 25};
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const yBufferTop = 1.2;
    const yBufferBottom = 1.1;

    const xScale = d3
      .scaleTime()
      .clamp(true)
      .domain([parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])])
      .range([margin.left, chartRight]);

    // Number of x-axis ticks
    const numTicksX = width < 480 ? 4 : 7;

    const xAxis = (g) =>
      g.attr('class', 'x-axis').call(
        d3
          .axisBottom(xScale)
          .ticks(numTicksX)
          .tickFormat((date) => formatDate(date, 'dd MMM'))
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
        .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(4));

    const uniformScaleMin = d3.min(dates, (date) =>
      getStatistic(timeseries[date], chartType, 'active')
    );

    const uniformScaleMax = d3.max(dates, (date) =>
      Math.max(
        getStatistic(timeseries[date], chartType, 'confirmed'),
        getStatistic(timeseries[date], chartType, 'recovered'),
        getStatistic(timeseries[date], chartType, 'deceased')
      )
    );

    const yScaleUniformLinear = d3
      .scaleLinear()
      .clamp(true)
      .domain([uniformScaleMin, Math.max(1, yBufferTop * uniformScaleMax)])
      .nice(4)
      .range([chartBottom, margin.top]);

    const yScaleUniformLog = d3
      .scaleLog()
      .clamp(true)
      .domain([
        Math.max(1, uniformScaleMin),
        Math.max(10, yBufferTop * uniformScaleMax),
      ])
      .nice(4)
      .range([chartBottom, margin.top]);

    const generateYScale = (statistic) => {
      if (isUniform && chartType === 'total' && isLog && statistic !== 'tested')
        return yScaleUniformLog;

      if (isUniform && statistic !== 'tested') return yScaleUniformLinear;

      if (chartType === 'total' && isLog)
        return d3
          .scaleLog()
          .clamp(true)
          .domain([
            Math.max(
              1,
              d3.min(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
            ),
            Math.max(
              10,
              yBufferTop *
                d3.max(dates, (date) =>
                  getStatistic(timeseries[date], chartType, statistic)
                )
            ),
          ])
          .nice(4)
          .range([chartBottom, margin.top]);

      return d3
        .scaleLinear()
        .clamp(true)
        .domain([
          yBufferBottom *
            Math.min(
              0,
              d3.min(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
            ),
          Math.max(
            1,
            yBufferTop *
              d3.max(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
          ),
        ])
        .nice(4)
        .range([chartBottom, margin.top]);
    };

    function mousemove() {
      const xm = d3.mouse(this)[0];
      const date = xScale.invert(xm);
      const bisectDate = d3.bisector((date) => parseIndiaDate(date)).left;
      const index = bisectDate(dates, date, 1);
      const dateLeft = dates[index - 1];
      const dateRight = dates[index];
      setHighlightedDate(
        date - parseIndiaDate(dateLeft) < parseIndiaDate(dateRight) - date
          ? dateLeft
          : dateRight
      );
    }

    function mouseout() {
      setHighlightedDate(dates[T - 1]);
    }

    /* Begin drawing charts */
    refs.current.forEach((ref, i) => {
      const svg = d3.select(ref);
      const t = svg.transition().duration(D3_TRANSITION_DURATION);

      const statistic = TIMESERIES_STATISTICS[i];
      const yScale = generateYScale(statistic);
      const color = COLORS[statistic];

      /* X axis */
      svg
        .select('.x-axis')
        .style('transform', `translateY(${chartBottom}px)`)
        .transition(t)
        .call(xAxis);
      svg.select('.x-axis2').transition(t).call(xAxis2, yScale);

      /* Y axis */
      svg
        .select('.y-axis')
        .style('transform', `translateX(${chartRight}px)`)
        .transition(t)
        .call(yAxis, yScale);

      /* Path dots */
      svg
        .selectAll('circle')
        .data(dates, (date) => date)
        .join((enter) =>
          enter
            .append('circle')
            .attr('fill', color)
            .attr('stroke', color)
            .attr('r', 2)
            .attr('cy', chartBottom)
            .attr('cx', (date) => xScale(parseIndiaDate(date)))
        )
        .transition(t)
        .attr('cx', (date) => xScale(parseIndiaDate(date)))
        .attr('cy', (date) =>
          yScale(getStatistic(timeseries[date], chartType, statistic))
        );

      if (chartType === 'total') {
        svg
          .selectAll('.stem')
          .transition(t)
          .attr('y1', yScale(0))
          .attr('y2', yScale(0))
          .remove();

        const line = d3
          .line()
          .curve(d3.curveMonotoneX)
          .x((date) => xScale(parseIndiaDate(date)))
          .y((date) =>
            yScale(getStatistic(timeseries[date], chartType, statistic))
          );

        let pathLength;
        svg
          .selectAll('.trend')
          .data(T ? [dates] : [])
          .join(
            (enter) =>
              enter
                .append('path')
                .attr('class', 'trend')
                .attr('fill', 'none')
                .attr('stroke', color + '50')
                .attr('stroke-width', 4)
                .attr('d', line)
                .attr('stroke-dasharray', function () {
                  return (pathLength = this.getTotalLength());
                })
                .call((enter) =>
                  enter
                    .attr('stroke-dashoffset', pathLength)
                    .transition(t)
                    .attr('stroke-dashoffset', 0)
                ),
            (update) =>
              update
                .attr('stroke-dasharray', null)
                .transition(t)
                .attrTween('d', function (date) {
                  const previous = d3.select(this).attr('d');
                  const current = line(date);
                  return interpolatePath(previous, current);
                })
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
              .attr('x1', (date) => xScale(parseIndiaDate(date)))
              .attr('y1', chartBottom)
              .attr('x2', (date) => xScale(parseIndiaDate(date)))
              .attr('y2', chartBottom)
          )
          .transition(t)
          .attr('x1', (date) => xScale(parseIndiaDate(date)))
          .attr('y1', yScale(0))
          .attr('x2', (date) => xScale(parseIndiaDate(date)))
          .attr('y2', (date) =>
            yScale(getStatistic(timeseries[date], chartType, statistic))
          );
      }

      svg.selectAll('*').attr('pointer-events', 'none');
      svg
        .on('mousemove', mousemove)
        .on('touchmove', mousemove)
        .on('mouseout', mouseout)
        .on('touchend', mouseout);
    });
  }, [chartType, dimensions, isUniform, isLog, timeseries, dates]);

  useEffect(() => {
    refs.current.forEach((ref) => {
      const svg = d3.select(ref);
      svg
        .selectAll('circle')
        .attr('r', (date) => (date === highlightedDate ? 4 : 2));
    });
  }, [highlightedDate]);

  const getStatisticDelta = useCallback(
    (statistic) => {
      if (!highlightedDate) return;
      const deltaToday = getStatistic(
        timeseries?.[highlightedDate],
        'delta',
        statistic
      );
      if (chartType === 'total') return deltaToday;
      const yesterday = formatISO(subDays(parseIndiaDate(highlightedDate), 1), {
        representation: 'date',
      });
      const deltaYesterday = getStatistic(
        timeseries?.[yesterday],
        'delta',
        statistic
      );
      return deltaToday - deltaYesterday;
    },
    [timeseries, highlightedDate, chartType]
  );

  return (
    <React.Fragment>
      <div className="TimeSeries">
        {TIMESERIES_STATISTICS.map((statistic, index) => {
          const delta = getStatisticDelta(statistic);
          return (
            <div
              key={statistic}
              className={classnames('svg-parent', `is-${statistic}`)}
              ref={wrapperRef}
            >
              {highlightedDate && (
                <div className={classnames('stats', `is-${statistic}`)}>
                  <h5 className="title">{t(capitalize(statistic))}</h5>
                  <h5 className="title">
                    {formatDate(highlightedDate, 'dd MMMM')}
                  </h5>
                  <div className="stats-bottom">
                    <h2>
                      {formatNumber(
                        getStatistic(
                          timeseries?.[highlightedDate],
                          chartType,
                          statistic
                        )
                      )}
                    </h2>
                    <h6>{`${delta >= 0 ? '+' : ''}${formatNumber(delta)}`}</h6>
                  </div>
                </div>
              )}
              <svg
                ref={(element) => {
                  refs.current[index] = element;
                }}
                preserveAspectRatio="xMidYMid meet"
              >
                <g className="x-axis" />
                <g className="x-axis2" />
                <g className="y-axis" />
              </svg>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
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
  if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default React.memo(TimeSeries, isEqual);
