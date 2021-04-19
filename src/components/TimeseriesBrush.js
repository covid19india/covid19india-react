import {
  BRUSH_STATISTICS,
  D3_TRANSITION_DURATION,
  STATISTIC_CONFIGS,
} from '../constants';
import {getStatistic, parseIndiaDate} from '../utils/commonFunctions';

import classnames from 'classnames';
import {min, max} from 'd3-array';
import {axisBottom} from 'd3-axis';
import {brushX, brushSelection} from 'd3-brush';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select, pointers} from 'd3-selection';
import {area, curveMonotoneX, stack} from 'd3-shape';
import 'd3-transition';
import {addDays, differenceInDays, formatISO} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useCallback, useMemo, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import {useMeasure} from 'react-use';

// Chart margins
const margin = {top: 0, right: 35, bottom: 20, left: 25};
const yBufferTop = 1.2;
const numTicksX = (width) => (width < 480 ? 4 : 6);
const brushWheelDelta = 10;

function TimeseriesBrush({
  timeseries,
  dates,
  currentBrushSelection,
  endDate,
  lookback,
  setBrushSelectionEnd,
  setLookback,
  animationIndex,
}) {
  const chartRef = useRef();
  const [wrapperRef, {width, height}] = useMeasure();

  const endDateMin =
    lookback !== null
      ? min([
          formatISO(addDays(parseIndiaDate(dates[0]), lookback), {
            representation: 'date',
          }),
          endDate,
        ])
      : endDate;

  const xScale = useMemo(() => {
    const T = dates.length;

    // Chart extremes
    const chartRight = width - margin.right;

    return scaleTime()
      .clamp(true)
      .domain([
        parseIndiaDate(dates[0] || endDate),
        parseIndiaDate(dates[T - 1] || endDate),
      ])
      .range([margin.left, chartRight]);
  }, [width, endDate, dates]);

  useEffect(() => {
    if (!width || !height) return;

    // Chart extremes
    const chartBottom = height - margin.bottom;

    const xAxis = (g) =>
      g
        .attr('class', 'x-axis')
        .call(axisBottom(xScale).ticks(numTicksX(width)));

    // Switched to daily confirmed instead of cumulative ARD
    const timeseriesStacked = stack()
      .keys(BRUSH_STATISTICS)
      .value((date, statistic) =>
        Math.max(0, getStatistic(timeseries[date], 'delta', statistic))
      )(dates);

    const yScale = scaleLinear()
      .clamp(true)
      .domain([
        0,
        max(
          timeseriesStacked[timeseriesStacked.length - 1],
          ([, y1]) => yBufferTop * y1
        ),
      ])
      .range([chartBottom, margin.top]);

    const svg = select(chartRef.current);

    const t = svg.transition().duration(D3_TRANSITION_DURATION);

    svg
      .select('.x-axis')
      .attr('pointer-events', 'none')
      .style('transform', `translate3d(0, ${chartBottom}px, 0)`)
      .transition(t)
      .call(xAxis);

    const areaPath = area()
      .curve(curveMonotoneX)
      .x((d) => xScale(parseIndiaDate(d.data)))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    svg
      .select('.trend-areas')
      .selectAll('.trend-area')
      .data(timeseriesStacked)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', 'trend-area')
            .attr('fill', ({key}) => STATISTIC_CONFIGS[key].color)
            .attr('fill-opacity', 0.4)
            .attr('stroke', ({key}) => STATISTIC_CONFIGS[key].color)
            .attr('d', areaPath)
            .attr('pointer-events', 'none'),
        (update) =>
          update
            .transition(t)
            .attrTween('d', function (date) {
              const previous = select(this).attr('d');
              const current = areaPath(date);
              return interpolatePath(previous, current);
            })
            .selection()
      );
  }, [dates, width, height, xScale, timeseries]);

  const defaultSelection = currentBrushSelection.map((date) =>
    xScale(parseIndiaDate(date))
  );

  const brush = useMemo(() => {
    if (!width || !height) return;
    // Chart extremes
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const brush = brushX()
      .extent([
        [margin.left, margin.top],
        [chartRight, chartBottom],
      ])
      .handleSize(20);
    return brush;
  }, [width, height]);

  const brushed = useCallback(
    ({sourceEvent, selection}) => {
      if (!sourceEvent) return;
      const [brushStartDate, brushEndDate] = selection.map(xScale.invert);

      ReactDOM.unstable_batchedUpdates(() => {
        setBrushSelectionEnd(formatISO(brushEndDate, {representation: 'date'}));
        setLookback(differenceInDays(brushEndDate, brushStartDate));
      });
    },
    [xScale, setBrushSelectionEnd, setLookback]
  );

  const beforebrushstarted = useCallback(
    (event) => {
      const svg = select(chartRef.current);
      const selection = brushSelection(svg.select('.brush').node());

      if (!selection) return;

      const dx = selection[1] - selection[0];
      const [[cx]] = pointers(event);
      const [x0, x1] = [cx - dx / 2, cx + dx / 2];
      const [X0, X1] = xScale.range();
      svg
        .select('.brush')
        .call(
          brush.move,
          x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
        );
    },
    [brush, xScale]
  );

  const brushended = useCallback(
    ({sourceEvent, selection}) => {
      if (!sourceEvent || !selection) return;
      const domain = selection
        .map(xScale.invert)
        .map((date) => formatISO(date, {representation: 'date'}));

      const svg = select(chartRef.current);
      svg
        .select('.brush')
        .call(
          brush.move,
          domain.map((date) => xScale(parseIndiaDate(date)))
        )
        .call((g) => g.select('.overlay').attr('cursor', 'pointer'));
    },
    [brush, xScale]
  );

  useEffect(() => {
    if (!brush) return;
    brush.on('start brush', brushed).on('end', brushended);
    const svg = select(chartRef.current);
    svg
      .select('.brush')
      .call(brush)
      .call((g) =>
        g
          .select('.overlay')
          .attr('cursor', 'pointer')
          .datum({type: 'selection'})
          .on('mousedown touchstart', beforebrushstarted)
      );
  }, [brush, brushed, brushended, beforebrushstarted]);

  useEffect(() => {
    if (!brush) return;
    const svg = select(chartRef.current);
    svg.select('.brush').call(brush.move, defaultSelection);
  }, [brush, defaultSelection]);

  const handleWheel = (event) => {
    if (event.deltaX) {
      setBrushSelectionEnd(
        max([
          endDateMin,
          dates[
            Math.max(
              0,
              Math.min(
                dates.length - 1,
                dates.indexOf(currentBrushSelection[1]) +
                  Math.sign(event.deltaX) * brushWheelDelta
              )
            )
          ],
        ])
      );
    }
  };

  return (
    <div className="Timeseries">
      <div
        className={classnames('svg-parent is-brush fadeInUp')}
        ref={wrapperRef}
        onWheel={handleWheel}
        style={{animationDelay: `${animationIndex * 250}ms`}}
      >
        <svg ref={chartRef} preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="clipPath">
              <rect
                x={0}
                y={`${margin.top}`}
                width={width}
                height={`${Math.max(0, height - margin.bottom)}`}
              />
            </clipPath>
            <mask id="mask">
              <rect
                x={0}
                y={`${margin.top}`}
                width={width}
                height={`${Math.max(0, height - margin.bottom)}`}
                fill="hsl(0, 0%, 40%)"
              />
              <use href="#selection" fill="white" />
            </mask>
          </defs>

          <g className="brush" clipPath="url(#clipPath)">
            <g mask="url(#mask)">
              <rect className="overlay" />
              <g className="trend-areas" />
              <rect className="selection" id="selection" />
            </g>
          </g>
          <g className="x-axis" />
        </svg>
      </div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (
    !equal(currProps.currentBrushSelection, prevProps.currentBrushSelection)
  ) {
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
  } else if (!equal(currProps.endDate, prevProps.endDate)) {
    return false;
  } else if (!equal(currProps.lookback, prevProps.lookback)) {
    return false;
  } else if (!equal(currProps.animationIndex, prevProps.animationIndex)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(TimeseriesBrush, isEqual);
