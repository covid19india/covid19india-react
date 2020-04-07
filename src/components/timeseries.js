import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  parseCountryTimeSeries,
  parseStateTimeSeries,
} from '../utils/common-functions.js';
import * as d3 from 'd3';

function TimeSeries(props) {
  const [countryTimeSeries, setCountryTimeSeries] = useState();
  const [stateTimeSeries, setStateTimeSeries] = useState();
  const [graphData, setGraphData] = useState();
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [logMode, setLogMode] = useState(props.logMode);
  const [moving, setMoving] = useState(false);

  const graphElement1 = useRef(null);
  const graphElement2 = useRef(null);
  const graphElement3 = useRef(null);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      setCountryTimeSeries(parseCountryTimeSeries(props.timeseries));
    }
  }, [props.timeseries]);

  useEffect(() => {
    if (props.statesDaily.length > 1)
      setStateTimeSeries(parseStateTimeSeries(props.statesDaily));
  }, [props.statesDaily]);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  useEffect(() => {
    setLogMode(props.logMode);
  }, [props.logMode]);

  useEffect(() => {
    const stateCode =
      props.regionHighlighted && props.regionHighlighted.state
        ? props.regionHighlighted.state.statecode
        : props.stateHighlightedInMap
        ? props.stateHighlightedInMap
        : '';

    if (stateCode) {
      const graphType = props.type === 1 ? 'cumulative' : 'daily';
      setGraphData(stateTimeSeries[stateCode.toLowerCase()][graphType]);
    } else if (countryTimeSeries)
      setGraphData(
        countryTimeSeries[props.type === 1 ? 'cumulative' : 'daily']
      );
  }, [
    props.regionHighlighted,
    props.stateHighlightedInMap,
    props.type,
    stateTimeSeries,
    countryTimeSeries,
  ]);

  const initializeGraph = useCallback(
    (graphData) => {
      if (!graphData) return;

      const graphs = [graphElement1, graphElement2, graphElement3];
      for (let i = 0; i < graphs.length; i++) {
        d3.select(graphs[i].current).selectAll('*').remove();
      }
      const colors = ['#ff073a', '#28a745', '#6c757d'];

      const svg1 = d3.select(graphElement1.current);
      const svg2 = d3.select(graphElement2.current);
      const svg3 = d3.select(graphElement3.current);
      const svgArray = [svg1, svg2, svg3];

      const graphTypes = [
        'c', // confirmed
        'r', // recovered
        'd', // deceased
      ];

      // Margins
      const margin = {top: 0, right: 25, bottom: 60, left: 20};
      const chartWidth = 650 - margin.left - margin.right;
      const chartHeight = 200 - margin.top - margin.bottom;

      const T = graphData.c.length;
      const yBuffer = 1.1;

      const dateMin = new Date(graphData.c[0]['date']);
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(graphData.c[T - 1]['date']);
      dateMax.setDate(dateMax.getDate() + 1);

      const xScale = d3
        .scaleTime()
        .domain([dateMin, dateMax])
        .range([margin.left, chartWidth]);

      // can be moved in for loop
      const xAxis = (g) =>
        g
          .attr('class', 'x-axis')
          .call(d3.axisBottom(xScale))
          .style('transform', `translateY(${chartHeight}px)`);

      const yScales = Object.keys(graphData).map((i) => {
        const data = graphData[mode ? graphTypes[0] : i];
        return (logMode ? d3.scaleLog() : d3.scaleLinear())
          .clamp(true)
          .domain([logMode ? 1 : 0, yBuffer * d3.max(data, (d) => d.count)])
          .nice()
          .range([chartHeight, margin.top]);
      });

      const yAxis = (g, yScale) =>
        g
          .attr('class', 'y-axis')
          .call(d3.axisRight(yScale).ticks(4, '0~s').tickPadding(5))
          .style('transform', `translateX(${chartWidth}px)`);

      /* Focus dots */
      const focus = svgArray.map((svg, i) => {
        return svg
          .selectAll('.focus')
          .data([graphData[graphTypes[i]][T - 1]])
          .join('circle')
          .attr('class', 'focus')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 5)
          .attr('cx', (d) => xScale(d.date));
      });

      const indexScale = d3
        .scaleLinear()
        .domain([0, graphData['c'].length])
        .range([margin.left, chartWidth]);

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const i = Math.round(indexScale.invert(xm));
        if (0 <= i && i < T) setFocusDot(i);
      }

      function mouseout() {
        setFocusDot(null);
      }

      function setFocusDot(i) {
        setIndex(i ? i : T - 1);
        setMoving(Boolean(i));
        focus.forEach((f, j) => {
          const type = graphTypes[j];
          const d = graphData[type][i ? i : T - 1];
          f.attr('cx', xScale(d.date)).attr('cy', yScales[j](d.count));
        });
      }

      /* Begin drawing charts */
      svgArray.forEach((svg, i) => {
        // Transition interval
        const t = svg.transition().duration(0);

        const type = graphTypes[i];
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
          .data(graphData[type])
          .join('circle')
          .attr('class', 'dot')
          .attr('fill', color)
          .attr('stroke', color)
          .attr('r', 3)
          .attr('cx', (d) => xScale(d.date))
          .transition(t)
          .attr('cy', (d) => yScale(d.count));

        focus[i].transition(t).attr('cy', (d) => yScale(d.count));

        /* Add trend path */
        if (props.type === 1) {
          svg
            .selectAll('.trend')
            .data([graphData[type]])
            .join('path')
            .attr('class', 'trend')
            .attr('fill', 'none')
            .attr('stroke', color + '99')
            .attr('stroke-width', 5)
            .attr('cursor', 'pointer')
            .transition(t)
            .attr(
              'd',
              d3
                .line()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d.count))
                .curve(d3.curveCardinal)
            );
        } else {
          svg
            .selectAll('.stem')
            .data(graphData[type])
            .join('line')
            .attr('class', 'stem')
            .style('stroke', color + '99')
            .style('stroke-width', 4)
            .attr('x1', (d) => xScale(d.date))
            .attr('y1', chartHeight)
            .attr('x2', (d) => xScale(d.date))
            .transition(t)
            .attr('y2', (d) => yScale(d.count));
        }

        svg
          .on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);
      });
    },
    [logMode, mode, props.type]
  );

  useEffect(() => {
    if (graphData) initializeGraph(graphData);
  }, [graphData, initializeGraph]);

  if (!graphData) return <></>;
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const lastDate = new Date(graphData['c'].date + '2020');
  const yesterday =
    lastDate.getMonth() === yesterdayDate.getMonth() &&
    lastDate.getDate() === yesterdayDate.getDate()
      ? ' Yesterday'
      : '';

  return (
    <div
      className="TimeSeries-Parent fadeInUp"
      style={{animationDelay: '1.7s'}}
    >
      <div className="timeseries">
        <div className="svg-parent">
          <div className="stats">
            <h5 className={`${!moving ? 'title' : ''}`}>Confirmed</h5>
            <h5 className={`${moving ? 'title' : ''}`}>
              {graphData['c'][index]['date'].toLocaleDateString() + yesterday}
            </h5>
            <div className="stats-bottom">
              <h2>{graphData['c'][index].count}</h2>
              <h6>
                {graphData['c'][index] > 0 && index !== 0
                  ? graphData['c'][index].count -
                      graphData['c'][index - 1].count >=
                    0
                    ? '+' +
                      (graphData['c'][index].count -
                        graphData['c'][index - 1].count)
                    : graphData['c'][index].count -
                      graphData['c'][index - 1].count
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
              {graphData['r'][index]['date'].toLocaleDateString() + yesterday}
            </h5>
            <div className="stats-bottom">
              <h2>{graphData['r'][index].count}</h2>
              <h6>
                {graphData['r'][index] > 0 && index !== 0
                  ? graphData['r'][index].count -
                      graphData['r'][index - 1].count >=
                    0
                    ? '+' +
                      (graphData['r'][index].count -
                        graphData['r'][index - 1].count)
                    : graphData['r'][index].count -
                      graphData['r'][index - 1].count
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
              {graphData['d'][index]['date'].toLocaleDateString() + yesterday}
            </h5>
            <div className="stats-bottom">
              <h2>{graphData['d'][index].count}</h2>
              <h6>
                {graphData['d'][index] > 0 && index !== 0
                  ? graphData['d'][index].count -
                      graphData['d'][index - 1].count >=
                    0
                    ? '+' +
                      (graphData['d'][index].count -
                        graphData['d'][index - 1].count)
                    : graphData['d'][index].count -
                      graphData['d'][index - 1].count
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
    </div>
  );
}

export default TimeSeries;
