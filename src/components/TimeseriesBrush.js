import {
  BRUSH_STATISTICS,
  D3_TRANSITION_DURATION,
  STATISTIC_CONFIGS,
} from '../constants';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {getStatistic, parseIndiaDate} from '../utils/commonFunctions';

import classnames from 'classnames';
import {max} from 'd3-array';
import {axisBottom} from 'd3-axis';
import {brushX, brushSelection} from 'd3-brush';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select, pointers} from 'd3-selection';
import {area, curveMonotoneX, stack} from 'd3-shape';
import 'd3-transition';
import {differenceInDays, formatISO} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useCallback, useMemo, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

// Chart margins
const margin = {top: 0, right: 35, bottom: 20, left: 25};
const yBufferTop = 1.2;
const numTicksX = (width) => (width < 480 ? 4 : 6);

function TimeseriesBrush({
  timeseries,
  dates,
  brushDomain,
  endDate,
  setBrushEnd,
  setLookback,
}) {
  const chartRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // Dimensions
  const {width, height} = dimensions ||
    wrapperRef.current?.getBoundingClientRect() || {
      width: margin.left + margin.right,
      height: margin.bottom + margin.top,
    };

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
    // Chart extremes
    const chartBottom = height - margin.bottom;

    const xAxis = (g) =>
      g
        .attr('class', 'x-axis')
        .call(axisBottom(xScale).ticks(numTicksX(width)));

    const timeseriesStacked = stack()
      .keys(BRUSH_STATISTICS)
      .value((date, statistic) =>
        Math.max(0, getStatistic(timeseries[date], 'total', statistic))
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
      .style('transform', `translateY(${chartBottom}px)`)
      .transition(t)
      .call(xAxis);

    const areaPath = area()
      .curve(curveMonotoneX)
      .x((d) => xScale(parseIndiaDate(d.data)))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    svg
      .selectAll('.trend-area')
      .data(timeseriesStacked)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', 'trend-area')
            .attr('fill', ({key}) => STATISTIC_CONFIGS[key].color + '99')
            .attr('stroke', 'none')
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

  const defaultSelection = brushDomain.map((date) =>
    xScale(parseIndiaDate(date))
  );

  const brushed = useCallback(
    ({sourceEvent, selection}) => {
      if (!sourceEvent) return;
      // if (!selection) {
      //   const [[cx]] = pointers(event);
      //   selection = [cx, cx];
      //   select(this).call(brush.move, [cx, cx]);
      // }
      const [brushStartDate, brushEndDate] = selection.map(xScale.invert);

      ReactDOM.unstable_batchedUpdates(() => {
        setBrushEnd(formatISO(brushEndDate, {representation: 'date'}));
        setLookback(differenceInDays(brushEndDate, brushStartDate));
      });
    },
    [xScale, setBrushEnd, setLookback]
  );

  useEffect(() => {
    const svg = select(chartRef.current);
    // Chart extremes
    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    function beforebrushstarted(event) {
      const selection = brushSelection(this.parentNode);
      if (!selection) return;

      const dx = selection[1] - selection[0];
      const [[cx]] = pointers(event);
      const [x0, x1] = [cx - dx / 2, cx + dx / 2];
      const [X0, X1] = xScale.range();
      select(this.parentNode).call(
        brush.move,
        x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
      );
    }

    function brushended({sourceEvent, selection}) {
      if (!sourceEvent || !selection) return;
      const domain = selection
        .map(xScale.invert)
        .map((date) => formatISO(date, {representation: 'date'}));

      select(this)
        .call(
          brush.move,
          domain.map((date) => xScale(parseIndiaDate(date)))
        )
        .call((g) => g.select('.overlay').attr('cursor', 'pointer'));
    }

    const brush = brushX()
      .extent([
        [margin.left, margin.top],
        [chartRight, chartBottom],
      ])
      .on('start brush', brushed)
      .on('end', brushended);

    svg
      .select('.brush')
      .call(brush)
      .call(brush.move, defaultSelection)
      .call((g) =>
        g
          .select('.overlay')
          .attr('cursor', 'pointer')
          .datum({type: 'selection'})
          .on('mousedown touchstart', beforebrushstarted)
      );
  }, [width, height, xScale, defaultSelection, brushed]);

  return (
    <div className="Timeseries">
      <div
        className={classnames('svg-parent fadeInUp is-brush')}
        ref={wrapperRef}
      >
        <svg ref={chartRef} preserveAspectRatio="xMidYMid meet">
          <g className="brush" />
          <g className="x-axis" />
        </svg>
      </div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.brushDomain, prevProps.brushDomain)) {
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
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(TimeseriesBrush, isEqual);
