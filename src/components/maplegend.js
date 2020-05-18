import {MAP_STATISTICS} from '../constants';
import {capitalizeAll, formatNumber} from '../utils/commonfunctions';
import {useResizeObserver} from '../utils/hooks';

import * as d3 from 'd3';
import React, {useEffect, useRef} from 'react';

function MapLegend({mapScale, statistic, mapStatistic, mapOption}) {
  const svgRef = useRef(null);
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const {width, height} =
      dimensions || wrapperRef.current.getBoundingClientRect();

    if (mapStatistic === MAP_STATISTICS.ZONE) {
      svg.call(() =>
        legend({
          svg: svg,
          color: mapScale,
          width: width,
          height: height,
          tickValues: [],
          marginLeft: 2,
          marginRight: 20,
          ordinalWeights: Object.values(statistic),
        })
      );
    } else if (mapStatistic === MAP_STATISTICS.HOTSPOTS) {
      const t = svg.transition().duration(500);
      svg
        .select('.ramp')
        .transition(t)
        .attr('opacity', 0)
        .attr('xlink:href', null);

      svg
        .select('.bars')
        .selectAll('rect')
        .transition(t)
        .attr('opacity', 0)
        .remove();
      svg.selectAll('.axis > *').remove();

      const maxRadius = mapScale.domain()[1];

      const legend = svg
        .select('.circles')
        .attr('transform', `translate(48,40)`)
        .attr('text-anchor', 'middle');

      legend
        .selectAll('circle')
        .data([maxRadius / 10, (maxRadius * 2) / 5, maxRadius])
        .join('circle')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .transition(t)
        .attr('cy', (d) => -mapScale(d))
        .attr('r', mapScale);

      legend
        .selectAll('text')
        .data([maxRadius / 10, (maxRadius * 2) / 5, maxRadius])
        .join('text')
        .attr('dy', '1.3em')
        .transition(t)
        .attr('y', (d) => -2 * mapScale(d))
        .text(d3.format('.1s'));
    } else {
      svg.call(() =>
        legend({
          svg: svg,
          color: mapScale,
          title:
            capitalizeAll(mapOption) +
            (mapStatistic === MAP_STATISTICS.PER_MILLION
              ? ' cases per million'
              : ' cases'),
          width: width,
          height: height,
          ticks: 5,
          tickFormat: function (d, i, n) {
            if (mapStatistic === MAP_STATISTICS.TOTAL && !Number.isInteger(d))
              return;
            if (i === n.length - 1) return formatNumber(d) + '+';
            return formatNumber(d);
          },
          marginLeft: 2,
          marginRight: 20,
        })
      );
    }
    svg.attr('class', mapStatistic === MAP_STATISTICS.ZONE ? 'zone' : '');
  });

  return (
    <div
      className="svg-parent maplegend fadeInUp"
      style={{animationDelay: '2.5s', height: 50}}
      ref={wrapperRef}
    >
      <svg id="legend" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
        <image className="ramp" />
        <g className="bars"></g>
        <g className="circles"></g>
        <g className="axis">
          <text className="axistext" />
        </g>
      </svg>
      <canvas
        className="color-scale"
        style={{position: 'absolute', height: 0}}
      />
    </div>
  );
}

export default MapLegend;

