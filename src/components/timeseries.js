import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';
import {
  preprocessTimeseries,
  sliceTimeseriesFromEnd,
} from '../utils/common-functions';
import {useResizeObserver} from '../utils/hooks';

function TimeSeries(props) {
  const [lastDaysCount, setLastDaysCount] = useState(
    window.innerWidth > 512 ? Infinity : 30
  );
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [chartType, setChartType] = useState(props.type);
  const [moving, setMoving] = useState(false);

  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const svgRef3 = useRef();

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      const slicedTimeseries = sliceTimeseriesFromEnd(
        props.timeseries,
        lastDaysCount
      );
      setIndex(slicedTimeseries.length - 1);
      setTimeseries(slicedTimeseries);
    }
  }, [props.timeseries, lastDaysCount]);

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

      const ts = preprocessTimeseries(timeseries);
      const T = ts.length;
      const yBuffer = 1.1;

      setDatapoint(timeseries[T - 1]);
      setIndex(T - 1);

      const svg1 = d3.select(svgRef1.current);
      const svg2 = d3.select(svgRef2.current);
      const svg3 = d3.select(svgRef3.current);

      const dateMin = new Date(ts[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(ts[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .clamp(true)
        .domain([dateMin, dateMax])
        .range([margin.left, chartRight]);

      // Number of x-axis ticks
      const numTicksX = width < 480 ? 4 : 8;

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

      // Arrays of objects
      const svgArray = [svg1, svg2, svg3];
      const plotTotal = chartType === 1;
      const dataTypesTotal = [
        'totalconfirmed',
        'totalrecovered',
        'totaldeceased',
      ];
      const dataTypesDaily = [
        'dailyconfirmed',
        'dailyrecovered',
        'dailydeceased',
      ];

      const colors = ['#ff073a', '#28a745', '#6c757d'];

      let yScales;
      if (plotTotal) {
        let uniformScaleMin = Infinity;
        dataTypesTotal.forEach((type) => {
          uniformScaleMin = Math.min(
            uniformScaleMin,
            d3.min(ts, (d) => d[type])
          );
        });
        const yScaleUniformLinear = d3
          .scaleLinear()
          .clamp(true)
          .domain([
            uniformScaleMin,
            yBuffer * d3.max(ts, (d) => d.totalconfirmed),
          ])
          .nice()
          .range([chartBottom, margin.top]);

        const yScaleUniformLog = d3
          .scaleLog()
          .clamp(true)
          .domain([
            Math.max(1, uniformScaleMin),
            Math.max(1, yBuffer * d3.max(ts, (d) => d.totalconfirmed)),
          ])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesTotal.map((type) => {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([
              d3.min(ts, (d) => d[type]),
              yBuffer * d3.max(ts, (d) => d[type]),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          const yScaleLog = d3
            .scaleLog()
            .clamp(true)
            .domain([
              Math.max(
                1,
                d3.min(ts, (d) => d[type])
              ),
              Math.max(1, yBuffer * d3.max(ts, (d) => d[type])),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          if (logMode) return mode ? yScaleUniformLog : yScaleLog;
          else return mode ? yScaleUniformLinear : yScaleLinear;
        });
      } else {
        const yScaleDailyUniform = d3
          .scaleLinear()
          .clamp(true)
          .domain([0, yBuffer * d3.max(ts, (d) => d.dailyconfirmed)])
          .nice()
          .range([chartBottom, margin.top]);

        yScales = dataTypesDaily.map((type) => {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([0, yBuffer * d3.max(ts, (d) => d[type])])
            .nice()
            .range([chartBottom, margin.top]);
          return mode ? yScaleDailyUniform : yScaleLinear;
        });
      }

      /* Focus dots */
      const focus = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 4);
      });

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const date = xScale.invert(xm);
        const bisectDate = d3.bisector((d) => d.date).left;
        let i = bisectDate(ts, date, 1);
        if (0 <= i && i < T) {
          if (date - ts[i - 1].date < ts[i].date - date) --i;
          setDatapoint(timeseries[i]);
          setIndex(i);
          setMoving(true);
          const d = ts[i];
          focus.forEach((f, j) => {
            const yScale = yScales[j];
            const type = plotTotal ? dataTypesTotal[j] : dataTypesDaily[j];
            f.attr('cx', xScale(d.date)).attr('cy', yScale(d[type]));
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
          f.attr('cx', xScale(ts[T - 1].date)).attr(
            'cy',
            yScale(ts[T - 1][type])
          );
        });
      }

      /* Begin drawing charts */
      svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(500);
        const typeTotal = dataTypesTotal[i];
        const typeDaily = dataTypesDaily[i];
        const type = plotTotal ? typeTotal : typeDaily;

        const color = colors[i];
        const yScale = yScales[i];
        // WARNING: Bad code ahead.
        /* X axis */
        if (svg.select('.x-axis').empty()) {
          svg.append('g').attr('class', 'x-axis').call(xAxis);
        } else {
          svg.select('.x-axis').transition(t).call(xAxis);
        }
        /* Y axis */
        if (svg.select('.y-axis').empty()) {
          svg.append('g').call(yAxis, yScale);
        } else {
          svg.select('.y-axis').transition(t).call(yAxis, yScale);
        }
        // ^This block of code should be written in a more d3 way following the
        //  General Update Pattern. Can't find of a way to do that within React.

        /* Path dots */
        svg
          .selectAll('.dot')
          .data(ts, (d) => d.date)
          .join((enter) => enter.append('circle').attr('cy', chartBottom))
          .attr('class', 'dot')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', 2)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        if (plotTotal) {
          /* TOTAL TRENDS */
          svg.selectAll('.stem').remove();
          const path = svg
            .selectAll('.trend')
            .data([[...ts].reverse()])
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
                .curve(d3.curveCardinal)
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
            .data(ts, (d) => d.date)
            .join((enter) =>
              enter
                .append('line')
                .attr('x1', (d) => xScale(d.date))
                .attr('x2', (d) => xScale(d.date))
                .attr('y2', chartBottom)
            )
            .attr('class', 'stem')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
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

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const lastDate = new Date(datapoint['date'] + '2020');
  const isYesterday =
    lastDate.getMonth() === yesterdayDate.getMonth() &&
    lastDate.getDate() === yesterdayDate.getDate();

  const chartKey1 = chartType === 1 ? 'totalconfirmed' : 'dailyconfirmed';
  const chartKey2 = chartType === 1 ? 'totalrecovered' : 'dailyrecovered';
  const chartKey3 = chartType === 1 ? 'totaldeceased' : 'dailydeceased';

  return (
    <div
      className="TimeSeries-Parent fadeInUp"
      style={{animationDelay: '2.7s'}}
    >
      <div className="timeseries">
        <div className="svg-parent" ref={wrapperRef}>
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Confirmed</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {isYesterday
                ? `${datapoint['date']} Yesterday`
                : datapoint['date']}
            </h5>
            <div className="stats-bottom">
              <h2>{datapoint[chartKey1]}</h2>
              <h6>
                {' '}
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index][chartKey1] -
                      timeseries[index - 1][chartKey1] >=
                    0
                    ? '+' +
                      (timeseries[index][chartKey1] -
                        timeseries[index - 1][chartKey1])
                    : timeseries[index][chartKey1] -
                      timeseries[index - 1][chartKey1]
                  : ''}{' '}
              </h6>
            </div>
          </div>
          <svg ref={svgRef1} preserveAspectRatio="xMidYMid meet" />
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5 className={`${!moving ? 'title' : ''}`}>Recovered</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {isYesterday
                ? `${datapoint['date']} Yesterday`
                : datapoint['date']}
            </h5>
            <div className="stats-bottom">
              <h2>{datapoint[chartKey2]}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index][chartKey2] -
                      timeseries[index - 1][chartKey2] >=
                    0
                    ? '+' +
                      (timeseries[index][chartKey2] -
                        timeseries[index - 1][chartKey2])
                    : timeseries[index][chartKey2] -
                      timeseries[index - 1][chartKey2]
                  : ''}
              </h6>
            </div>
          </div>
          <svg ref={svgRef2} preserveAspectRatio="xMidYMid meet" />
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5 className={`${!moving ? 'title' : ''}`}>Deceased</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {isYesterday
                ? `${datapoint['date']} Yesterday`
                : datapoint['date']}
            </h5>
            <div className="stats-bottom">
              <h2>{datapoint[chartKey3]}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index][chartKey3] -
                      timeseries[index - 1][chartKey3] >=
                    0
                    ? '+' +
                      (timeseries[index][chartKey3] -
                        timeseries[index - 1][chartKey3])
                    : timeseries[index][chartKey3] -
                      timeseries[index - 1][chartKey3]
                  : ''}
              </h6>
            </div>
          </div>
          <svg ref={svgRef3} preserveAspectRatio="xMidYMid meet" />
        </div>
      </div>

      <div className="pills">
        <button
          type="button"
          onClick={() => setLastDaysCount(Infinity)}
          className={lastDaysCount === Infinity ? 'selected' : ''}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(30)}
          className={lastDaysCount === 30 ? 'selected' : ''}
          aria-label="1 month"
        >
          1M
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(14)}
          className={lastDaysCount === 14 ? 'selected' : ''}
          aria-label="14 days"
        >
          14D
        </button>
      </div>
    </div>
  );
}

export default TimeSeries;
