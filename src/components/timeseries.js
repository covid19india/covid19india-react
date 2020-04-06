import React, {useState, useEffect, useRef, useCallback} from 'react';
import {preprocessTimeseries} from '../utils/common-functions.js';
import * as d3 from 'd3';

function TimeSeries(props) {
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [update, setUpdate] = useState(-1);
  const [moving, setMoving] = useState(false);

  const graphElement1 = useRef(null);
  const graphElement2 = useRef(null);
  const graphElement3 = useRef(null);
  const graphElement4 = useRef(null);
  const graphElement5 = useRef(null);
  const graphElement6 = useRef(null);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      setTimeseries(props.timeseries);
    }
  }, [props.timeseries]);

  useEffect(() => {
    setMode(props.mode);
    setUpdate((u) => u + 1);
  }, [props.mode]);

  useEffect(() => {
    setLogMode(props.logMode);
    setUpdate((u) => u + 1);
  }, [props.logMode]);

  const graphData = useCallback(
    (timeseries) => {
      const ts = preprocessTimeseries(timeseries);
      const T = ts.length;

      setDatapoint(timeseries[T - 1]);
      setIndex(T - 1);

      const svg1 = d3.select(graphElement1.current);
      const svg2 = d3.select(graphElement2.current);
      const svg3 = d3.select(graphElement3.current);
      const svg4 = d3.select(graphElement4.current);
      const svg5 = d3.select(graphElement5.current);
      const svg6 = d3.select(graphElement6.current);

      // Margins
      const margin = {top: 0, right: 25, bottom: 60, left: 20};
      const chartWidth = 650 - margin.left - margin.right;
      const chartHeight = 200 - margin.top - margin.bottom;

      const dateMin = new Date(ts[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(ts[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .domain([dateMin, dateMax])
        .range([margin.left, chartWidth]);

      // can be moved in for loop
      const xAxis = g => g
        .attr('class', 'axis')
        .call(d3.axisBottom(xScale))
        .style('transform', `translateY(${chartHeight}px)`);

      const indexScale = d3
        .scaleLinear()
        .domain([0, timeseries.length])
        .range([margin.left, chartWidth]);

      const yAxisAdd = (g, y) => g
        .attr('class', 'axis')
        .call(d3
            .axisRight(y)
            .ticks(4, '0~s')
            .tickPadding(5)
        ).style('transform', `translateX(${chartWidth}px)`);

      const yTickPosition = (g, y) =>
        g.selectAll(".tick").style('transform', d => `translateY(${y(d)}px)`);

      const yScaleUniformLinear = d3
          .scaleLinear()
          .domain([0, d3.max(ts, d => d.totalconfirmed)])
          .nice()
          .range([chartHeight, margin.top]);

      const yScaleUniformLog = d3
          .scaleLog()
          .clamp(true)
          .domain([1, d3.max(ts, d => d.totalconfirmed)])
          .nice()
          .range([chartHeight, margin.top]);

      // Arrays of objects
      const svgArray = [svg1, svg2, svg3];
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

      /* Begin drawing charts */
      svgArray.forEach((svg, i) => {
        const caseType = dataTypes[i];
        const color = colors[i];
        /* X axis */
        svg.append('g')
          .call(xAxis);

        const yScaleLinear = d3
            .scaleLinear()
            .domain([0, d3.max(ts, d => d[caseType])])
            .nice()
            .range([chartHeight, margin.top]);

        const yScaleLog = d3
          .scaleLog()
          .clamp(true)
          .domain([1, d3.max(ts, d => d[caseType])])
          .nice()
          .range([chartHeight, margin.top]);

        const y = (mode) ? ((!logMode) ? yScaleUniformLinear : yScaleUniformLog) : ((!logMode) ? yScaleLinear : yScaleLog);
        // Transition interval
        const t = svg.transition().duration(750);

        const yAxisLinear = svg
          .append('g')
          .call(yAxisAdd, yScaleLinear)
          .transition(t)
          .style('opacity', !mode && !logMode ? 1 : 0)
          .call(yTickPosition, y);

        const yAxisLog = svg
          .append('g')
          .call(yAxisAdd, yScaleLog)
          .transition(t)
          .style('opacity', !mode && logMode ? 1 : 0)
          .call(yTickPosition, y);

        const yAxisUniformLinear = svg
          .append('g')
          .call(yAxisAdd, yScaleUniformLinear)
          .transition(t)
          .style('opacity', mode && !logMode ? 1 : 0)
          .call(yTickPosition, y);

        const yAxisUniformLog = svg
          .append('g')
          .call(yAxisAdd, yScaleUniformLog)
          .transition(t)
          .style('opacity', mode && logMode ? 1 : 0)
          .call(yTickPosition, y);

        /* Path dots */
        const dots = svg
          .selectAll('.dot')
          .data(ts)
          .join('circle')
          .attr('class', 'dot')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', 3)
          .attr('cx', d => xScale(d.date))
          .transition(t)
          .attr('cy', d => y(d[caseType]));

        /* Focus dots */
        const focus = svg
          .selectAll('.focus')
          .data([ts[T - 1]])
          .join('circle')
          .attr('class', 'focus')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', 5)
          .attr('cx', d => xScale(d.date))
          .transition(t)
          .attr('cy', d => y(d[caseType]));

        const line = y =>
          d3
            .line()
            .x(d => xScale(d.date))
            .y(d => y(d[caseType]))
            .curve(d3.curveCardinal);

        const path = svg
          .selectAll('.trend')
          .data([ts])
          .join('path')
          .attr('class', 'trend')
          .attr('fill', 'none')
          .attr('stroke', color + '99')
          .attr('stroke-width', 5)
          .attr('cursor', 'pointer')
          .transition(t)
          .attr('d', line(y));

        function mouseout(y) {
          focus
            .attr('cx', xScale(ts[T - 1].date))
            .attr('cy', y(ts[T - 1][caseType]));
        }

        function mousemove(y) {
          const xm = d3.mouse(svg.node())[0];
          const i = Math.round(indexScale.invert(xm));
          if (0 <= i && i < T) {
            const d = ts[i];
            focus.attr('cx', xScale(d.date)).attr('cy', y(d[caseType]));
          }
        }
        // svg.on('mousemove', () => mousemove(y)).on('mouseout', () => mouseout(y));
      });
    },
    [logMode, mode]
  );

  const refreshGraphs = useCallback(() => {
    const graphs = [
      graphElement1,
      graphElement2,
      graphElement3,
      graphElement4,
      graphElement5,
      graphElement6,
    ];
    for (let i = 0; i < graphs.length; i++) {
      // d3.select(graphs[i].current).selectAll('*').remove();
    }
  }, []);

  useEffect(() => {
    if (update > 0) {
      refreshGraphs();
    }
  }, [update, refreshGraphs]);

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
      style={{animationDelay: '1.7s'}}
    >
      <div
        className="timeseries"
        style={{display: props.type === 1 ? 'flex' : 'none'}}
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
            ref={graphElement1}
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
            ref={graphElement2}
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
            ref={graphElement3}
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
            ref={graphElement4}
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
            ref={graphElement5}
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
            ref={graphElement6}
            width="650"
            height="200"
            viewBox="0 0 650 200"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </div>
    </div>
  );
}

export default TimeSeries;