function legend({
  svg,
  color,
  title,
  tickSize = 6,
  width = 320,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues,
  ordinalWeights,
} = {}) {
  svg.selectAll('.circles > *').remove();
  const t = svg.transition().duration(500);

  let tickAdjust = (g) => {
    const ticks = g.selectAll('.tick line');
    ticks.attr('y1', marginTop + marginBottom - height);
    // d3.select(ticks.nodes()[ticks.size() - 1]).remove();
  };
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color
      .copy()
      .rangeRound(
        d3.quantize(d3.interpolate(marginLeft, width - marginRight), n)
      );

    svg
      .select('.ramp')
      .attr('class', 'ramp')
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom)
      .attr('preserveAspectRatio', 'none')
      .attr(
        'xlink:href',
        ramp(
          color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))
        ).toDataURL()
      );
  }

  // Sequential
  else if (color.interpolator) {
    svg
      .select('.bars')
      .selectAll('rect')
      .transition(t)
      .attr('opacity', 0)
      .remove();

    x = Object.assign(
      color
        .copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      {
        range() {
          return [marginLeft, width - marginRight];
        },
      }
    );

    svg
      .select('.ramp')
      .attr('class', 'ramp')
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom)
      .attr('preserveAspectRatio', 'none')
      .attr('xlink:href', ramp(color.interpolator()).toDataURL())
      .transition(t)
      .attr('opacity', 1);

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3
          .range(n)
          .map((i) => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== 'function') {
        tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds = color.thresholds
      ? color.thresholds() // scaleQuantize
      : color.quantiles
      ? color.quantiles() // scaleQuantile
      : color.domain(); // scaleThreshold

    const thresholdFormat =
      tickFormat === undefined
        ? (d) => d
        : typeof tickFormat === 'string'
        ? d3.format(tickFormat)
        : tickFormat;

    x = d3
      .scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([marginLeft, width - marginRight]);

    svg
      .append('g')
      .selectAll('rect')
      .data(color.range())
      .join('rect')
      .attr('x', (d, i) => x(i - 1))
      .attr('y', marginTop)
      .attr('width', (d, i) => x(i) - x(i - 1))
      .attr('height', height - marginTop - marginBottom)
      .attr('fill', (d) => d);

    tickValues = d3.range(-1, thresholds.length);
    tickFormat = (i) => {
      if (i === -1) return thresholdFormat(1);
      else if (i === thresholds.length - 1) return;
      else if (i === thresholds.length - 2)
        return thresholdFormat(thresholds[i] + '+', i);
      return thresholdFormat(thresholds[i], i);
    };
  }

  // Ordinal
  else {
    svg
      .select('.ramp')
      .transition(t)
      .attr('opacity', 0)
      .attr('xlink:href', null);
    if (!ordinalWeights) {
      x = d3
        .scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);
      svg
        .selectAll('rect')
        .data(color.domain())
        .join('rect')
        .attr('x', x)
        .attr('y', marginTop)
        .attr('width', Math.max(0, x.bandwidth() - 1))
        .attr('height', height - marginTop - marginBottom)
        .attr('fill', color);
    } else {
      const widthScale = d3
        .scaleLinear()
        .domain([0, ordinalWeights.reduce((a, b) => a + b)])
        .rangeRound([0, width - marginLeft - marginRight]);

      const xPos = ordinalWeights.map((w, i) =>
        ordinalWeights
          .slice(0, i)
          .reduce((acc, w) => acc + widthScale(w), marginLeft)
      );

      x = d3.scaleOrdinal().domain(color.domain()).range(xPos);

      svg
        .select('.bars')
        .selectAll('rect')
        .data(color.domain())
        .join((enter) =>
          enter
            .append('rect')
            .attr('x', x)
            .attr('width', (d, i) => widthScale(ordinalWeights[i]))
        )
        .attr('y', marginTop)
        .attr('height', height - marginTop - marginBottom)
        .attr('fill', color)
        .transition(t)
        .attr('x', x)
        .attr('width', (d, i) => widthScale(ordinalWeights[i]))
        .attr('opacity', 1);
    }

    tickAdjust = () => {};
  }

  svg
    .select('.axis')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .transition(t)
    .attr('class', 'axis')
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues)
    )
    .on('start', () => {
      svg.call(tickAdjust).call((svg) => svg.select('.domain').remove());
    })
    .call((g) =>
      g
        .select('.axistext')
        .attr('class', 'axistext')
        .attr('x', marginLeft)
        .attr('y', marginTop + marginBottom - height - 6)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(title)
    );

  return svg.node();
}

function ramp(color, n = 256) {
  // const canvas = document.createElement('canvas');
  const canvas = d3.select('.color-scale').node();
  const context = ((canvas.width = n), (canvas.height = 1), canvas).getContext(
    '2d'
  );
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
