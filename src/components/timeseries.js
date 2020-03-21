import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function TimeSeries(props) {
  const [data, setData] = useState([]);
  const [datapoint, setDatapoint] = useState({});
  const [index, setIndex] = useState(10);

  const graphElement1 = useRef(null);
  const graphElement2 = useRef(null);
  const graphElement3 = useRef(null);
  const graphElement4 = useRef(null);
  const graphElement5 = useRef(null);
  const graphElement6 = useRef(null);

  useEffect(()=>{
    graphData();
  }, [1]);

  const graphData = () => {
    const svg1 = d3.select(graphElement1.current);
    const margin = {top: 0, right: 0, bottom: 10, left: 0};
    const width = 650 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg2 = d3.select(graphElement2.current);
    const svg3 = d3.select(graphElement3.current);
    const svg4 = d3.select(graphElement4.current);
    const svg5 = d3.select(graphElement5.current);
    const svg6 = d3.select(graphElement6.current);

    const promises = [
      d3.json('https://api.covid19india.org/data.json'),
    ];

    Promise.all(promises).then(ready);
    function ready(response) {
      response[0]['cases_time_series'].pop();
      const data = response[0]['cases_time_series'];
      setData(data);
      setDatapoint(data[data.length-1]);
      setIndex(data.length-1);

      const x = d3.scaleTime()
          .domain(d3.extent(data, function(d) {
            return new Date(d['date']+'2020');
          }))
          .range([0, width]);

      svg1.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      svg2.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      svg3.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      svg4.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      svg5.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      svg6.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(d3.axisBottom(x));

      const y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {
            return +d['totalconfirmed'];
          })])
          .range([height, 0]);

      {/* svg.append('g')
          .call(d3.axisLeft(y));*/}

      svg1.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#ff073a99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['totalconfirmed'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg1.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#ff073a')
          .attr('stroke', '#ff073a')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['totalconfirmed'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });


      svg2.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#28a74599')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['totalrecovered'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg2.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#28a745')
          .attr('stroke', '#28a745')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['totalrecovered'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });


      svg3.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('cursor', 'pointer')
          .attr('stroke', '#6c757d99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['totaldeceased'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg3.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#6c757d')
          .attr('stroke', '#6c757d')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['totaldeceased'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });

      /* Daily */

      svg4.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#ff073a99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['dailyconfirmed'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg4.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#ff073a')
          .attr('stroke', '#ff073a')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['dailyconfirmed'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });


      svg5.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#28a74599')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['dailyrecovered'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg5.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#28a745')
          .attr('stroke', '#28a745')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['dailyrecovered'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });


      svg6.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('cursor', 'pointer')
          .attr('stroke', '#6c757d99')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('cursor', 'pointer')
          .attr('d', d3.line()
              .x(function(d) {
                return x(new Date(d['date']+'2020'));
              })
              .y(function(d) {
                return y(d['dailydeceased'])-5;
              })
              .curve(d3.curveCardinal),
          );

      svg6.selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', '#6c757d')
          .attr('stroke', '#6c757d')
          .attr('r', 2)
          .attr('cursor', 'pointer')
          .attr('cx', function(d) {
            return x(new Date(d['date']+'2020'));
          })
          .attr('cy', function(d) {
            return y(d['dailydeceased'])-5;
          })
          .on('mouseover', (d, i) => {
            d3.select(d3.event.target).attr('r', '5');
            setDatapoint(d);
            setIndex(i);
          })
          .on('mouseout', (d) => {
            d3.select(d3.event.target).attr('r', '2');
          });
    };
  };

  return (
    <div className="TimeSeries-Parent">
      <div className="timeseries" style={{display: props.type===1 ? 'flex' : 'none'}}>

        <div className="svg-parent">
          <div className="stats">
            <h5>Confirmed {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totalconfirmed']}</h2>
              <h6>{data.length>0 ? data[index]['totalconfirmed'] - data[index-1]['totalconfirmed']>=0 ? '+'+(data[index]['totalconfirmed'] - data[index-1]['totalconfirmed']) : (data[index]['totalconfirmed'] - data[index-1]['totalconfirmed']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement1} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5>Recovered {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totalrecovered']}</h2>
              <h6>{data.length>0 ? data[index]['totalrecovered'] - data[index-1]['totalrecovered']>=0 ? '+'+(data[index]['totalrecovered'] - data[index-1]['totalrecovered']) : (data[index]['totalrecovered'] - data[index-1]['totalrecovered']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement2} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5>Deceased {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totaldeceased']}</h2>
              <h6>{data.length>0 ? data[index]['totaldeceased'] - data[index-1]['totaldeceased']>=0 ? '+'+(data[index]['totaldeceased'] - data[index-1]['totaldeceased']) : (data[index]['totaldeceased'] - data[index-1]['totaldeceased']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement3} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

      </div>

      <div className="timeseries" style={{display: props.type===2 ? 'flex' : 'none'}}>

        <div className="svg-parent">
          <div className="stats">
            <h5>Confirmed {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailyconfirmed']}</h2>
              <h6>{data.length>0 ? data[index]['dailyconfirmed'] - data[index-1]['dailyconfirmed']>=0 ? '+'+(data[index]['dailyconfirmed'] - data[index-1]['dailyconfirmed']) : (data[index]['dailyconfirmed'] - data[index-1]['dailyconfirmed']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement4} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5>Recovered {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailyrecovered']}</h2>
              <h6>{data.length>0 ? data[index]['dailyrecovered'] - data[index-1]['dailyrecovered']>=0 ? '+'+(data[index]['dailyrecovered'] - data[index-1]['dailyrecovered']) : (data[index]['dailyrecovered'] - data[index-1]['dailyrecovered']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement5} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5>Deceased {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailydeceased']}</h2>
              <h6>{data.length>0 ? data[index]['dailydeceased'] - data[index-1]['dailydeceased']>=0 ? '+'+(data[index]['dailydeceased'] - data[index-1]['dailydeceased']) : (data[index]['dailydeceased'] - data[index-1]['dailydeceased']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement6} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

      </div>
    </div>
  );
}

export default TimeSeries;
