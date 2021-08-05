import {
  D3_TRANSITION_DURATION,
  MAP_DIMENSIONS,
  MAP_LEGEND_HEIGHT,
  MAP_VIZS,
  STATISTIC_CONFIGS,
} from '../constants';
import {formatNumber, spike} from '../utils/commonFunctions';

import {range, quantile} from 'd3-array';
import {axisRight, axisBottom} from 'd3-axis';
import {format} from 'd3-format';
import {interpolate, interpolateRound, quantize} from 'd3-interpolate';
import {scaleLinear, scaleOrdinal, scaleBand} from 'd3-scale';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useMeasure} from 'react-use';

function MapLegend({data, statistic, mapViz, mapScale}) {
  const {t} = useTranslation();
  const svgLegendRef = useRef(null);
  const svgLegendChoroRef = useRef(null);
  const [wrapperRef, {width}] = useMeasure();

  useEffect(() => {
    const t = transition().duration(D3_TRANSITION_DURATION);

    if (mapViz !== MAP_VIZS.CHOROPLETH) {
      const svg = select(svgLegendChoroRef.current);
      svg
        .select('.ramp')
        .transition(t)
        .attr('opacity', 0)
        .attr('display', 'none')
        .attr('xlink:href', null);

      svg
        .select('.bars')
        .selectAll('rect')
        .transition(t)
        .attr('opacity', 0)
        .remove();
      svg.selectAll('.axis > *:not(.axistext)').remove();
      svg.select('.axistext').text('');
    }

    if (mapViz !== MAP_VIZS.BUBBLE) {
      const svg = select(svgLegendRef.current);
      svg
        .select('.circles')
        .selectAll('circle')
        .transition(t)
        .attr('r', 0)
        .attr('cy', 0)
        .remove();
      svg.selectAll('.circle-axis > *').remove();
    }

    if (mapViz !== MAP_VIZS.SPIKES) {
      const svg = select(svgLegendRef.current);
      svg
        .select('.spikes')
        .call((g) =>
          g.selectAll('path').transition(t).attr('d', spike(0)).remove()
        )
        .call((g) => g.selectAll('text').remove())
        .transition(t)
        .selectAll('g')
        .remove();
      svg.selectAll('.spike-axis > *').remove();
    }
  }, [mapViz]);

  useEffect(() => {
    if (!width) return;

    const statisticConfig = STATISTIC_CONFIGS[statistic];
    const zoom = width / MAP_DIMENSIONS[0];

    if (mapViz === MAP_VIZS.BUBBLE) {
      const svg = select(svgLegendRef.current);

      const [, domainMax] = mapScale.domain();

      const legend = svg
        .select('.circles')
        .attr('transform', `translate(48,40)`)
        .attr('text-anchor', 'middle');

      const legendRadius = [0.1, 0.4, 1].map((d) => d * domainMax);

      legend
        .selectAll('circle')
        .data(legendRadius)
        .join('circle')
        .attr('fill', 'none')
        .attr('stroke', statisticConfig.color + '70')
        .transition(t)
        .attr('cy', (d) => -mapScale(d))
        .attr('r', (d) => mapScale(d));

      const yScale = mapScale.copy().range([0, -2 * mapScale(domainMax)]);

      svg
        .select('.circle-axis')
        .attr('transform', `translate(48,50)`)
        .transition(t)
        .call(
          axisRight(yScale)
            .tickSize(0)
            .tickPadding(0)
            .tickValues(legendRadius)
            .tickFormat((num) =>
              formatNumber(
                num,
                statisticConfig.format === 'long'
                  ? 'short'
                  : statisticConfig.format
              )
            )
        )
        .selectAll('.tick text')
        .style('text-anchor', 'middle')
        .attr('font-size', 10 / zoom);

      svg.select('.circle-axis').call((g) => g.select('.domain').remove());
    } else if (mapViz === MAP_VIZS.SPIKE) {
      const svg = select(svgLegendRef.current);
      const ticks = mapScale.ticks(3).slice(1).reverse();

      const gap = 28 / zoom;

      svg
        .select('.spikes')
        .attr('transform', `translate(32,24)`)
        .selectAll('g')
        .data(ticks)
        .join((enter) =>
          enter.append('g').call((g) =>
            g
              .append('path')
              .attr('fill-opacity', 0.3)
              .attr('d', (d) => spike(0))
          )
        )
        .attr('transform', (d, i) => `translate(${i * gap},0)`)
        .call((g) =>
          g
            .select('path')
            .transition(t)
            .attr('d', (d) => spike(mapScale(d)))
            .attr('fill', statisticConfig.color + '70')
            .attr('stroke', statisticConfig.color + '70')
        );

      const xScale = mapScale.copy().range([gap * ticks.length, 0]);
      svg
        .select('.spike-axis')
        .attr('transform', `translate(32,32)`)
        .transition(t)
        .call(
          axisBottom(xScale)
            .tickSize(0)
            .tickPadding(0)
            .tickValues(ticks)
            .tickFormat((num) =>
              formatNumber(
                num,
                statisticConfig.format === 'long'
                  ? 'short'
                  : statisticConfig.format
              )
            )
        )
        .selectAll('.tick text')
        .style('text-anchor', 'middle')
        .attr('font-size', 10 / zoom);

      svg.select('.spike-axis').call((g) => g.select('.domain').remove());
    } else {
      const svg = select(svgLegendChoroRef.current);
      svg.call(() =>
        legend({
          svg: svg,
          color: mapScale,
          width: width,
          height: MAP_LEGEND_HEIGHT,
          ticks: 5,
          tickFormat: function (d, i, n) {
            if (statisticConfig?.mapConfig?.colorScale) {
              return d;
            } else if (mapViz === MAP_VIZS.CHOROPLETH && !Number.isInteger(d)) {
              return '';
            } else if (i === n.length - 1) {
              return formatNumber(d, statisticConfig.format) + '+';
            } else {
              return formatNumber(d, statisticConfig.format);
            }
          },
          marginLeft: 2,
          marginRight: 0,
        })
      );
      svg.attr('class', statisticConfig?.mapConfig?.colorScale ? 'zone' : '');
    }
  }, [t, width, statistic, mapScale, mapViz]);

  return (
    <div
      className="svg-parent maplegend"
      ref={wrapperRef}
      style={{height: 2 * MAP_LEGEND_HEIGHT}}
    >
      <svg
        id="legend"
        preserveAspectRatio="xMinYMid meet"
        ref={svgLegendRef}
        viewBox={`0 0 ${MAP_DIMENSIONS[0]} ${MAP_LEGEND_HEIGHT}`}
      >
        <g className="circles"></g>
        <g className="spikes"></g>
        <g className="circle-axis"></g>
        <g className="spike-axis"></g>
        <g className="axis">
          <text className="axistext" />
        </g>
      </svg>
      <svg
        id="legend-choro"
        preserveAspectRatio="xMinYMid meet"
        ref={svgLegendChoroRef}
      >
        <image className="ramp" preserveAspectRatio="none" />
        <g className="bars"></g>
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
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom)
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
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom)
      .attr('xlink:href', ramp(color.interpolator()).toDataURL())
      .attr('display', 'visible')
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
        .domain(color.domain().filter((d) => d))
        .rangeRound([marginLeft, width - marginRight]);
      svg
        .select('.bars')
        .selectAll('rect')
        .data(color.domain().filter((d) => d))
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
