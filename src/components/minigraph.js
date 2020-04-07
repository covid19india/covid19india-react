import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';

function Minigraph(props) {
  const [timeseries, setTimeseries] = useState([]);
  const graphElement1 = useRef(null);
  const graphElement2 = useRef(null);
  const graphElement3 = useRef(null);
  const graphElement4 = useRef(null);

  useEffect(() => {
    if (props.timeseries.length > 1) {
      setTimeseries(props.timeseries.slice(props.timeseries.length - 20));
    }
  }, [props.timeseries]);

  const graphData = useCallback(
    (timeseries) => {
      if (timeseries.length <= 1) return 0;
      const data = timeseries;
      const svg1 = d3.select(graphElement1.current);
      const margin = {top: 30, right: 10, bottom: 30, left: 0};
      const width = 100 - margin.left - margin.right;
      const height = 100 - margin.top - margin.bottom;

      const svg2 = d3.select(graphElement2.current);
      const svg3 = d3.select(graphElement3.current);
      const svg4 = d3.select(graphElement4.current);

      const x = d3
        .scaleTime()
        .domain(
          d3.extent(data, function (d) {
            return new Date(d['date'] + '2020');
          })
        )
        .range([0, width]);

      const y1 = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return +d['dailyconfirmed'];
          }),
        ])
        .range([height, 0]);

      const path1 = svg1
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#ff073a99')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(new Date(d['date'] + '2020'));
            })
            .y(function (d, i) {
              return y1(d['dailyconfirmed']);
            })
            .curve(d3.curveCardinal)
        );

      const totalLength1 = path1.node().getTotalLength();
      path1
        .attr('stroke-dasharray', totalLength1 + ' ' + totalLength1)
        .attr('stroke-dashoffset', totalLength1)
        .transition()
        .duration(props.animate ? 2000 : 0)
        .attr('stroke-dashoffset', 0);

      svg1
        .selectAll('.dot')
        .data(data.slice(data.length - 1))
        .enter()
        .append('circle')
        .attr('fill', '#ff073a')
        .attr('stroke', '#ff073a')
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', function (d) {
          return x(new Date(d['date'] + '2020'));
        })
        .attr('cy', function (d) {
          return y1(d['dailyconfirmed']);
        })
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .duration(props.animate ? 3000 : 0)
        .style('opacity', 1);

      const path2 = svg2
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('cursor', 'pointer')
        .attr('stroke', '#007bff99')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(new Date(d['date'] + '2020'));
            })
            .y(function (d, i) {
              if (i === 0) {
                return y1(
                  d['dailyconfirmed'] - d['dailyrecovered'] - d['dailydeceased']
                );
              } else {
                return y1(
                  d['dailyconfirmed'] - d['dailyrecovered'] - d['dailydeceased']
                );
              }
            })
            .curve(d3.curveCardinal)
        );

      const totalLength2 = path2.node().getTotalLength();
      path2
        .attr('stroke-dasharray', totalLength2 + ' ' + totalLength2)
        .attr('stroke-dashoffset', totalLength2)
        .transition()
        .duration(props.animate ? 2000 : 0)
        .attr('stroke-dashoffset', 0);

      svg2
        .selectAll('.dot')
        .data(data.slice(data.length - 1))
        .enter()
        .append('circle')
        .attr('fill', '#007bff')
        .attr('stroke', '#007bff')
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', function (d) {
          return x(new Date(d['date'] + '2020'));
        })
        .attr('cy', function (d) {
          /* const today =
          data[data.length - 1]['dailyconfirmed'] -
          data[data.length - 1]['dailyrecovered'] -
          data[data.length - 1]['dailydeceased'];
        const yesterday =
          data[data.length - 2]['dailyconfirmed'] -
          data[data.length - 2]['dailyrecovered'] -
          data[data.length - 2]['dailydeceased'];*/
          return y1(
            d['dailyconfirmed'] - d['dailyrecovered'] - d['dailydeceased']
          );
        })
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .duration(props.animate ? 3000 : 0)
        .style('opacity', 1);

      const path3 = svg3
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#28a74599')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(new Date(d['date'] + '2020'));
            })
            .y(function (d, i) {
              if (i === 0) {
                return y1(d['dailyrecovered']);
              } else {
                return y1(d['dailyrecovered']);
              }
            })
            .curve(d3.curveCardinal)
        );

      const totalLength3 = path1.node().getTotalLength();
      path3
        .attr('stroke-dasharray', totalLength3 + ' ' + totalLength3)
        .attr('stroke-dashoffset', totalLength3)
        .transition()
        .duration(props.animate ? 2000 : 0)
        .attr('stroke-dashoffset', 0);

      svg3
        .selectAll('.dot')
        .data(data.slice(data.length - 1))
        .enter()
        .append('circle')
        .attr('fill', '#28a745')
        .attr('stroke', '#28a745')
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', function (d) {
          return x(new Date(d['date'] + '2020'));
        })
        .attr('cy', function (d) {
          return y1(d['dailyrecovered']);
        })
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .duration(props.animate ? 3000 : 0)
        .style('opacity', 1);

      const path4 = svg4
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('cursor', 'pointer')
        .attr('stroke', '#6c757d99')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(new Date(d['date'] + '2020'));
            })
            .y(function (d, i) {
              if (i === 0) {
                return y1(d['dailydeceased']);
              } else {
                return y1(d['dailydeceased']);
              }
            })
            .curve(d3.curveCardinal)
        );

      const totalLength4 = path4.node().getTotalLength();
      path4
        .attr('stroke-dasharray', totalLength4 + ' ' + totalLength4)
        .attr('stroke-dashoffset', totalLength4)
        .transition()
        .duration(props.animate ? 2000 : 0)
        .attr('stroke-dashoffset', 0);

      svg4
        .selectAll('.dot')
        .data(data.slice(data.length - 1))
        .enter()
        .append('circle')
        .attr('fill', '#6c757d')
        .attr('stroke', '#6c757d')
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', function (d) {
          return x(new Date(d['date'] + '2020'));
        })
        .attr('cy', function (d) {
          return y1(d['dailydeceased']);
        })
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .duration(props.animate ? 3000 : 0)
        .style('opacity', 1);
    },
    [props.animate]
  );

  useEffect(() => {
    graphData(timeseries);
  }, [timeseries, graphData]);

  return (
    <div className="Minigraph">
      <div className="svg-parent fadeInUp" style={{animationDelay: '1.4s'}}>
        <svg
          ref={graphElement1}
          width="100"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-blue fadeInUp"
        style={{animationDelay: '1.5s'}}
      >
        <svg
          ref={graphElement2}
          width="100"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-green fadeInUp"
        style={{animationDelay: '1.6s'}}
      >
        <svg
          ref={graphElement3}
          width="100"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      <div
        className="svg-parent is-gray fadeInUp"
        style={{animationDelay: '1.7s'}}
      >
        <svg
          ref={graphElement4}
          width="100"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
}

export default Minigraph;
