import * as d3 from 'd3';
import React, {useState, useEffect, useRef, useCallback} from 'react';

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

    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const svg1 = d3.select(svgRef1.current);
    const svg2 = d3.select(svgRef2.current);
    const svg3 = d3.select(svgRef3.current);
    const svg4 = d3.select(svgRef4.current);

    data.forEach((d) => {
      d['dailyactive'] = d.dailyconfirmed - d.dailyrecovered - d.dailydeceased;
    });

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, chartRight]);

    const svgArray = [svg1, svg2, svg3, svg4];
    const dataTypes = [
      'dailyconfirmed',
      'dailyactive',
      'dailyrecovered',
      'dailydeceased',
    ];
    const colors = ['#ff073a', '#007bff', '#28a745', '#6c757d'];

    const dailyMin = d3.min(data, (d) => d.dailyactive);
    const dailyMax = d3.max(data, (d) =>
      Math.max(d.dailyconfirmed, d.dailyrecovered, d.dailydeceased)
    );
    const domainMinMax = Math.max(-dailyMin, dailyMax);

    const yScale = d3
      .scaleLinear()
      .domain([-domainMinMax, domainMinMax])
      .range([chartBottom, margin.top]);

    svgArray.forEach((svg, i) => {
      const type = dataTypes[i];
      const color = colors[i];

      const path = svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color + '99')
        .attr('stroke-width', 2.5)
        .attr('cursor', 'pointer')
        .attr(
          'd',
          d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d[type]))
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
        .attr('cy', (d) => yScale(d[type]))
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
          height="75"
          viewBox="0 0 100 75"
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
          height="75"
          viewBox="0 0 100 75"
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
          height="75"
          viewBox="0 0 100 75"
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
          height="75"
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
}

export default React.memo(Minigraph);
