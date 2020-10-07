import {
  D3_TRANSITION_DURATION,
  STATISTIC_CONFIGS,
  TIMESERIES_STATISTICS,
} from '../constants';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {
  capitalize,
  formatNumber,
  formatDate,
  getStatistic,
  parseIndiaDate,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {min, max, bisector} from 'd3-array';
import {axisBottom, axisRight} from 'd3-axis';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear, scaleLog} from 'd3-scale';
import {select, mouse} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
// eslint-disable-next-line
import {transition} from 'd3-transition';
import equal from 'fast-deep-equal';
import React, {useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

// Chart margins
const margin = {top: 15, right: 35, bottom: 25, left: 25};

function Timeseries({timeseries, dates, chartType, isUniform, isLog}) {
  const {t} = useTranslation();
  const refs = useRef([]);

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [highlightedDate, setHighlightedDate] = useState();

  useEffect(() => {
    setHighlightedDate(dates[dates.length - 1]);
  }, [dates]);

  const getBarWidth = useCallback(() => {
    const T = dates.length;
    // Dimensions
    const {width} = dimensions || wrapperRef.current.getBoundingClientRect();
    // Chart extremes
    const chartRight = width - margin.right;
    // Bar widths
    const axisWidth = chartRight - margin.left;
    return Math.min(4, axisWidth / (1.25 * T));
  }, [dates.length, dimensions]);

  useEffect(() => {
    const T = dates.length;
    // Dimensions
    const {width, height} =
      dimensions || wrapperRef.current.getBoundingClientRect();
    // Chart extremes
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;
    const barWidth = getBarWidth();

    // Buffer space along y-axis
    const yBufferTop = 1.2;
    const yBufferBottom = 1.1;

    const xScale = scaleTime()
      .clamp(true)
      .domain(T ? [parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])] : [])
      .range([margin.left, chartRight]);

    // Number of x-axis ticks
    const numTicksX = width < 480 ? 4 : 7;

    const xAxis = (g) =>
      g.attr('class', 'x-axis').call(
        axisBottom(xScale)
          .ticks(numTicksX)
          .tickFormat((date) => formatDate(date, 'dd MMM'))
      );

    const xAxis2 = (g, yScale) => {
      g.attr('class', 'x-axis2')
        .call(axisBottom(xScale).tickValues([]).tickSize(0))
        .select('.domain')
        .style('transform', `translateY(${yScale(0)}px)`);

      if (yScale(0) !== chartBottom) g.select('.domain').attr('opacity', 0.4);
      else g.select('.domain').attr('opacity', 0);
    };

    const yAxis = (g, yScale) =>
      g.attr('class', 'y-axis').call(
        axisRight(yScale)
          .ticks(4)
          .tickFormat((num) => formatNumber(num, 'short'))
          .tickPadding(4)
      );

    const uniformScaleMin = min(dates, (date) =>
      getStatistic(timeseries[date], chartType, 'active')
    );

    const uniformScaleMax = max(dates, (date) =>
      Math.max(
        getStatistic(timeseries[date], chartType, 'confirmed'),
        getStatistic(timeseries[date], chartType, 'recovered'),
        getStatistic(timeseries[date], chartType, 'deceased')
      )
    );

    const yScaleUniformLinear = scaleLinear()
      .clamp(true)
      .domain([uniformScaleMin, Math.max(1, yBufferTop * uniformScaleMax)])
      .nice(4)
      .range([chartBottom, margin.top]);

    const yScaleUniformLog = scaleLog()
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
        return scaleLog()
          .clamp(true)
          .domain([
            Math.max(
              1,
              min(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
            ),
            Math.max(
              10,
              yBufferTop *
                max(dates, (date) =>
                  getStatistic(timeseries[date], chartType, statistic)
                )
            ),
          ])
          .nice(4)
          .range([chartBottom, margin.top]);

      return scaleLinear()
        .clamp(true)
        .domain([
          yBufferBottom *
            Math.min(
              0,
              min(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
            ),
          Math.max(
            1,
            yBufferTop *
              max(dates, (date) =>
                getStatistic(timeseries[date], chartType, statistic)
              )
          ),
        ])
        .nice(4)
        .range([chartBottom, margin.top]);
    };

    function mousemove() {
      const xm = mouse(this)[0];
      const date = xScale.invert(xm);
      if (!isNaN(date)) {
        const bisectDate = bisector((date) => parseIndiaDate(date)).left;
        const index = bisectDate(dates, date, 1);
        const dateLeft = dates[index - 1];
        const dateRight = dates[index];
        setHighlightedDate(
          date - parseIndiaDate(dateLeft) < parseIndiaDate(dateRight) - date
            ? dateLeft
            : dateRight
        );
      }
    }

    function mouseout() {
      setHighlightedDate(dates[T - 1]);
    }

    /* Begin drawing charts */
    refs.current.forEach((ref, i) => {
      const svg = select(ref);
      const t = svg.transition().duration(D3_TRANSITION_DURATION);

      const statistic = TIMESERIES_STATISTICS[i];
      const yScale = generateYScale(statistic);
      const color = STATISTIC_CONFIGS[statistic].color;

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
            .attr('cy', chartBottom)
            .attr('cx', (date) => xScale(parseIndiaDate(date)))
            .attr('r', barWidth / 2)
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

        const linePath = line()
          .curve(curveMonotoneX)
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
                .attr('d', linePath)
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
                  const previous = select(this).attr('d');
                  const current = linePath(date);
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
              .attr('stroke-width', barWidth)
              .attr('x1', (date) => xScale(parseIndiaDate(date)))
              .attr('y1', chartBottom)
              .attr('x2', (date) => xScale(parseIndiaDate(date)))
              .attr('y2', chartBottom)
          )
          .transition(t)
          .attr('stroke-width', barWidth)
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
  }, [chartType, dimensions, getBarWidth, isUniform, isLog, timeseries, dates]);

  useEffect(() => {
    const barWidth = getBarWidth();
    refs.current.forEach((ref) => {
      const svg = select(ref);
      svg
        .selectAll('circle')
        .attr('r', (date) =>
          date === highlightedDate ? barWidth : barWidth / 2
        );
    });
  }, [highlightedDate, getBarWidth]);

  const getStatisticDelta = useCallback(
    (statistic) => {
      if (!highlightedDate) return;
      const currCount = getStatistic(
        timeseries?.[highlightedDate],
        chartType,
        statistic
      );
      const prevDate =
        dates[dates.findIndex((date) => date === highlightedDate) - 1];

      const prevCount = getStatistic(
        timeseries?.[prevDate],
        chartType,
        statistic
      );
      return currCount - prevCount;
    },
    [timeseries, dates, highlightedDate, chartType]
  );

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });
    return styles;
  }, []);

  return (
    <React.Fragment>
      <div className="Timeseries">
        {TIMESERIES_STATISTICS.map((statistic, index) => {
          const delta = getStatisticDelta(statistic, index);
          const statisticConfig = STATISTIC_CONFIGS[statistic];
          return (
            <div
              key={statistic}
              className={classnames('svg-parent fadeInUp', `is-${statistic}`)}
              ref={wrapperRef}
              style={trail[index]}
            >
              {highlightedDate && (
                <div className={classnames('stats', `is-${statistic}`)}>
                  <h5 className="title">
                    {t(capitalize(statisticConfig.displayName))}
                  </h5>
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
                        ),
                        statisticConfig.format !== 'short'
                          ? statisticConfig.format
                          : 'int',
                        statistic
                      )}
                    </h2>
                    <h6>{`${delta > 0 ? '+' : ''}${formatNumber(
                      delta,
                      statisticConfig.format !== 'short'
                        ? statisticConfig.format
                        : 'int',
                      statistic
                    )}`}</h6>
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
  } else if (!equal(currProps.isUniform, prevProps.isUniform)) {
    return false;
  } else if (!equal(currProps.isLog, prevProps.isLog)) {
    return false;
  } else if (
    !equal(
      currProps.regionHighlighted.stateCode,
      prevProps.regionHighlighted.stateCode
    )
  ) {
    return false;
  } else if (
    !equal(
      currProps.regionHighlighted.districtName,
      prevProps.regionHighlighted.districtName
    )
  ) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default React.memo(Timeseries, isEqual);
