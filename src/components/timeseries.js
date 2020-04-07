import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';
import {
  preprocessTimeseries,
  sliceTimeseriesFromEnd,
} from '../utils/common-functions';
import {useResizeObserver} from '../utils/hooks';

function TimeSeries(props) {
  const [lastDaysCount, setLastDaysCount] = useState(Infinity);
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [moving, setMoving] = useState(false);

  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const svgRef3 = useRef();
  const svgRef4 = useRef();
  const svgRef5 = useRef();
  const svgRef6 = useRef();

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

  const graphData = useCallback(
    (timeseries) => {
      if (!dimensions) return;
      console.log(dimensions);
      // Margins
      const margin = {top: 0, right: 40, bottom: 60, left: 35};
      const chartRight = 650 - margin.right;
      const chartBottom = 200 - margin.bottom;

      const ts = preprocessTimeseries(timeseries);
      const T = ts.length;
      const yBuffer = 1.1;

      setDatapoint(timeseries[T - 1]);
      setIndex(T - 1);

      const svg1 = d3.select(svgRef1.current);
      const svg2 = d3.select(svgRef2.current);
      const svg3 = d3.select(svgRef3.current);
      const svg4 = d3.select(svgRef4.current);
      const svg5 = d3.select(svgRef5.current);
      const svg6 = d3.select(svgRef6.current);

      const dateMin = new Date(ts[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(ts[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .domain([dateMin, dateMax])
        .range([margin.left, chartRight]);

      const xAxis = (g) =>
        g
          .attr('class', 'x-axis')
          .call(d3.axisBottom(xScale).ticks(8))
          .style('transform', `translateY(${chartBottom}px)`);

      const yAxis = (g, yScale) =>
        g
          .attr('class', 'y-axis')
          .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(5))
          .style('transform', `translateX(${chartRight}px)`);

      // Arrays of objects
      const svgArray = [svg1, svg2, svg3, svg4, svg5, svg6];
      const dataTypes = [
        'totalconfirmed',
        'totalrecovered',
        'totaldeceased',
        'dailyconfirmed',
        'dailyrecovered',
        'dailydeceased',
      ];
      const colors = [
        '#ff073a',
        '#28a745',
        '#6c757d',
        '#ff073a',
        '#28a745',
        '#6c757d',
      ];
      const totalCharts = new Set([
        'totalconfirmed',
        'totalrecovered',
        'totaldeceased',
      ]);

      let uniformScaleMin = Infinity;
      totalCharts.forEach((type) => {
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
          yBuffer * d3.max(ts, (d) => d.totalconfirmed),
        ])
        .nice()
        .range([chartBottom, margin.top]);

      const yScaleDailyUniform = d3
        .scaleLinear()
        .domain([0, yBuffer * d3.max(ts, (d) => d.dailyconfirmed)])
        .nice()
        .range([chartBottom, margin.top]);

      const yScales = dataTypes.map((type) => {
        if (totalCharts.has(type)) {
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
              yBuffer * d3.max(ts, (d) => d[type]),
            ])
            .nice()
            .range([chartBottom, margin.top]);
          if (logMode) return mode ? yScaleUniformLog : yScaleLog;
          else return mode ? yScaleUniformLinear : yScaleLinear;
        } else {
          const yScaleLinear = d3
            .scaleLinear()
            .clamp(true)
            .domain([0, yBuffer * d3.max(ts, (d) => d[type])])
            .nice()
            .range([chartBottom, margin.top]);
          return mode ? yScaleDailyUniform : yScaleLinear;
        }
      });

      /* Focus dots */
      const focus = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus')
          .data([ts[T - 1]], (d) => d.date)
          .join('circle')
          .attr('class', 'focus')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 5);
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
            const type = dataTypes[j];
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
          const type = dataTypes[j];
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

        const type = dataTypes[i];
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
          .attr('r', 3)
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        focus[i]
          .transition(t)
          .attr('cx', (d) => xScale(d.date))
          .attr('cy', (d) => yScale(d[type]));

        /* Add trend path */
        if (totalCharts.has(type)) {
          const path = svg
            .selectAll('.trend')
            .data([[...ts].reverse()])
            .join('path')
            .attr('class', 'trend')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 5);

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

          path.transition(t).attr(
            'd',
            d3
              .line()
              .x((d) => xScale(d.date))
              .y((d) => yScale(d[type]))
              .curve(d3.curveCardinal)
          );
          // Using d3-interpolate-path
          // .attrTween('d', function (d) {
          //   var previous = path.attr('d');
          //   var current = line(d);
          //   return interpolatePath(previous, current);
          // });
        } else {
          svg
            .selectAll('.stem')
            .data(ts, (d) => d.date)
            .join((enter) => enter.append('line').attr('y2', chartBottom))
            .attr('class', 'stem')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('y1', chartBottom)
            .transition(t)
            .attr('x1', (d) => xScale(d.date))
            .attr('x2', (d) => xScale(d.date))
            .attr('y2', (d) => yScale(d[type]));
        }

        svg
          .on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);
      });
    },
    [dimensions, logMode, mode]
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

  return (
    <div
      className="TimeSeries-Parent fadeInUp"
      style={{animationDelay: '2.7s'}}
    >
      <div
        className="timeseries"
        style={{display: props.type === 1 ? 'flex' : 'none'}}
      >
        <div className="svg-parent" ref={wrapperRef}>
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Confirmed</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {isYesterday
                ? `${datapoint['date']} Yesterday`
                : datapoint['date']}
            </h5>
            <div className="stats-bottom">
              <h2>{datapoint['totalconfirmed']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['totalconfirmed'] -
                      timeseries[index - 1]['totalconfirmed'] >=
                    0
                    ? '+' +
                      (timeseries[index]['totalconfirmed'] -
                        timeseries[index - 1]['totalconfirmed'])
                    : timeseries[index]['totalconfirmed'] -
                      timeseries[index - 1]['totalconfirmed']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef1}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
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
              <h2>{datapoint['totalrecovered']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['totalrecovered'] -
                      timeseries[index - 1]['totalrecovered'] >=
                    0
                    ? '+' +
                      (timeseries[index]['totalrecovered'] -
                        timeseries[index - 1]['totalrecovered'])
                    : timeseries[index]['totalrecovered'] -
                      timeseries[index - 1]['totalrecovered']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef2}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
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
              <h2>{datapoint['totaldeceased']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['totaldeceased'] -
                      timeseries[index - 1]['totaldeceased'] >=
                    0
                    ? '+' +
                      (timeseries[index]['totaldeceased'] -
                        timeseries[index - 1]['totaldeceased'])
                    : timeseries[index]['totaldeceased'] -
                      timeseries[index - 1]['totaldeceased']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef3}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </div>

      <div
        className="timeseries"
        style={{display: props.type === 2 ? 'flex' : 'none'}}
      >
        <div className="svg-parent">
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Confirmed</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {isYesterday
                ? `${datapoint['date']} Yesterday`
                : datapoint['date']}
            </h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailyconfirmed']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['dailyconfirmed'] -
                      timeseries[index - 1]['dailyconfirmed'] >=
                    0
                    ? '+' +
                      (timeseries[index]['dailyconfirmed'] -
                        timeseries[index - 1]['dailyconfirmed'])
                    : timeseries[index]['dailyconfirmed'] -
                      timeseries[index - 1]['dailyconfirmed']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef4}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
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
              <h2>{datapoint['dailyrecovered']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['dailyrecovered'] -
                      timeseries[index - 1]['dailyrecovered'] >=
                    0
                    ? '+' +
                      (timeseries[index]['dailyrecovered'] -
                        timeseries[index - 1]['dailyrecovered'])
                    : timeseries[index]['dailyrecovered'] -
                      timeseries[index - 1]['dailyrecovered']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef5}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
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
              <h2>{datapoint['dailydeceased']}</h2>
              <h6>
                {timeseries.length > 0 && index !== 0
                  ? timeseries[index]['dailydeceased'] -
                      timeseries[index - 1]['dailydeceased'] >=
                    0
                    ? '+' +
                      (timeseries[index]['dailydeceased'] -
                        timeseries[index - 1]['dailydeceased'])
                    : timeseries[index]['dailydeceased'] -
                      timeseries[index - 1]['dailydeceased']
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={svgRef6}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </div>

      <div className="pills" style={{marginTop: '32px', textAlign: 'right'}}>
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
