import {testedToolTip} from './tooltips';

import {sliceTimeseriesFromEnd, formatNumber} from '../utils/commonfunctions';
import {useResizeObserver} from '../utils/hooks';

import * as d3 from 'd3';
import moment from 'moment';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as Icon from 'react-feather';

function TimeSeries(props) {
  const [lastDaysCount, setLastDaysCount] = useState(
    window.innerWidth > 512 ? Infinity : 30
  );
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [chartType, setChartType] = useState(props.type);
  const [moving, setMoving] = useState(false);

  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const svgRef3 = useRef();
  const svgRef4 = useRef();
  const svgRef5 = useRef();

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const transformTimeSeries = useCallback(
    (timeseries) => {
      if (timeseries.length > 1) {
        const slicedTimeseries = sliceTimeseriesFromEnd(
          timeseries,
          lastDaysCount
        );
        setIndex(slicedTimeseries.length - 1);
        setTimeseries(slicedTimeseries);
      }
    },
    [lastDaysCount]
  );

  useEffect(() => {
    transformTimeSeries(props.timeseries);
  }, [lastDaysCount, transformTimeSeries, props.timeseries]);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  useEffect(() => {
    setLogMode(props.logMode);
  }, [props.logMode]);

  useEffect(() => {
    setChartType(props.type);
  }, [props.type]);

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
      const yBufferTop = 1.2;
      const yBufferBottom = 1.1;

      setDatapoint(timeseries[T - 1]);
      setIndex(T - 1);

      const svg1 = d3.select(svgRef1.current);
      const svg2 = d3.select(svgRef2.current);
      const svg3 = d3.select(svgRef3.current);
      const svg4 = d3.select(svgRef4.current);
      const svg5 = d3.select(svgRef5.current);

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
        g.attr('class', 'x-axis').call(d3.axisBottom(xScale).ticks(numTicksX));

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

      // Arrays of objects
      const plotTotal = chartType === 1;
      const dataTypesTotal = [
        'totalconfirmed',
        'totalactive',
        'totalrecovered',
        'totaldeceased',
        'totaltested',
      ];
      const dataTypesDaily = [
        'dailyconfirmed',
        'dailyactive',
        'dailyrecovered',
        'dailydeceased',
      ];

      const colors = ['#ff073a', '#007bff', '#28a745', '#6c757d', '#201aa2'];

      const svgArray = [svg1, svg2, svg3, svg4];
      if (plotTotal) svgArray.push(svg5);

      let yScales;
      if (plotTotal) {
        const uniformScaleMin = d3.min(timeseries, (d) =>
          Math.min(d.totalactive, d.totalrecovered, d.totaldeceased)
        );
        const uniformScaleMax = d3.max(timeseries, (d) => d.totalconfirmed);
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
            Math.max(1, yBufferTop * uniformScaleMax),
          ])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesTotal.map((type) => {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([
              d3.min(timeseries, (d) => d[type]),
              Math.max(1, yBufferTop * d3.max(timeseries, (d) => d[type])),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          const yScaleLog = d3
            .scaleLog()
            .clamp(true)
            .domain([
              Math.max(
                1,
                d3.min(timeseries, (d) => d[type])
              ),
              Math.max(1, yBufferTop * d3.max(timeseries, (d) => d[type])),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          if (mode && type !== 'totaltested')
            return logMode ? yScaleUniformLog : yScaleUniformLinear;
          else return logMode ? yScaleLog : yScaleLinear;
        });
      } else {
        const yScaleDailyUniform = d3
          .scaleLinear()
          .clamp(true)
          .domain([
            yBufferBottom *
              Math.min(
                0,
                d3.min(timeseries, (d) => d.dailyactive)
              ),
            Math.max(
              1,
              yBufferTop *
                d3.max(timeseries, (d) =>
                  Math.max(d.dailyconfirmed, d.dailyrecovered, d.dailydeceased)
                )
            ),
          ])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesDaily.map((type) => {
          if (mode) return yScaleDailyUniform;
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([
              yBufferBottom *
                Math.min(
                  0,
                  d3.min(timeseries, (d) => d[type])
                ),
              Math.max(1, yBufferTop * d3.max(timeseries, (d) => d[type])),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          return yScaleLinear;
        });
      }

      /* Focus dots */
      const focus = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus')
          .data([timeseries[T - 1]], (d) => d.date)
          .join((enter) =>
            enter.append('circle').attr('cx', (d) => xScale(d.date))
          )
          .attr('class', 'focus')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 4);
      });

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const date = xScale.invert(xm);
        const bisectDate = d3.bisector((d) => d.date).left;
        let i = bisectDate(timeseries, date, 1);
        if (0 <= i && i < T) {
          if (date - timeseries[i - 1].date < timeseries[i].date - date) --i;
          setDatapoint(timeseries[i]);
          setIndex(i);
          setMoving(true);
          const d = timeseries[i];
          focus.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j] : dataTypesDaily[j];
            if (!isNaN(d[type]))
              f.attr('cx', xScale(d.date))
                .attr('cy', yScale(d[type]))
                .attr('opacity', 1);
            else f.attr('opacity', 0);
          });
        }
      }

      function mouseout() {
        setDatapoint(timeseries[T - 1]);
        setIndex(T - 1);
        setMoving(false);
        focus.forEach((f, j) => {
          const yScale = yScales[j];
          const type = plotTotal ? dataTypesTotal[j] : dataTypesDaily[j];
          if (!isNaN(timeseries[T - 1][type]))
            f.attr('cx', xScale(timeseries[T - 1].date))
              .attr('cy', yScale(timeseries[T - 1][type]))
              .attr('opacity', 1);
          else f.attr('opacity', 0);
        });
      }

      /* Begin drawing charts */
      svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i];
        const typeDaily = dataTypesDaily[i];
        const type = plotTotal ? typeTotal : typeDaily;

        const filteredTimeseries = timeseries.filter((d) => !isNaN(d[type]));
        const color = colors[i];
        const yScale = yScales[i];

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
          .selectAll('.dot')
          .data(filteredTimeseries, (d) => d.date)
          .join((enter) =>
            enter
              .append('circle')
              .attr('cx', (d) => xScale(d.date))
              .attr('cy', chartBottom)
          )
          .attr('class', 'dot')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', 2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (!isNaN(timeseries[T - 1][type]))
          focus[i]
            .transition(t)
            .attr('cx', (d) => xScale(d.date))
            .attr('cy', (d) => yScale(d[type]))
            .attr('opacity', 1);
        else focus[i].transition(t).attr('opacity', 0);

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem').remove();
          const path = svg
            .selectAll('.trend')
            .data([[...filteredTimeseries].reverse()])
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
            path.attr(
              'd',
              () => path.attr('d') + `L${p.x},${p.y}`.repeat(3 * T)
            );
          }
          path
            .transition(t)
            .attr('opacity', plotTotal ? 1 : 0)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d[typeTotal]))
                .curve(d3.curveMonotoneX)
            );
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          /* DAILY TRENDS */
          svg.selectAll('.trend').remove();
          svg
            .selectAll('.stem')
            .data(timeseries, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y1', chartBottom)
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .transition(t)
            .attr('y1', yScale(0))
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[typeDaily]));
        }

        svg
          .on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);
      });
    },
    [dimensions, chartType, logMode, mode]
  );

  useEffect(() => {
    if (timeseries.length > 1) {
      graphData(timeseries);
    }
  }, [timeseries, graphData]);

  const focusDate = moment(datapoint.date).utcOffset('+05:30');
  const dateStr = focusDate.format('DD MMMM');

  const chartKey1 = chartType === 1 ? 'totalconfirmed' : 'dailyconfirmed';
  const chartKey2 = chartType === 1 ? 'totalactive' : 'dailyactive';
  const chartKey3 = chartType === 1 ? 'totalrecovered' : 'dailyrecovered';
  const chartKey4 = chartType === 1 ? 'totaldeceased' : 'dailydeceased';

  // Function for calculate increased/decreased count for each type of data
  const currentStatusCount = (chartType) => {
    if (timeseries.length <= 0 || index <= 0 || index >= timeseries.length)
      return '';
    const currentDiff =
      timeseries[index][chartType] - timeseries[index - 1][chartType];
    const formatedDiff = formatNumber(currentDiff);
    return currentDiff >= 0 ? `+${formatedDiff}` : formatedDiff;
  };

  return (
    <React.Fragment>
      <div className="TimeSeries fadeInUp" style={{animationDelay: '2.7s'}}>
        <div className="svg-parent" ref={wrapperRef}>
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Confirmed</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey1])}</h2>
              <h6>{currentStatusCount(chartKey1)}</h6>
            </div>
          </div>
          <svg ref={svgRef1} preserveAspectRatio="xMidYMid meet">
            <g className="x-axis" />
            <g className="x-axis2" />
            <g className="y-axis" />
          </svg>
        </div>

        <div className="svg-parent is-blue">
          <div className="stats is-blue">
            <h5 className={`${!moving ? 'title' : ''}`}>Active</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey2])}</h2>
              <h6>{currentStatusCount(chartKey2)}</h6>
            </div>
          </div>
          <svg ref={svgRef2} preserveAspectRatio="xMidYMid meet">
            <g className="x-axis" />
            <g className="x-axis2" />
            <g className="y-axis" />
          </svg>
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5 className={`${!moving ? 'title' : ''}`}>Recovered</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey3])}</h2>
              <h6>{currentStatusCount(chartKey3)}</h6>
            </div>
          </div>
          <svg ref={svgRef3} preserveAspectRatio="xMidYMid meet">
            <g className="x-axis" />
            <g className="x-axis2" />
            <g className="y-axis" />
          </svg>
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5 className={`${!moving ? 'title' : ''}`}>Deceased</h5>
            <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
            <div className="stats-bottom">
              <h2>{formatNumber(datapoint[chartKey4])}</h2>
              <h6>{currentStatusCount(chartKey4)}</h6>
            </div>
          </div>
          <svg ref={svgRef4} preserveAspectRatio="xMidYMid meet">
            <g className="x-axis" />
            <g className="x-axis2" />
            <g className="y-axis" />
          </svg>
        </div>

        {chartType === 1 && (
          <div className="svg-parent is-purple">
            <div className="stats is-purple">
              <h5 className={`${!moving ? 'title' : ''}`}>
                Tested {props.isTotal ? testedToolTip : ''}
              </h5>
              <h5 className={`${moving ? 'title' : ''}`}>{`${dateStr}`}</h5>
              <div className="stats-bottom">
                <h2>{formatNumber(datapoint.totaltested)}</h2>
              </div>
            </div>
            <svg ref={svgRef5} preserveAspectRatio="xMidYMid meet">
              <g className="x-axis" />
              <g className="y-axis" />
            </svg>
          </div>
        )}
      </div>

      <div className="pills">
        <button
          type="button"
          onClick={() => setLastDaysCount(Infinity)}
          className={lastDaysCount === Infinity ? 'selected' : ''}
        >
          Beginning
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(30)}
          className={lastDaysCount === 30 ? 'selected' : ''}
          aria-label="1 month"
        >
          1 Month
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(14)}
          className={lastDaysCount === 14 ? 'selected' : ''}
          aria-label="14 days"
        >
          2 Weeks
        </button>
      </div>

      <div className="alert is-purple">
        <Icon.AlertOctagon />
        <div className="alert-right">
          Tested chart is independent of uniform scaling
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(TimeSeries);
