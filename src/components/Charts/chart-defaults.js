import deepmerge from 'deepmerge';
import {defaults} from 'react-chartjs-2';

defaults.global = deepmerge(defaults.global, {
  defaultFontFamily: 'Archia',
  elements: {
    line: {
      fill: false,
    },
    point: {
      pointStyle: 'rectRounded',
    },
  },
  tooltips: {
    intersect: false,
    mode: 'nearest',
    position: 'average',
    displayColors: false,
    borderWidth: 0,
    titleSpacing: 4,
    titleMarginBottom: 8,
    bodySpacing: 5,
    cornerRadius: 3,
    xPadding: 6,
    yPadding: 6,
    caretSize: 0,
  },
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      padding: 15,
      usePointStyle: true,
    },
  },
  hover: {
    intersect: false,
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 20,
    },
  },
});

const formatNumber = (number) =>
  'Intl' in window ? new Intl.NumberFormat('en-IN').format(number) : number;

const defaultOptions = {
  responsive: true,
  events: [
    'click',
    'mousemove',
    'mouseout',
    'touchstart',
    'touchmove',
    'touchend',
  ],
  maintainAspectRatio: false,
  tooltips: {
    backgroundColor: 'rgba(20,20,20,0.9)',
    titleFontColor: 'rgba(255,255,255, 0.9)',
    bodyFontColor: 'rgba(255,255,255, 0.9)',
    caretSize: 0,
    borderWidth: 0,
    mode: 'index',
    callbacks: {
      label: function (tooltipItem, data) {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += formatNumber(Math.round(tooltipItem.yLabel * 100) / 100);
        return label;
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.1,
    },
  },
};

const yAxisDefaults = {
  type: 'linear',
  ticks: {
    beginAtZero: true,
    max: undefined,
    precision: 0,
    callback: (value) => formatNumber(value),
  },
  gridLines: {
    color: 'rgba(0, 0, 0, 0.07)',
    drawBorder: false,
    tickMarkLength: 6,
  },
};

const xAxisDefaults = {
  gridLines: {
    color: 'rgba(0, 0, 0, 0)',
  },
};

export {defaultOptions, formatNumber, yAxisDefaults, xAxisDefaults};
