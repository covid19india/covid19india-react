import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
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

  useEffect(()=>{
    if (props.timeseries.length>1) {
      setTimeseries(props.timeseries.slice(0, props.timeseries.length-1));
    }
  }, [props.timeseries.length]);

  useEffect(()=>{
    if (timeseries.length>1) {
      graphData(timeseries);
    }
  }, [timeseries.length]);

  useEffect(()=>{
    setMode(props.mode);
    setUpdate(update+1);
  }, [props.mode]);

  useEffect(()=>{
    if (update>0) {
      refreshGraphs(graphData);
    }
  }, [update]);

  const refreshGraphs = () => {
    const graphs = [graphElement1, graphElement2, graphElement3, graphElement4, graphElement5, graphElement6];
    for (let i=0; i<=graphs.length; i++) {
      if (i===graphs.length) {
        graphData(timeseries);
        return;
      } else d3.select(graphs[i].current).selectAll('*').remove();
    }
  };

  const graphData = (timeseries) => {
    const data = timeseries;
    setDatapoint(timeseries[timeseries.length-1]);
    setIndex(timeseries.length-1);

    const svg1 = d3.select(graphElement1.current);
    const margin = {top: 0, right: 20, bottom: 10, left: 20};
    const width = 650 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg2 = d3.select(graphElement2.current);
    const svg3 = d3.select(graphElement3.current);
    const svg4 = d3.select(graphElement4.current);
    const svg5 = d3.select(graphElement5.current);
    const svg6 = d3.select(graphElement6.current);

    const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) {
          return new Date(d['date']+'2020');
        }))
        .range([margin.left, width]);

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

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return +d['totalconfirmed'];
        })])
        .range([height, margin.top]);

    const y2 = d3.scaleLinear()

        .domain([0, d3.max(data, function(d) {
          return +d['totalrecovered'];
        })])
        .range([height, margin.top]);

    const y3 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return +d['totaldeceased'];
        })])
        .range([height, margin.top]);


    const y4 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return +d['dailyconfirmed'];
        })])
        .range([height, margin.top]);

    const y5 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return +d['dailyrecovered'];
        })])
        .range([height, margin.top]);

    const y6 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return +d['dailydeceased'];
        })])
        .range([height, margin.top]);

    /* Y-Axis */

    svg1.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(y1).tickFormat((tick) => {
          if (tick%100 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg2.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(mode ? y1 : y2).tickFormat((tick) => {
          if (tick%4 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg3.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(mode ? y1 : y3).tickFormat((tick) => {
          if (tick%100 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg4.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(mode ? y1 : y4).tickFormat((tick) => {
          if (tick%100 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg5.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(mode ? y1 : y5).tickFormat((tick) => {
          if (tick%2 !== 0 || tick%100 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg6.append('g')
        .attr('transform', `translate(${width}, ${0})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(mode ? y1 : y6).tickFormat((tick) => {
          if (Math.floor(tick) !== tick || tick%100 === 0) {
            return;
          }
          return tick;
        }))
        .selectAll('.tick text')
        .attr('transform', 'translate(40,0)');

    svg1.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#ff073a99')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              return y1(d['totalconfirmed'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg1.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#ff073a')
        .attr('stroke', '#ff073a')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          return y1(d['totalconfirmed'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });


    svg2.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#28a74599')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              if (mode) return y1(d['totalrecovered'])-5;
              else return y2(d['totalrecovered'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg2.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#28a745')
        .attr('stroke', '#28a745')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          if (mode) return y1(d['totalrecovered'])-5;
          return y2(d['totalrecovered'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });


    svg3.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('cursor', 'pointer')
        .attr('stroke', '#6c757d99')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              if (mode) return y1(d['totaldeceased']);
              return y3(d['totaldeceased'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg3.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#6c757d')
        .attr('stroke', '#6c757d')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          if (mode) return y1(d['totaldeceased'])-5;
          return y3(d['totaldeceased'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });

    /* Daily */

    svg4.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#ff073a99')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              if (mode) return y1(d['dailyconfirmed'])-5;
              return y4(d['dailyconfirmed'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg4.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#ff073a')
        .attr('stroke', '#ff073a')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          if (mode) return y1(d['dailyconfirmed'])-5;
          return y4(d['dailyconfirmed'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });


    svg5.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#28a74599')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              if (mode) return y1(d['dailyrecovered'])-5;
              return y5(d['dailyrecovered'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg5.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#28a745')
        .attr('stroke', '#28a745')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          if (mode) return y1(d['dailyrecovered'])-5;
          return y5(d['dailyrecovered'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });


    svg6.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('cursor', 'pointer')
        .attr('stroke', '#6c757d99')
        .attr('stroke-width', 5)
        .attr('cursor', 'pointer')
        .attr('cursor', 'pointer')
        .attr('d', d3.line()
            .x(function(d) {
              return x(new Date(d['date']+'2020'));
            })
            .y(function(d) {
              if (mode) return y1(d['dailydeceased'])-5;
              return y6(d['dailydeceased'])-5;
            })
            .curve(d3.curveCardinal),
        );

    svg6.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', '#6c757d')
        .attr('stroke', '#6c757d')
        .attr('r', 3)
        .attr('cursor', 'pointer')
        .attr('cx', function(d) {
          return x(new Date(d['date']+'2020'));
        })
        .attr('cy', function(d) {
          if (mode) return y1(d['dailydeceased'])-5;
          return y6(d['dailydeceased'])-5;
        })
        .on('mouseover', (d, i) => {
          d3.select(d3.event.target).attr('r', '5');
          setDatapoint(d);
          setIndex(i);
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '3');
        });
  };

  return (
    <div className="TimeSeries-Parent fadeInUp" style={{animationDelay: '1.7s'}}>
      <div className="timeseries" style={{display: props.type===1 ? 'flex' : 'none'}}>

        <div className="svg-parent">
          <div className="stats">
            <h5>Confirmed {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totalconfirmed']}</h2>
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['totalconfirmed'] - timeseries[index-1]['totalconfirmed']>=0 ? '+'+(timeseries[index]['totalconfirmed'] - timeseries[index-1]['totalconfirmed']) : (timeseries[index]['totalconfirmed'] - timeseries[index-1]['totalconfirmed']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement1} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5>Recovered {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totalrecovered']}</h2>
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['totalrecovered'] - timeseries[index-1]['totalrecovered']>=0 ? '+'+(timeseries[index]['totalrecovered'] - timeseries[index-1]['totalrecovered']) : (timeseries[index]['totalrecovered'] - timeseries[index-1]['totalrecovered']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement2} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5>Deceased <br/>{datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['totaldeceased']}</h2>
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['totaldeceased'] - timeseries[index-1]['totaldeceased']>=0 ? '+'+(timeseries[index]['totaldeceased'] - timeseries[index-1]['totaldeceased']) : (timeseries[index]['totaldeceased'] - timeseries[index-1]['totaldeceased']) : ''}</h6>
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
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['dailyconfirmed'] - timeseries[index-1]['dailyconfirmed']>=0 ? '+'+(timeseries[index]['dailyconfirmed'] - timeseries[index-1]['dailyconfirmed']) : (timeseries[index]['dailyconfirmed'] - timeseries[index-1]['dailyconfirmed']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement4} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-green">
          <div className="stats is-green">
            <h5>Recovered {datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailyrecovered']}</h2>
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['dailyrecovered'] - timeseries[index-1]['dailyrecovered']>=0 ? '+'+(timeseries[index]['dailyrecovered'] - timeseries[index-1]['dailyrecovered']) : (timeseries[index]['dailyrecovered'] - timeseries[index-1]['dailyrecovered']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement5} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

        <div className="svg-parent is-gray">
          <div className="stats is-gray">
            <h5>Deceased <br/>{datapoint['date']}</h5>
            <div className="stats-bottom">
              <h2>{datapoint['dailydeceased']}</h2>
              <h6>{timeseries.length>0 && index!==0 ? timeseries[index]['dailydeceased'] - timeseries[index-1]['dailydeceased']>=0 ? '+'+(timeseries[index]['dailydeceased'] - timeseries[index-1]['dailydeceased']) : (timeseries[index]['dailydeceased'] - timeseries[index-1]['dailydeceased']) : ''}</h6>
            </div>
          </div>
          <svg ref={graphElement6} width="650" height="100" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet"/>
        </div>

      </div>
    </div>
  );
}

export default TimeSeries;
