import React, {useState, useEffect, useRef} from 'react';
import {geoPath, geoMercator} from 'd3-geo';
import * as d3 from 'd3';
import * as topojson from 'topojson';

function ChoroplethMap(props) {
  const [rendered, setRendered] = useState(false);
  const [states, setStates] = useState(props.states);
  const [state, setState] = useState({});
  const [total, setTotal] = useState(0);
  const choroplethMap = useRef(null);

  useEffect(()=>{
    if (props.states.length>1 && choroplethMap.current) {
      const theMap = mapData(choroplethMap.current);
      setState(states[1]);
    }
  }, [total]);

  useEffect(()=>{
    let total = 0;
    for (let i=1; i<states.length; i++) {
      total+=parseInt(states[i].Confirmed);
    }
    setTotal(total);
  }, [states]);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  const handleMouseover = (name) => {
    states.map((state, index) => {
      if (state.State.toLowerCase()===name.toLowerCase()) {
        setState(state);
      }
    });
  };

  const mapData = (selector) => {
    const svg = d3.select(choroplethMap.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const unemployment = d3.map();

    const projection = d3.geoMercator()
        .center([78.9629, 22])
        .scale(window.innerWidth<=769 ? 600 : 900)
        .translate([width/2, height/2]);

    const path = d3.geoPath(projection);

    const x = d3.scaleLinear()
        .domain([1, 10])
        .range([window.innerWidth<=769 ? 1 : 1, window.innerWidth<=769 ? total : total]);

    const xViz = d3.scaleLinear()
        .domain([1, 10])
        .range([window.innerWidth<=769 ? 50*1.5 : 50*1.5, window.innerWidth<=769 ? (total+50)*1.5 : (total+50)*1.5]);

    const color = d3.scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeReds[9]);

    const g = svg.append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(0,40)');

    g.selectAll('rect')
        .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = xViz.domain()[0];
          if (d[1] == null) d[1] = xViz.domain()[1];
          return d;
        }))
        .enter().append('rect')
        .attr('height', 8)
        .attr('x', function(d) {
          return (xViz(d[0]));
        })
        .attr('width', function(d) {
          return xViz(d[1]) - xViz(d[0]);
        })
        .attr('fill', function(d) {
          return color(d[0]);
        });

    g.append('text')
        .attr('class', 'caption')
        .attr('x', xViz.range()[0]+50)
        .attr('y', -6)
        .attr('fill', '#000')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text('Distribution by State');

    g.call(d3.axisBottom(xViz)
        .tickSize(13)
        .tickFormat(function(x, i) {
          return i ? x*10 : x*10 + '%';
        })
        .tickValues(color.domain()))
        .select('.domain')
        .remove();

    const promises = [
      d3.json('/india_topo.json'),
    ];

    Promise.all(promises).then(ready);

    function ready([us]) {
      states.map((state, index) => {
        if (index!==0) {
          unemployment.set(state.State.toLowerCase(), parseInt(state.Confirmed));
        }
      });

      svg.append('g')
          .attr('class', 'states')
          .selectAll('path')
          .data(topojson.feature(us, us.objects.india).features)
          .enter().append('path')
          .attr('fill', function(d) {
            return d3.interpolateReds(d.confirmed = (unemployment.get(d.properties.NAME_1)/total));
          })
          .attr('d', path)
          .attr('pointer-events', 'all')
          .on('mouseover', (d) => {
            handleMouseover(d.properties.NAME_1);
          })
          .style('cursor', 'pointer')
          .append('title')
          .text(function(d) {
            return (d.confirmed*100).toFixed(2) + '% from ' + toTitleCase(d.properties.NAME_1);
          });

      svg.append('path')
          .attr('stroke', 'white')
          .attr('fill', 'none')
          .attr('stroke-width', 1)
          .attr('d', path(topojson.mesh(us, us.objects.india)));
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
    <div className="map">
      <svg className="fadeInUp" style={{animationDelay: '1.2s'}} width={window.innerWidth <= 769 ? window.innerWidth : 700} height="500" preserveAspectRatio="none" ref={choroplethMap}></svg>

      <div className="map-stats fadeInUp" style={{animationDelay: '1.5s'}}>

        <div className="heading state-heading"><b>{state.State}</b></div>

        <nav className="level">
          <div className="level-item">
            <div>
              <p className="heading">Confirmed</p>
              <p className="title">{state.Confirmed}</p>
            </div>
          </div>
          <div className="level-item">
            <div>
              <p className="heading">Active</p>
              <p className="title">{state.Active}</p>
            </div>
          </div>
          <div className="level-item">
            <div>
              <p className="heading">Recoveries</p>
              <p className="title">{state.Recovered}</p>
            </div>
          </div>
          <div className="level-item">
            <div>
              <p className="heading">Deaths</p>
              <p className="title">{state.Deaths}</p>
            </div>
          </div>
        </nav>


      </div>
    </div>
  );
}

export default ChoroplethMap;
