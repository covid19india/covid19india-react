import {
  D3_TRANSITION_DURATION,
  PRIMARY_STATISTICS,
  STATISTIC_CONFIGS,
} from '../constants';
import {
  capitalize,
  formatNumber,
  formatDate,
  getStatistic,
  parseIndiaDate,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {bisector, extent} from 'd3-array';
import {axisBottom, axisRight} from 'd3-axis';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear, scaleLog} from 'd3-scale';
import {select, pointer} from 'd3-selection';
import {area, line, curveLinear, curveMonotoneX, curveStep} from 'd3-shape';
import 'd3-transition';
import {differenceInDays} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMeasure} from 'react-use';

// Chart margins
const margin = {top: 15, right: 35, bottom: 25, left: 25};
// Buffer space along y-axis
const yScaleShrinkFactor = 0.7;
const numTicksX = (width) => (width < 480 ? 4 : 6);

function Timeseries({
  statistics,
  timeseries,
  dates,
  endDate,
  chartType,
  isUniform,
  isLog,
  isMovingAverage,
  noRegionHighlightedDistrictData,
}) {
  const {t} = useTranslation();
  const refs = useRef([]);
  const [wrapperRef, {width, height}] = useMeasure();

  const [highlightedDate, setHighlightedDate] = useState(
    dates[dates.length - 1]
  );
  useEffect(() => {
    setHighlightedDate(dates[dates.length - 1]);
  }, [dates]);

  const getTimeseriesStatistic = useCallback(
    (date, statistic, movingAverage = isMovingAverage) => {
      return getStatistic(timeseries?.[date], chartType, statistic, {
        movingAverage,
      });
    },
    [chartType, isMovingAverage, timeseries]
  );

  const condenseChart = useMemo(() => {
    const T = dates.length;
    const days = differenceInDays(
      parseIndiaDate(dates[T - 1]),
      parseIndiaDate(dates[0])
    );
    // Chart extremes
    const chartRight = width - margin.right;
    // Bar widths
    const axisWidth = Math.max(0, chartRight - margin.left) / (1.25 * days);
    return axisWidth < 4;
  }, [width, dates]);

  const xScale = useMemo(() => {
    const T = dates.length;
    const chartRight = width - margin.right;

    return scaleTime()
      .clamp(true)
      .domain([
        parseIndiaDate(dates[0] || endDate),
        parseIndiaDate(dates[T - 1] || endDate),
      ])
      .range([margin.left, chartRight]);
  }, [width, endDate, dates]);

  const yScales = useMemo(() => {
    const chartBottom = height - margin.bottom;

    const addScaleBuffer = (scale, log = false) => {
      const domain = scale.domain();
      if (log) {
        scale.domain([
          domain[0],
          domain[0] * Math.pow(domain[1] / domain[0], 1 / yScaleShrinkFactor),
        ]);
      } else {
        scale.domain([
          domain[0],
          domain[0] + (domain[1] - domain[0]) / yScaleShrinkFactor,
        ]);
      }
      return scale;
    };

    const [uniformScaleMin, uniformScaleMax] = extent(
      dates.reduce((res, date) => {
        res.push(
          ...PRIMARY_STATISTICS.map((statistic) =>
            getTimeseriesStatistic(date, statistic)
          )
        );
        return res;
      }, [])
    );

    const yScaleUniformLinear = addScaleBuffer(
      scaleLinear()
        .clamp(true)
        .domain([Math.min(0, uniformScaleMin), Math.max(1, uniformScaleMax)])
        .range([chartBottom, margin.top])
        .nice(4)
    );

    const yScaleUniformLog = addScaleBuffer(
      scaleLog()
        .clamp(true)
        .domain([1, Math.max(10, uniformScaleMax)])
        .range([chartBottom, margin.top])
        .nice(4),
      true
    );

    return statistics.map((statistic) => {
      if (isUniform) {
        if (
          chartType === 'total' &&
          isLog &&
          PRIMARY_STATISTICS.includes(statistic)
        ) {
          return yScaleUniformLog;
        } else if (PRIMARY_STATISTICS.includes(statistic)) {
          return yScaleUniformLinear;
        }
      }

      const [scaleMin, scaleMax] = extent(dates, (date) =>
        getTimeseriesStatistic(date, statistic)
      );

      if (chartType === 'total' && isLog) {
        return addScaleBuffer(
          scaleLog()
            .clamp(true)
            .domain([1, Math.max(10, scaleMax)])
            .range([chartBottom, margin.top])
            .nice(4),
          true
        );
      } else {
        return addScaleBuffer(
          scaleLinear()
            .clamp(true)
            .domain([
              Math.min(0, scaleMin),
              STATISTIC_CONFIGS[statistic].format === '%'
                ? Math.min(100, Math.max(1, scaleMax))
                : Math.max(1, scaleMax),
            ])
            .range([chartBottom, margin.top])
            .nice(4)
        );
      }
    });
  }, [
    height,
    chartType,
    isUniform,
    isLog,
    statistics,
    dates,
    getTimeseriesStatistic,
  ]);

  useEffect(() => {
    if (!width || !height) return;

    const T = dates.length;
    // Chart extremes
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const isDiscrete = chartType === 'delta' && !isMovingAverage;

    const xAxis = (g) =>
      g
        .attr('class', 'x-axis')
        .call(axisBottom(xScale).ticks(numTicksX(width)));

    const xAxis2 = (g, yScale) => {
      g.attr('class', 'x-axis2')
        .call(axisBottom(xScale).tickValues([]).tickSize(0))
        .select('.domain')
        .style('transform', `translate3d(0, ${yScale(0)}px, 0)`);

      if (yScale(0) !== chartBottom) g.select('.domain').attr('opacity', 0.4);
      else g.select('.domain').attr('opacity', 0);
    };

    const yAxis = (g, yScale, format) =>
      g.attr('class', 'y-axis').call(
        axisRight(yScale)
          .ticks(4)
          .tickFormat((num) => formatNumber(num, format))
          .tickPadding(4)
      );

    function mousemove(event) {
      const xm = pointer(event)[0];
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

    function mouseout(event) {
      setHighlightedDate(dates[T - 1]);
    }

    /* Begin drawing charts */
    statistics.forEach((statistic, i) => {
      const ref = refs.current[i];
      const svg = select(ref);
      const t = svg.transition().duration(D3_TRANSITION_DURATION);

      const yScale = yScales[i];
      const statisticConfig = STATISTIC_CONFIGS[statistic];
      const format =
        STATISTIC_CONFIGS[statistic].format === '%' ? '%' : 'short';
      const isNonLinear = !!STATISTIC_CONFIGS[statistic]?.nonLinear;

      /* X axis */
      svg
        .select('.x-axis')
        .style('transform', `translate3d(0, ${chartBottom}px, 0)`)
        .transition(t)
        .call(xAxis);

      svg.select('.x-axis2').transition(t).call(xAxis2, yScale);

      /* Y axis */
      svg
        .select('.y-axis')
        .style('transform', `translate3d(${chartRight}px, 0, 0)`)
        .transition(t)
        .call(yAxis, yScale, format);

      /* Path dots */
      svg
        .selectAll('circle.normal')
        .data(condenseChart ? [] : dates, (date) => date)
        .join((enter) =>
          enter
            .append('circle')
            .attr('class', 'normal')
            .attr('fill', statisticConfig?.color)
            .attr('stroke', statisticConfig?.color)
            .attr('cx', (date) => xScale(parseIndiaDate(date)))
            .attr('cy', (date) =>
              yScale(isDiscrete ? 0 : getTimeseriesStatistic(date, statistic))
            )
            .attr('r', 2)
        )
        .transition(t)
        .attr('cx', (date) => xScale(parseIndiaDate(date)))
        .attr('cy', (date) => yScale(getTimeseriesStatistic(date, statistic)));

      const areaPath = (dates, allZero = false) =>
        area()
          .curve(curveStep)
          .x((date) => xScale(parseIndiaDate(date)))
          .y0(yScale(0))
          .y1(
            allZero
              ? yScale(0)
              : (date) => yScale(getTimeseriesStatistic(date, statistic, false))
          )(dates);

      svg
        .selectAll('.trend-area')
        .data(
          T && chartType === 'delta' && !isNonLinear && condenseChart
            ? [dates]
            : []
        )
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'trend-area')
              .call((enter) =>
                enter
                  .attr('d', (dates) => areaPath(dates, true))
                  .transition(t)
                  .attr('d', areaPath)
              ),
          (update) =>
            update.call((update) =>
              update.transition(t).attrTween('d', function (dates) {
                const previous = select(this).attr('d');
                const current = areaPath(dates);
                return interpolatePath(previous, current);
              })
            ),
          (exit) =>
            exit.call((exit) =>
              exit
                .transition(t)
                .attr('d', (dates) => areaPath(dates, true))
                .remove()
            )
        )
        .transition(t)
        .attr('opacity', isMovingAverage ? 0.3 : 1);

      svg
        .selectAll('.stem')
        .data(
          T && chartType === 'delta' && !isNonLinear && !condenseChart
            ? dates
            : [],
          (date) => date
        )
        .join(
          (enter) =>
            enter
              .append('line')
              .attr('class', 'stem')
              .attr('stroke-width', 4)
              .attr('x1', (date) => xScale(parseIndiaDate(date)))
              .attr('y1', yScale(0))
              .attr('x2', (date) => xScale(parseIndiaDate(date)))
              .attr('y2', yScale(0)),
          (update) => update,
          (exit) =>
            exit.call((exit) =>
              exit
                .transition(t)
                .attr('x1', (date) => xScale(parseIndiaDate(date)))
                .attr('x2', (date) => xScale(parseIndiaDate(date)))
                .attr('y1', yScale(0))
                .attr('y2', yScale(0))
                .remove()
            )
        )
        .transition(t)
        .attr('x1', (date) => xScale(parseIndiaDate(date)))
        .attr('y1', yScale(0))
        .attr('x2', (date) => xScale(parseIndiaDate(date)))
        .attr('y2', (date) =>
          yScale(getTimeseriesStatistic(date, statistic, false))
        )
        .attr('opacity', isMovingAverage ? 0.2 : 1);

      const linePath = (
        movingAverage = isMovingAverage,
        curve = curveMonotoneX
      ) =>
        line()
          .curve(curve)
          .x((date) => xScale(parseIndiaDate(date)))
          .y((date) =>
            yScale(getTimeseriesStatistic(date, statistic, movingAverage))
          );

      svg
        .select('.trend')
        .selectAll('path')
        .data(
          T && (chartType === 'total' || isNonLinear || isMovingAverage)
            ? [dates]
            : []
        )
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'trend')
              .attr('fill', 'none')
              .attr('stroke-width', 4)
              .attr('d', linePath())
              .call((enter) => enter.transition(t).attr('opacity', 1)),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .attrTween('d', function (date) {
                  const previous = select(this).attr('d');
                  const current = linePath()(date);
                  return interpolatePath(previous, current);
                })
                .attr('opacity', 1)
            ),
          (exit) =>
            exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
        )
        .attr('stroke', statisticConfig?.color + (condenseChart ? '99' : '50'));

      svg
        .select('.trend-background')
        .selectAll('path')
        .data(
          T && chartType === 'delta' && isNonLinear && isMovingAverage
            ? [dates]
            : []
        )
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'trend-background')
              .attr('fill', 'none')
              .attr('stroke-width', 4)
              .attr('d', linePath(false, curveLinear))
              .call((enter) => enter.transition(t).attr('opacity', 0.2)),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .attrTween('d', function (date) {
                  const previous = select(this).attr('d');
                  const current = linePath(false, curveLinear)(date);
                  return interpolatePath(previous, current);
                })
                .attr('opacity', 0.2)
            ),
          (exit) =>
            exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
        )
        .attr('stroke', statisticConfig?.color + (condenseChart ? '99' : '50'));

      svg.selectAll('*').attr('pointer-events', 'none');
      svg
        .on('mousemove', mousemove)
        .on('touchmove', (event) => mousemove(event.touches[0]))
        .on('mouseout touchend', mouseout);
    });
  }, [
    width,
    height,
    chartType,
    isMovingAverage,
    condenseChart,
    xScale,
    yScales,
    statistics,
    getTimeseriesStatistic,
    dates,
  ]);

  useEffect(() => {
    statistics.forEach((statistic, i) => {
      const ref = refs.current[i];
      const svg = select(ref);
      const statisticConfig = STATISTIC_CONFIGS[statistic];
      const yScale = yScales[i];
      const t = svg.transition().duration(D3_TRANSITION_DURATION);

      svg
        .selectAll('circle.condensed')
        .data(
          condenseChart && highlightedDate ? [highlightedDate] : [],
          (date) => date
        )
        .join((enter) =>
          enter
            .append('circle')
            .attr('class', 'condensed')
            .attr('fill', statisticConfig?.color)
            .attr('stroke', statisticConfig?.color)
            .attr('pointer-events', 'none')
            .attr('cx', (date) => xScale(parseIndiaDate(date)))
            .attr('cy', (date) =>
              yScale(getTimeseriesStatistic(date, statistic))
            )
            .attr('r', 4)
        )
        .transition(t)
        .attr('cx', (date) => xScale(parseIndiaDate(date)))
        .attr('cy', (date) => yScale(getTimeseriesStatistic(date, statistic)));

      if (!condenseChart) {
        svg
          .selectAll('circle')
          .attr('r', (date) => (date === highlightedDate ? 4 : 2));
      }
    });
  }, [
    condenseChart,
    highlightedDate,
    xScale,
    yScales,
    statistics,
    getTimeseriesStatistic,
  ]);

  const getTimeseriesStatisticDelta = useCallback(
    (statistic) => {
      if (!highlightedDate) return;

      const currCount = getTimeseriesStatistic(highlightedDate, statistic);
      if (STATISTIC_CONFIGS[statistic]?.hideZero && currCount === 0) return;

      const prevDate =
        dates[dates.findIndex((date) => date === highlightedDate) - 1];

      const prevCount = getTimeseriesStatistic(prevDate, statistic);
      return currCount - prevCount;
    },
    [dates, highlightedDate, getTimeseriesStatistic]
  );

  const trail = useMemo(
    () =>
      statistics.map((statistic, index) => ({
        animationDelay: `${index * 250}ms`,
      })),
    [statistics]
  );

  return (
    <div className="Timeseries">
      {statistics.map((statistic, index) => {
        const total = getTimeseriesStatistic(highlightedDate, statistic);
        const delta = getTimeseriesStatisticDelta(statistic, index);
        const statisticConfig = STATISTIC_CONFIGS[statistic];
        return (
          <div
            key={statistic}
            className={classnames('svg-parent fadeInUp', `is-${statistic}`)}
            style={trail[index]}
            ref={index === 0 ? wrapperRef : null}
          >
            {highlightedDate && (
              <div className={classnames('stats', `is-${statistic}`)}>
                <h5 className="title">
                  {t(capitalize(statisticConfig.displayName))}
                </h5>
                <h5>{formatDate(highlightedDate, 'dd MMMM')}</h5>
                <div className="stats-bottom">
                  <h2>
                    {!noRegionHighlightedDistrictData ||
                    !statisticConfig?.hasPrimary
                      ? formatNumber(
                          total,
                          statisticConfig.format !== 'short'
                            ? statisticConfig.format
                            : 'long',
                          statistic
                        )
                      : '-'}
                  </h2>
                  <h6>
                    {!noRegionHighlightedDistrictData ||
                    !statisticConfig?.hasPrimary
                      ? `${delta > 0 ? '+' : ''}${formatNumber(
                          delta,
                          statisticConfig.format !== 'short'
                            ? statisticConfig.format
                            : 'long',
                          statistic
                        )}`
                      : ''}
                  </h6>
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
              <g className="trend-background" />
              <g className="trend" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.chartType, prevProps.chartType)) {
    return false;
  } else if (!equal(currProps.isUniform, prevProps.isUniform)) {
    return false;
  } else if (!equal(currProps.isLog, prevProps.isLog)) {
    return false;
  } else if (!equal(currProps.isMovingAverage, prevProps.isMovingAverage)) {
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
  } else if (
    !equal(
      currProps.noRegionHighlightedDistrictData,
      prevProps.noRegionHighlightedDistrictData
    )
  ) {
    return false;
  } else if (!equal(currProps.endDate, prevProps.endDate)) {
    return false;
  } else if (!equal(currProps.statistics, prevProps.statistics)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(Timeseries, isEqual);
