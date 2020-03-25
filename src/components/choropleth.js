import React, {useState, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {legendColor} from 'd3-svg-legend';
import * as topojson from 'topojson';

function ChoroplethMap(props) {
  const [rendered, setRendered] = useState(false);
  const [states, setStates] = useState(props.states);
  const [state, setState] = useState({});
  const [statistic, setStatistic] = useState({});
  const [index, setIndex] = useState(1);
  const choroplethMap = useRef(null);

  useEffect(()=>{
    if (props.states.length>1 && choroplethMap.current) {
      mapData(choroplethMap.current);
      setState(states[1]);
    }
  }, [statistic]);

  useEffect(()=>{
    if (states.length > 1) {
      let total = 0;
      let maxConfirmed = parseInt(states[1].confirmed);
      let minConfirmed = parseInt(states[1].confirmed);
      for (let i=1; i<states.length; i++) {
        total+=parseInt(states[i].confirmed);
        if (parseInt(states[i].confirmed) > parseInt(maxConfirmed)) maxConfirmed = parseInt(states[i].confirmed);
        if (parseInt(states[i].confirmed) < parseInt(minConfirmed)) minConfirmed = parseInt(states[i].confirmed);
      }
      setStatistic({
        total: total,
        maxConfirmed: maxConfirmed,
        minConfirmed: minConfirmed,
      });
    }
  }, [states.length]);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  const handleMouseover = (name) => {
    states.map((state, index) => {
      if (state.state.toLowerCase()===name.toLowerCase()) {
        setState(state);
        setIndex(index);
      }
    });
  };

  const mapData = (selector) => {
    const svg = d3.select(selector);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const unemployment = d3.map();

    const projection = d3.geoMercator()
        .center([78.9, 19])
        .scale(1000)
        .translate([width/2, height/2]);

    const path = d3.geoPath(projection);

    // Colorbar
    const maxInterpolation = 0.8;

    function label({i, genLength, generatedLabels, labelDelimiter}) {
      if (i === genLength - 1) {
        const n = Math.floor(generatedLabels[i]);
        return `${n}+`;
      } else {
        const n1 = 1 + Math.floor(generatedLabels[i]);
        const n2 = Math.floor(generatedLabels[i+1]);
        return `${n1} - ${n2}`;
      }
    }

    const color = d3.scaleSequential(d3.interpolateReds)
        .domain([0, statistic.maxConfirmed / maxInterpolation]);

    svg.append('g')
        .attr('class', 'legendLinear')
        .attr('transform', 'translate(1, 450)');

    const numCells = 6;
    const delta = Math.floor(statistic.maxConfirmed / (numCells - 1));
    const cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

    const legendLinear = legendColor()
        .shapeWidth(50)
        .cells(cells)
        .titleWidth(3)
        .labels(label)
        .title('Confirmed Cases')
        .orient('vertical')
        .scale(color);

    svg.select('.legendLinear')
        .call(legendLinear);


    const promises = [
      d3.json('/india.json'),
    ];

    Promise.all(promises).then(ready);

    function ready([india]) {
      states.map((state, index) => {
        unemployment.set(state.state.toLowerCase(), state.confirmed);
      });

      svg.append('g')
          .attr('class', 'states')
          .selectAll('path')
          .data(topojson.feature(india, india.objects.india).features)
          .enter().append('path')
          .attr('fill', function(d) {
            const n = unemployment.get(d.properties.ST_NM.toLowerCase());
            const color = (n == 0) ? '#ffffff' : d3.interpolateReds(maxInterpolation * n/statistic.maxConfirmed);
            return color;
          })
          .attr('d', path)
          .attr('pointer-events', 'all')
          .on('mouseenter', (d) => {
            handleMouseover(d.properties.ST_NM);
            const target = d3.event.target;
            d3.select(target.parentNode.appendChild(target)).attr('stroke', '#ff073a').attr('stroke-width', 2);
          })
          .on('mouseleave', (d) => {
            const n = unemployment.get(d.properties.ST_NM.toLowerCase());
            const target = d3.event.target;
            const color = (n == 0) ? '#ffffff' : d3.interpolateReds(maxInterpolation * n/statistic.maxConfirmed);
            d3.select(target).attr('fill', color).attr('stroke', 'None');
          })
          .style('cursor', 'pointer')
          .append('title')
          .text(function(d) {
            return parseFloat(100*(unemployment.get(d.properties.ST_NM.toLowerCase())/statistic.total)).toFixed(2) + '% from ' + toTitleCase(d.properties.ST_NM);
          });

      svg.append('path')
          .attr('stroke', '#ff073a20')
          .attr('fill', 'none')
          .attr('stroke-width', 2)
          .attr('d', path(topojson.mesh(india, india.objects.india)));
    };
  };

  const toTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  return (
    <div className="ChoroplethMap fadeInUp" style={{animationDelay: '1.2s'}}>
      <h1 className="header">Statistics by State</h1>
      <h6 className="header">{window.innerWidth <=769 ? 'Tap' : 'Hover'} over a state for more details</h6>
      <div className="svg-parent">
        <svg id="chart" width="650" height={window.innerWidth <= 479 ? 650: 750} viewBox={`0 0 650 ${window.innerWidth <= 479 ? 650: 750}`} preserveAspectRatio="xMidYMid meet" ref={choroplethMap}></svg>
      </div>

      <div className="map-stats">
        <h4>{state.state}</h4>

        <div className="stats">
          <h5>Confirmed</h5>
          <div className="stats-bottom">
            <h1>{state.confirmed}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-blue">
          <h5>Active</h5>
          <div className="stats-bottom">
            <h1>{state.active}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-green">
          <h5>Recovered</h5>
          <div className="stats-bottom">
            <h1>{state.recovered}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div className="stats is-gray">
          <h5>Deceased</h5>
          <div className="stats-bottom">
            <h1>{state.deaths}</h1>
            <h6>{}</h6>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ChoroplethMap;
