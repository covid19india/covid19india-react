import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function Minigraph(props) {
  const [data, setData] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const graphElement1 = useRef(null);
  const graphElement2 = useRef(null);
  const graphElement3 = useRef(null);
  const graphElement4 = useRef(null);

  useEffect(()=>{
    graphData();
  }, [1]);

  const graphData = () => {
    const svg1 = d3.select(graphElement1.current);
    const margin = {top: 30, right: 5, bottom: 30, left: 0};
    const width = 75 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg2 = d3.select(graphElement2.current);
    const svg3 = d3.select(graphElement3.current);
    const svg4 = d3.select(graphElement4.current);

    const promises = [
      d3.json('https://api.steinhq.com/v1/storages/5e6fd170b88d3d04ae081593/cases_time_series'),
    ];

    Promise.all(promises).then(ready);

    function ready(response) {
      response[0].pop();
      const data = response[0];
      setDatapoint(data[data.length-1]);

      const x = d3.scaleTime()
          .domain(d3.extent(data.slice(data.length-10, data.length-1), function(d) {
            return new Date(d['Date']+'2020');
          }))
          .range([0, width]);

      const y1 = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return +d['Daily Confirmed'];
          })])
          .range([height, 0]);

      const y2 = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return +d['Daily Confirmed'];
          })])
          .range([height, 0]);

      const y3 = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return +d['Daily Recovered'];
          })])
          .range([height, 0]);


      const y4 = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return +d['Daily Deceased'];
          })])
          .range([height, 0]);

      svg1.append('path')
          .datum(data.slice(data.length-10, data.length-1))
          .attr('fill', 'none')
          .attr('stroke', '#ff073a99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['Date']+'2020'));
              })
              .y(function(d, i) {
                if (i===0) {
                  return y1(data[data.length-9]['Daily Confirmed']-data[data.length-10]['Daily Confirmed']);
                } else {
                  return y1(data[data.length-i]['Daily Confirmed']-data[data.length-1-i]['Daily Confirmed']);
                }
              })
              .curve(d3.curveCardinal),
          );

      svg1.selectAll('.dot')
          .data(data.slice(data.length-2, data.length-1))
          .enter()
          .append('circle')
          .attr('fill', '#ff073a')
          .attr('stroke', '#ff073a')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['Date']+'2020'));
          })
          .attr('cy', function(d) {
            return y1(data[data.length-1]['Daily Confirmed']-data[data.length-2]['Daily Confirmed'])-2;
          })
          .on('mouseover', (d) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
            setDatapoint(d);
          });

      svg2.append('path')
          .datum(data.slice(data.length-10, data.length-1))
          .attr('fill', 'none')
          .attr('cursor', 'pointer')
          .attr('stroke', '#007bff99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['Date']+'2020'));
              })
              .y(function(d, i) {
                if (i===0) {
                  const today = data[data.length-9]['Daily Confirmed']-data[data.length-9]['Daily Recovered']-data[data.length-9]['Daily Deceased'];
                  const yesterday = data[data.length-10]['Daily Confirmed']-data[data.length-10]['Daily Recovered']-data[data.length-10]['Daily Deceased'];
                  return y1(today - yesterday);
                } else {
                  const today = data[data.length-i]['Daily Confirmed']-data[data.length-i]['Daily Recovered']-data[data.length-9]['Daily Deceased'];
                  const yesterday = data[data.length-1-i]['Daily Confirmed']-data[data.length-1-i]['Daily Recovered']-data[data.length-1-i]['Daily Deceased'];
                  return y1(today-yesterday);
                }
              })
              .curve(d3.curveCardinal),
          );

      svg2.selectAll('.dot')
          .data(data.slice(data.length-2, data.length-1))
          .enter()
          .append('circle')
          .attr('fill', '#007bff')
          .attr('stroke', '#007bff')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['Date']+'2020'));
          })
          .attr('cy', function(d) {
            const today = data[data.length-1]['Daily Confirmed']-data[data.length-1]['Daily Recovered']-data[data.length-1]['Daily Deceased'];
            const yesterday = data[data.length-2]['Daily Confirmed']-data[data.length-2]['Daily Recovered']-data[data.length-2]['Daily Deceased'];
            return y1(today-yesterday)-11;
          })
          .on('mouseover', (d) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
            setDatapoint(d);
          });

      svg3.append('path')
          .datum(data.slice(data.length-10, data.length-1))
          .attr('fill', 'none')
          .attr('stroke', '#28a74599')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['Date']+'2020'));
              })
              .y(function(d, i) {
                if (i===0) {
                  return y1(data[data.length-9]['Daily Recovered']-data[data.length-10]['Daily Recovered']);
                } else {
                  return y1(data[data.length-i]['Daily Recovered']-data[data.length-1-i]['Daily Recovered']);
                }
              })
              .curve(d3.curveCardinal),
          );

      svg3.selectAll('.dot')
          .data(data.slice(data.length-2, data.length-1))
          .enter()
          .append('circle')
          .attr('fill', '#28a745')
          .attr('stroke', '#28a745')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['Date']+'2020'));
          })
          .attr('cy', function(d) {
            return y1(data[data.length-1]['Daily Recovered']-data[data.length-2]['Daily Recovered'])+6;
          })
          .on('mouseover', (d) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
            setDatapoint(d);
          });

      svg4.append('path')
          .datum(data.slice(data.length-10, data.length-1))
          .attr('fill', 'none')
          .attr('cursor', 'pointer')
          .attr('stroke', '#6c757d99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['Date']+'2020'));
              })
              .y(function(d, i) {
                if (i===0) {
                  return y1(data[data.length-9]['Daily Deceased']-data[data.length-10]['Daily Deceased']);
                } else {
                  return y1(data[data.length-i]['Daily Deceased']-data[data.length-1-i]['Daily Deceased']);
                }
              })
              .curve(d3.curveCardinal),
          );

      svg4.selectAll('.dot')
          .data(data.slice(data.length-2, data.length-1))
          .enter()
          .append('circle')
          .attr('fill', '#6c757d')
          .attr('stroke', '#6c757d')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['Date']+'2020'));
          })
          .attr('cy', function(d) {
            return y1(data[data.length-1]['Daily Deceased']-data[data.length-2]['Daily Deceased']);
          })
          .on('mouseover', (d) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
            setDatapoint(d);
          });
    };
  };

  return (
    <div className="Minigraph">

      <div className="svg-parent fadeInUp" style={{animationDelay: '0.6s'}}>
        <svg ref={graphElement1} width="75" height="100" viewBox="0 0 75 100" preserveAspectRatio="xMidYMid meet"/>
      </div>

      <div className="svg-parent is-blue fadeInUp" style={{animationDelay: '0.7s'}}>
        <svg ref={graphElement2} width="75" height="100" viewBox="0 0 75 100" preserveAspectRatio="xMidYMid meet"/>
      </div>

      <div className="svg-parent is-green fadeInUp" style={{animationDelay: '0.8s'}}>
        <svg ref={graphElement3} width="75" height="100" viewBox="0 0 75 100" preserveAspectRatio="xMidYMid meet"/>
      </div>

      <div className="svg-parent is-gray fadeInUp" style={{animationDelay: '0.9s'}}>
        <svg ref={graphElement4} width="75" height="100" viewBox="0 0 75 100" preserveAspectRatio="xMidYMid meet"/>
      </div>

    </div>

  );
}

export default Minigraph;
