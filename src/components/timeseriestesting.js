import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import {useResizeObserver} from '../utils/hooks';
import {formatNumber} from '../utils/commonfunctions';

function TimeSeriesTesting(props) {
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [moving, setMoving] = useState(false);

  const svgRef = useRef();

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      setTimeseries(props.timeseries);
    }
  }, [props.timeseries]);

  const graphData = useCallback(
    (timeseries) => {
      if (!dimensions) return;
      const width = dimensions.width;
      const height = dimensions.height;

      // Margins
      const margin = {top: 15, right: 35, bottom: 25, left: 25};
      const chartRight = width - margin.right;
      const chartBottom = height - margin.bottom;

      const T = timeseries.length;
      const yBuffer = 1.1;

      setDatapoint(timeseries[T - 1]);

      const svg = d3.select(svgRef.current);

      const dateMin = new Date(timeseries[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(timeseries[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .clamp(true)
        .domain([dateMin, dateMax])
        .range([margin.left, chartRight]);

      // Number of x-axis ticks
      const numTicksX = width < 480 ? 4 : 7;

      const xAxis = (g) =>
        g
          .attr('class', 'x-axis')
          .call(d3.axisBottom(xScale).ticks(numTicksX))
          .style('transform', `translateY(${chartBottom}px)`);

      const yAxis = (g, yScale) =>
        g
          .attr('class', 'y-axis')
          .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(5))
          .style('transform', `translateX(${chartRight}px)`);

      const color = '#201aa2';
      const type = 'totaltested';

      const yScale = d3
        .scaleLinear()
        .clamp(true)
        .domain([
          d3.min(timeseries, (d) => d[type]),
          Math.max(1, yBuffer * d3.max(timeseries, (d) => d[type])),
        ])
        .nice()
        .range([chartBottom, margin.top]);

      /* Focus dots */
      const focus = svg
        .selectAll('.focus')
        .data([timeseries[T - 1]], (d) => d.date)
        .join('circle')
        .attr('class', 'focus')
        .attr('fill', color)
        .attr('stroke', color)
        .attr('r', 4);

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const date = xScale.invert(xm);
        const bisectDate = d3.bisector((d) => d.date).left;
        let i = bisectDate(timeseries, date, 1);
        if (0 <= i && i < T) {
          if (date - timeseries[i - 1].date < timeseries[i].date - date) --i;
          setDatapoint(timeseries[i]);
          setMoving(true);
          const d = timeseries[i];
          focus.attr('cx', xScale(d.date)).attr('cy', yScale(d[type]));
        }
      }

      function mouseout() {
        setDatapoint(timeseries[T - 1]);
        setMoving(false);
        focus
          .attr('cx', xScale(timeseries[T - 1].date))
          .attr('cy', yScale(timeseries[T - 1][type]));
      }

      // Transition interval
      const t = svg.transition().duration(500);

      /* X axis */
      svg.select('.x-axis').transition(t).call(xAxis);
      /* Y axis */
      svg.select('.y-axis').transition(t).call(yAxis, yScale);

      /* Path dots */
      svg
        .selectAll('.dot')
        .data(timeseries, (d) => d.date)
        .join((enter) => enter.append('circle').attr('cy', chartBottom))
        .attr('class', 'dot')
        .attr('fill', color)
        .attr('stroke', color)
        .attr('r', 2)
        .transition(t)
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(d[type]));

      focus
        .transition(t)
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(d[type]));

      /* TOTAL TRENDS */
      const path = svg
        .selectAll('.trend')
        .data([[...timeseries].reverse()])
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
      path.transition(t).attr(
        'd',
        d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d[type]))
          .curve(d3.curveMonotoneX)
      );
      svg
        .on('mousemove', mousemove)
        .on('touchmove', mousemove)
        .on('mouseout', mouseout)
        .on('touchend', mouseout);
    },
    [dimensions]
  );

  useEffect(() => {
    if (timeseries.length > 1) {
      graphData(timeseries);
    }
  }, [timeseries, graphData]);

  const focusDate = moment(datapoint.date);
  let dateStr = focusDate.format('DD MMMM');
  dateStr += focusDate.isSame(moment().subtract(1, 'days'), 'day')
    ? ' Yesterday'
    : '';

  return (
    <div>
      <div
        className="timeseries-header fadeInUp"
        style={{animationDelay: '2.5s'}}
      >
        <h1>Testing Trends</h1>
      </div>

      <div className="TimeSeries fadeInUp" style={{animationDelay: '2.7s'}}>
        <div className="svg-parent is-purple" ref={wrapperRef}>
          <div className="stats is-purple">
            <h5 className={`${!moving ? 'title' : ''}`}>Tested</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint.totaltested)}</h2>
            </div>
          </div>
          <svg ref={svgRef} preserveAspectRatio="xMidYMid meet">
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimeSeriesTesting);
