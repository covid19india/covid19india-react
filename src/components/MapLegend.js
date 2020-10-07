import {
  D3_TRANSITION_DURATION,
  MAP_LEGEND_HEIGHT,
  MAP_VIZS,
} from '../constants';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {capitalize, formatNumber} from '../utils/commonFunctions';

import {range, quantile} from 'd3-array';
import {axisRight, axisBottom} from 'd3-axis';
import {format} from 'd3-format';
import {interpolate, interpolateRound, quantize} from 'd3-interpolate';
import {scaleLinear, scaleOrdinal, scaleBand} from 'd3-scale';
import {select} from 'd3-selection';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';

function MapLegend({data, mapViz, mapScale, statistic}) {
  const {t} = useTranslation();

  const svgRef = useRef(null);
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    let {width, height} =
      dimensions || wrapperRef.current.getBoundingClientRect();

    if (!width || !height)
      ({width, height} = wrapperRef.current.getBoundingClientRect());

    if (!width || !height) return;

    if (mapViz === MAP_VIZS.BUBBLES) {
      const t = svg.transition().duration(D3_TRANSITION_DURATION);
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
      svg.selectAll('.axis > *:not(.axistext)').remove();
      svg.select('.axistext').text('');

      const domainMax = mapScale.domain()[1];

      const legend = svg
        .select('.circles')
        .attr('transform', `translate(48,40)`)
        .attr('text-anchor', 'middle');

      legend
        .selectAll('circle')
        .data([domainMax / 10, (domainMax * 2) / 5, domainMax])
        .join('circle')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .transition(t)
        .attr('cy', (d) => -mapScale(d))
        .attr('r', mapScale);

      const yScale = mapScale.copy().range([0, -2 * mapScale(domainMax)]);

      svg
        .select('.circleAxis')
        .attr('transform', `translate(48,50)`)
        .transition(t)
        .call(
          axisRight(yScale)
            .tickSize(0)
            .tickPadding(0)
            .tickValues([domainMax / 10, (domainMax * 2) / 5, domainMax])
            .tickFormat((num) => formatNumber(num, 'short'))
        )
        .selectAll('.tick text')
        .style('text-anchor', 'middle');

      svg.select('.circleAxis').call((g) => g.select('.domain').remove());
    } else {
      svg.call(() =>
        legend({
          svg: svg,
          color: mapScale,
          title: `${t(capitalize(statistic))} ${t('cases')}`,
          width: width,
          height: height,
          ticks: 5,
          tickFormat: function (d, i, n) {
            if (mapViz === MAP_VIZS.CHOROPLETH && !Number.isInteger(d)) return;
            if (i === n.length - 1) return formatNumber(d) + '+';
            return formatNumber(d);
          },
          marginLeft: 2,
          marginRight: 0,
        })
      );
    }
  }, [t, dimensions, mapScale, mapViz, statistic]);

  return (
    <div
      className="svg-parent maplegend"
      style={{height: MAP_LEGEND_HEIGHT}}
      ref={wrapperRef}
    >
      <svg id="legend" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
        <image className="ramp" />
        <g className="bars"></g>
        <g className="circles"></g>
        <g className="circleAxis"></g>
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
  svg.selectAll('.circleAxis > *').remove();
  const t = svg.transition().duration(D3_TRANSITION_DURATION);

  let tickAdjust = (g) => {
    const ticks = g.selectAll('.tick line');
    ticks.attr('y1', marginTop + marginBottom - height);
    // select(ticks.nodes()[ticks.size() - 1]).remove();
  };
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color
      .copy()
      .rangeRound(quantize(interpolate(marginLeft, width - marginRight), n));

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
        ramp(color.copy().domain(quantize(interpolate(0, 1), n))).toDataURL()
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
        .interpolator(interpolateRound(marginLeft, width - marginRight)),
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
        tickValues = range(n).map((i) => quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== 'function') {
        tickFormat = format(tickFormat === undefined ? ',f' : tickFormat);
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
        ? format(tickFormat)
        : tickFormat;

    x = scaleLinear()
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

    tickValues = range(-1, thresholds.length);
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
      x = scaleBand()
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
      const widthScale = scaleLinear()
        .domain([0, ordinalWeights.reduce((a, b) => a + b)])
        .rangeRound([0, width - marginLeft - marginRight]);

      const xPos = ordinalWeights.map((w, i) =>
        ordinalWeights
          .slice(0, i)
          .reduce((acc, w) => acc + widthScale(w), marginLeft)
      );

      x = scaleOrdinal().domain(color.domain()).range(xPos);

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
      axisBottom(x)
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
  const canvas = select('.color-scale').node();
  const context = ((canvas.width = n), (canvas.height = 1), canvas).getContext(
    '2d'
  );
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
