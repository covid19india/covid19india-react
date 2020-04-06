import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';

function TimeSeries(props) {
  const [timeseries, setTimeseries] = useState([]);
  const [statesDaily, setStatesDaily] = useState({
    Confirmed: [],
    Recovered: [],
    Deceased: [],
  });
  const [highlightedState, setHighlightedState] = useState('kl');
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
  const graphElement7 = useRef(null);
  const graphElement8 = useRef(null);
  const graphElement9 = useRef(null);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      setTimeseries(props.timeseries);
    }
  }, [props.timeseries]);

  useEffect(() => {
    const statesDaily = {
      Confirmed: [],
      Recovered: [],
      Deceased: [],
    };
    props.statesDaily.forEach((i) => statesDaily[i.status].push(i));
    setStatesDaily(statesDaily);
  }, [props.statesDaily]);

  useEffect(() => {
    setMode(props.mode);
    setUpdate((u) => u + 1);
  }, [props.mode]);

  useEffect(() => {
    setLogMode(props.logMode);
    setUpdate((u) => u + 1);
  }, [props.logMode]);

  useEffect(() => {
    if (props.regionHighlighted && props.regionHighlighted.state) {
      setHighlightedState(
        props.regionHighlighted.state.statecode.toLowerCase()
      );
    }
  }, [props.regionHighlighted, setHighlightedState]);

  useEffect(() => {
    if (props.stateHighlightedInMap)
      setHighlightedState(props.stateHighlightedInMap.toLowerCase());
  }, [props.stateHighlightedInMap, setHighlightedState]);

  const graphData1 = useCallback(
    ({Confirmed, Recovered, Deceased}) => {
      const graphs = [graphElement7, graphElement8, graphElement9];
      for (let i = 0; i < graphs.length; i++) {
        d3.select(graphs[i].current).selectAll('*').remove();
      }
      if (!highlightedState) return;

      const svgArray = [
        d3.select(graphElement7.current),
        d3.select(graphElement8.current),
        d3.select(graphElement9.current),
      ];
      const colors = ['#ff073a', '#28a745', '#6c757d'];

      // Margins
      const margin = {top: 0, right: 20, bottom: 50, left: 20};
      const width = 650 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const dateMin = new Date(Confirmed[0]['date'] + '20');
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(Confirmed[Confirmed.length - 1]['date'] + '20');
      dateMax.setDate(dateMax.getDate() + 1);

      const x = d3
        .scaleTime()
        .domain([dateMin, dateMax])
        .range([margin.left, width]);

      const yScaleMaxMap = [
        d3.max(Confirmed, (d) => +d[highlightedState]),
        d3.max(Recovered, (d) => +d[highlightedState]),
        d3.max(Deceased, (d) => +d[highlightedState]),
      ];
      const yScales = yScaleMaxMap.map((maxY) => {
        return d3
          .scaleLinear()
          .domain([0, maxY])
          .nice()
          .range([height, margin.top]);
      });
      if (mode) yScales[1] = yScales[2] = yScales[0];

      const indexScale = d3
        .scaleLinear()
        .domain([0, Confirmed.length])
        .range([margin.left, width]);

      /* Focus dots */
      const focus = svgArray.map((f, i) => {
        const d = i === 0 ? Confirmed : i === 1 ? Recovered : Deceased;
        return f
          .append('g')
          .append('circle')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 5)
          .attr('cx', x(new Date(d[d.length - 1]['date'] + '20')))
          .attr('cy', yScales[i](d[d.length - 1][highlightedState]));
      });

      function mouseout() {
        setDatapoint(Confirmed[Confirmed.length - 1]);
        setIndex(Confirmed.length - 1);
        setMoving(false);
        focus.forEach((f, i) => {
          const d = i === 0 ? Confirmed : i === 1 ? Recovered : Deceased;
          f.attr('cx', x(new Date(d[d.length - 1]['date'] + '20'))).attr(
            'cy',
            yScales[i](d[d.length - 1][highlightedState])
          );
        });
      }

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const xPos = Math.round(indexScale.invert(xm));
        if (xPos >= 0 && xPos < Confirmed.length) {
          setDatapoint(Confirmed[xPos]);
          setIndex(xPos);
          setMoving(true);
          focus.forEach((f, i) => {
            const d = i === 0 ? Confirmed : i === 1 ? Recovered : Deceased;
            f.attr('cx', x(new Date(d[xPos]['date'] + '20'))).attr(
              'cy',
              yScales[i](d[xPos][highlightedState])
            );
          });
        }
      }

      svgArray.forEach((s, i) => {
        /* X axis */
        s.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

        /* Y axis */
        s.append('g')
          .attr('transform', `translate(${width}, ${0})`)
          .attr('class', 'axis')
          .call(
            d3
              .axisRight(yScales[i])
              .ticks(5)
              .tickPadding(5)
              .tickFormat(d3.format('~s'))
          );

        /* Line */
        s.selectAll('stem-line')
          .data(i === 0 ? Confirmed : i === 1 ? Recovered : Deceased)
          .enter()
          .append('line')
          .attr('x1', (d) => {
            return x(new Date(d['date'] + '20'));
          })
          .attr('y1', height)
          .attr('x2', (d) => {
            return x(new Date(d['date'] + '20'));
          })
          .attr('y2', (d) => yScales[i](d[highlightedState]))
          .style('stroke', colors[i] + '99')
          .style('stroke-width', 5);

        /* Path dots */
        s.selectAll('.dot')
          .data(i === 0 ? Confirmed : i === 1 ? Recovered : Deceased)
          .enter()
          .append('circle')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('cursor', 'pointer')
          .attr('cx', (d) => {
            return x(new Date(d['date'] + '20'));
          })
          .attr('cy', (d) => yScales[i](d[highlightedState]))
          .attr('r', 3);

        /* Focus dots */
        s.on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);
      });
    },
    [mode, highlightedState]
  );

  const graphData = useCallback(
    (timeseries) => {
      const data = timeseries;
      setDatapoint(timeseries[timeseries.length - 1]);
      setIndex(timeseries.length - 1);

      const svg1 = d3.select(graphElement1.current);
      const svg2 = d3.select(graphElement2.current);
      const svg3 = d3.select(graphElement3.current);
      const svg4 = d3.select(graphElement4.current);
      const svg5 = d3.select(graphElement5.current);
      const svg6 = d3.select(graphElement6.current);

      // Margins
      const margin = {top: 0, right: 25, bottom: 60, left: 20};
      const width = 650 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const dateMin = new Date(data[0]['date'] + '2020');
      dateMin.setDate(dateMin.getDate() - 1);
      const dateMax = new Date(data[timeseries.length - 1]['date'] + '2020');
      dateMax.setDate(dateMax.getDate() + 1);

      const x = d3
        .scaleTime()
        .domain([dateMin, dateMax])
        .range([margin.left, width]);

      const indexScale = d3
        .scaleLinear()
        .domain([0, timeseries.length])
        .range([margin.left, width]);

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
      const logCharts = new Set([
        'totalconfirmed',
        'totalrecovered',
        'totaldeceased',
      ]);

      const dTypeMaxMap = dataTypes.reduce((a, c) => {
        a[c] = d3.max(data, (d) => +d[c]);
        return a;
      }, {});

      const yScales = Object.entries(dTypeMaxMap).map(([type, maxY]) => {
        // apply mode, logMode, etc -- determine scales once and for all
        const applyLogMode = (maxY) =>
          logMode && logCharts.has(type)
            ? d3
                .scaleLog()
                .domain([1, 1.1 * maxY])
                .nice()
            : d3
                .scaleLinear()
                .domain([0, 1.1 * maxY])
                .nice();

        return (mode
          ? applyLogMode(
              type.match('^total')
                ? dTypeMaxMap['totalconfirmed']
                : dTypeMaxMap['dailyconfirmed']
            )
          : applyLogMode(maxY)
        ).range([height, margin.top]);
      });

      const y = (dataTypeIdx, day) => {
        // Scaling mode filters
        const scale = yScales[dataTypeIdx];
        const dType = dataTypes[dataTypeIdx];
        return scale(
          logMode && logCharts.has(dType) ? Math.max(1, day[dType]) : day[dType]
        ); // max(1,y) for logmode
      };

      /* Focus dots */
      const focus = svgArray.map((d, i) => {
        return d
          .append('g')
          .append('circle')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 5)
          .attr('cx', x(new Date(data[timeseries.length - 1]['date'] + '2020')))
          .attr('cy', y(i, data[timeseries.length - 1]));
      });

      function mouseout() {
        setDatapoint(data[timeseries.length - 1]);
        setIndex(timeseries.length - 1);
        setMoving(false);
        focus.forEach((d, i) => {
          d.attr(
            'cx',
            x(new Date(data[timeseries.length - 1]['date'] + '2020'))
          ).attr('cy', y(i, data[timeseries.length - 1]));
        });
      }

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const i = Math.round(indexScale.invert(xm));
        if (0 <= i && i < timeseries.length) {
          const d = data[i];
          setDatapoint(d);
          setMoving(true);
          setIndex(i);
          focus.forEach((f, j) => {
            f.attr('cx', x(new Date(d['date'] + '2020'))).attr('cy', y(j, d));
          });
        }
      }

      const tickCount = (scaleIdx) => {
        const dType = dataTypes[scaleIdx];
        return logMode && logCharts.has(dType)
          ? Math.ceil(Math.log10(yScales[scaleIdx].domain()[1]))
          : 5;
      };

      /* Begin drawing charts */
      svgArray.forEach((s, i) => {
        /* X axis */
        s.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

        /* Y axis */
        s.append('g')
          .attr('transform', `translate(${width}, ${0})`)
          .attr('class', 'axis')
          .call(
            d3
              .axisRight(yScales[i])
              .ticks(tickCount(i))
              .tickPadding(5)
              .tickFormat(d3.format('~s'))
          );

        /* Focus dots */
        s.on('mousemove', mousemove)
          .on('touchmove', mousemove)
          .on('mouseout', mouseout)
          .on('touchend', mouseout);

        /* Path dots */
        const dots = s
          .selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('cursor', 'pointer')
          .attr('cx', (d) => {
            return x(new Date(d['date'] + '2020'));
          })
          .attr('cy', (d) => y(i, d));

        /* Paths */
        if (i < Math.floor(svgArray.length / 2)) {
          s.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colors[i] + '99')
            .attr('stroke-width', 5)
            .attr('cursor', 'pointer')
            .attr(
              'd',
              d3
                .line()
                .x((d) => {
                  return x(new Date(d['date'] + '2020'));
                })
                .y((d) => y(i, d))
                .curve(d3.curveCardinal)
            );
          dots.attr('r', 3);
        } else {
          s.selectAll('stem-line')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => {
              return x(new Date(d['date'] + '2020'));
            })
            .attr('y1', height)
            .attr('x2', (d) => {
              return x(new Date(d['date'] + '2020'));
            })
            .attr('y2', (d) => y(i, d))
            .style('stroke', colors[i] + '99')
            .style('stroke-width', 5);
          dots.attr('r', 3);
        }
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
      d3.select(graphs[i].current).selectAll('*').remove();
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
      graphData1(statesDaily);
    }
  }, [timeseries, graphData, statesDaily, graphData1]);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const lastDate = new Date(
    datapoint['date'] + (props.type !== 3 ? '2020' : '20')
  );
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

      <div
        className="timeseries"
        style={{display: props.type === 3 ? 'flex' : 'none'}}
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
              <h2>
                {statesDaily['Confirmed'][index] &&
                  statesDaily['Confirmed'][index][highlightedState]}
              </h2>
              <h6>
                {statesDaily['Confirmed'][index] && index !== 0
                  ? statesDaily['Confirmed'][index][highlightedState] -
                      statesDaily['Confirmed'][index - 1][highlightedState] >=
                    0
                    ? '+' +
                      (statesDaily['Confirmed'][index][highlightedState] -
                        statesDaily['Confirmed'][index - 1][highlightedState])
                    : statesDaily['Confirmed'][index][highlightedState] -
                      statesDaily['Confirmed'][index - 1][highlightedState]
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={graphElement7}
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
              <h2>
                {statesDaily['Recovered'][index] &&
                  statesDaily['Recovered'][index][highlightedState]}
              </h2>
              <h6>
                {statesDaily['Recovered'][index] && index !== 0
                  ? statesDaily['Recovered'][index][highlightedState] -
                      statesDaily['Recovered'][index - 1][highlightedState] >=
                    0
                    ? '+' +
                      (statesDaily['Recovered'][index][highlightedState] -
                        statesDaily['Recovered'][index - 1][highlightedState])
                    : statesDaily['Recovered'][index][highlightedState] -
                      statesDaily['Recovered'][index - 1][highlightedState]
                  : ''}
              </h6>
            </div>
          </div>
          <svg
            ref={graphElement8}
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
              <h2>
                {statesDaily['Deceased'][index] &&
                  statesDaily['Deceased'][index][highlightedState]}
              </h2>
              {statesDaily['Deceased'][index] && index !== 0
                ? statesDaily['Deceased'][index][highlightedState] -
                    statesDaily['Deceased'][index - 1][highlightedState] >=
                  0
                  ? '+' +
                    (statesDaily['Deceased'][index][highlightedState] -
                      statesDaily['Deceased'][index - 1][highlightedState])
                  : statesDaily['Deceased'][index][highlightedState] -
                    statesDaily['Deceased'][index - 1][highlightedState]
                : ''}
            </div>
          </div>
          <svg
            ref={graphElement9}
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
