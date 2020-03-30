import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';

function TimeSeries(props) {
  const [timeseries, setTimeseries] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);
  const [mode, setMode] = useState(props.mode);
  const [update, setUpdate] = useState(-1);

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
      const margin = {top: 0, right: 20, bottom: 50, left: 20};
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
      const maxDataTypes = Array.from({length: svgArray.length}, (_, i) => {
        return d3.max(data, (d) => {
          return +d[dataTypes[i]];
        });
      });
      const yScales = maxDataTypes.map((d) => {
        return d3
          .scaleLinear()
          .domain([-d / 10, d])
          .range([height, margin.top]);
      });

      /* Focus dots */
      const focus = svgArray.map((d, i) => {
        const y = mode ? yScales[0] : yScales[i];
        return d
          .append('g')
          .append('circle')
          .attr('fill', colors[i])
          .attr('stroke', colors[i])
          .attr('r', 5)
          .attr('cx', x(new Date(data[timeseries.length - 1]['date'] + '2020')))
          .attr('cy', y(data[timeseries.length - 1][dataTypes[i]]));
      });

      function mouseout() {
        setDatapoint(data[timeseries.length - 1]);
        setIndex(timeseries.length - 1);
        focus.forEach((d, i) => {
          const y = mode ? yScales[0] : yScales[i];
          d.attr(
            'cx',
            x(new Date(data[timeseries.length - 1]['date'] + '2020'))
          ).attr('cy', y(data[timeseries.length - 1][dataTypes[i]]));
        });
      }

      function mousemove() {
        const xm = d3.mouse(this)[0];
        const i = Math.round(indexScale.invert(xm));
        if (0 <= i && i < timeseries.length) {
          const d = data[i];
          setDatapoint(d);
          setIndex(i);
          focus.forEach((f, j) => {
            const y = mode ? yScales[0] : yScales[j];
            f.attr('cx', x(new Date(d['date'] + '2020'))).attr(
              'cy',
              y(d[dataTypes[j]])
            );
          });
        }
      }

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
              .axisRight(mode ? yScales[0] : yScales[i])
              .ticks(5)
              .tickPadding(5)
              .tickFormat((tick) => {
                if (Math.floor(tick) === tick) return tick;
              })
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
          .attr('cy', (d) => {
            if (mode) return yScales[0](d[dataTypes[i]]);
            return yScales[i](d[dataTypes[i]]);
          });

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
                .y((d) => {
                  if (mode) return yScales[0](d[dataTypes[i]]);
                  return yScales[i](d[dataTypes[i]]);
                })
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
            .attr('y2', (d) => {
              return mode
                ? yScales[0](d[dataTypes[i]])
                : yScales[i](d[dataTypes[i]]);
            })
            .style('stroke', colors[i] + '99')
            .style('stroke-width', 4);
          dots.attr('r', 2);
        }
      });
    },
    [mode]
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
    for (let i = 0; i <= graphs.length; i++) {
      if (i === graphs.length) {
        graphData(timeseries);
        return;
      } else d3.select(graphs[i].current).selectAll('*').remove();
    }
  }, [timeseries, graphData]);

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
            <h5>Confirmed {datapoint['date']}</h5>
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
            <h5>Recovered {datapoint['date']}</h5>
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
            <h5>
              Deceased <br />
              {datapoint['date']}
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
            <h5>Confirmed {datapoint['date']}</h5>
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
            <h5>Recovered {datapoint['date']}</h5>
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
            <h5>
              Deceased <br />
              {datapoint['date']}
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
