import React, {useState, useEffect, useRef, useCallback} from 'react';
import * as d3 from 'd3';

function Minigraph({timeseries}) {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const svgRef3 = useRef();
  const svgRef4 = useRef();

  useEffect(() => {
    setTimeSeriesData(timeseries.slice(timeseries.length - 20));
  }, [timeseries]);

  const graphData = useCallback((data) => {
    if (data.length <= 1) return 0;

    const margin = {top: 0, right: 10, bottom: 60, left: 0};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const svg1 = d3.select(svgRef1.current);
    const svg2 = d3.select(svgRef2.current);
    const svg3 = d3.select(svgRef3.current);
    const svg4 = d3.select(svgRef4.current);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, chartRight]);

    const svgArray = [svg1, svg2, svg3, svg4];
    const dataOrder = ['confirmed', 'active', 'recovered', 'deceased'];
    const colors = ['#ff073a', '#007bff', '#28a745', '#6c757d'];

    const extract = (d, s) => {
      if (s === 'confirmed') return d.dailyconfirmed;
      else if (s === 'active')
        return d.dailyconfirmed - d.dailyrecovered - d.dailydeceased;
      else if (s === 'recovered') return d.dailyrecovered;
      else if (s === 'deceased') return d.dailydeceased;
    };

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.dailyconfirmed)])
      .range([chartBottom, margin.top]);

    svgArray.forEach((svg, i) => {
      const type = dataOrder[i];
      const color = colors[i];

      const path = svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color + '99')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(extract(d, type)))
            .curve(d3.curveCardinal)
        );

      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .delay(500)
        .duration(2500)
        .attr('stroke-dashoffset', 0);

      svg
        .selectAll('.dot')
        .data(data.slice(data.length - 1))
        .enter()
        .append('circle')
        .attr('fill', color)
        .attr('stroke', color)
        .attr('r', 2)
        .attr('cursor', 'pointer')
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(extract(d, type)))
        .on('mouseover', (d) => {
          d3.select(d3.event.target).attr('r', '5');
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).attr('r', '2');
        })
        .style('opacity', 0)
        .transition()
        .delay(500)
        .duration(2500)
        .style('opacity', 1);
    });
  }, []);

  useEffect(() => {
    graphData(timeSeriesData);
  }, [timeSeriesData, graphData]);

  return (
    <div className="Minigraph">
      <div className="svg-parent fadeInUp" style={{animationDelay: '1.4s'}}>
        <svg
          ref={svgRef1}
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
          ref={svgRef2}
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
          ref={svgRef3}
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
          ref={svgRef4}
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
