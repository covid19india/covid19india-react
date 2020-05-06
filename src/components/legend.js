/* Source: https://observablehq.com/@d3/color-legend */

import * as d3 from 'd3';

function legend({
  color,
  title,
  tickSize = 6,
  width = 320,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  svg,
  ticks = width / 64,
  tickFormat,
  tickValues,
  ordinalWeights,
} = {}) {
  if (!svg)
    svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('overflow', 'visible')
      .style('display', 'block');

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
    svg.selectAll('rect').transition(t).attr('opacity', 0);

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

export default legend;
