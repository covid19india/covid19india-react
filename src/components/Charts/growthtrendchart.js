import {getStateName} from '../../utils/commonfunctions';

import moment from 'moment';
import React from 'react';
import {Line, defaults} from 'react-chartjs-2';
function GrowthTrendChart(props) {
  const dates = [];

  defaults.global.elements.line.fill = false;

  defaults.global.tooltips.intersect = false;
  defaults.global.tooltips.mode = 'nearest';
  defaults.global.tooltips.position = 'average';
  defaults.global.tooltips.backgroundColor = 'rgba(255, 255, 255, 0.6)';
  defaults.global.tooltips.displayColors = false;
  defaults.global.tooltips.borderColor = '#c62828';
  defaults.global.tooltips.borderWidth = 1;
  defaults.global.tooltips.titleFontColor = '#000';
  defaults.global.tooltips.bodyFontColor = '#000';
  defaults.global.tooltips.caretPadding = 4;
  defaults.global.tooltips.intersect = false;
  defaults.global.tooltips.mode = 'nearest';
  defaults.global.tooltips.position = 'nearest';

  defaults.global.legend.display = true;
  defaults.global.legend.position = 'bottom';

  defaults.global.hover.intersect = false;

  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  const statesData = new Map();
  const statesDailyData = new Map();

  props.data.forEach((data, index) => {
    if (data.status !== 'Confirmed') {
      return;
    }

    Object.keys(data).forEach((key) => {
      if (key === 'date') {
        dates.push(moment(data.date.trim(), 'DD MMM').utcOffset('+05:30'));
      }

      if (key === 'status' || key === 'date') {
        return;
      }

      const currentValue = data[key] !== '' ? parseInt(data[key]) : 0;

      if (currentValue === 0 && !statesData.has(key)) {
        return;
      }

      if (!statesData.has(key)) {
        statesData.set(key, []);
        statesDailyData.set(key, []);
      }
      const previousValue =
        statesData.get(key).length > 0
          ? parseInt(statesData.get(key)[statesData.get(key).length - 1].x)
          : 0;

      const stateData = statesDailyData.get(key);
      let weekSum = 0;
      for (let i = 1; i <= 7; ++i) {
        const idx = stateData.length - i;
        if (idx >= 0) {
          weekSum += stateData[idx];
        }
      }
      statesData.get(key).push({x: previousValue + currentValue, y: weekSum});
      statesDailyData.get(key).push(currentValue);
    });
  });

  const sortedMap = new Map(
    [...statesData.entries()].sort((a, b) => {
      return a[1][a[1].length - 1].x < b[1][b[1].length - 1].x ? 1 : -1;
    })
  );

  const colors = [
    '#ff073a',
    '#28a745',
    '#342ead',
    '#7D5BA6',
    '#DD7596',
    '#16c8f0',
    '#f67575',
    '#2b580c',
    '#9D44B5',
    '#91132d',
    '#6D9DC5',
    '#2b580c',
    '#6c757d',
    '#f67575',
    '#d4f8e8',
  ];

  let index = 0;
  const datasets = [];
  sortedMap.forEach((data, key) => {
    if (key === 'tt') {
      return;
    }

    if (index >= 10) {
      return;
    }

    datasets.push({
      data: statesData.get(key),
      label: getStateName(key),
      order: index,
      borderWidth: 1.0,
      borderCapStyle: 'round',
      borderColor: colors[index],
      pointBackgroundColor: colors[index],
      pointHoverRadius: 1.0,
    });

    index++;
  });

  const dataset = {
    datasets: datasets,
  };

  const options = {
    responsive: true,
    events: ['click', 'mousemove', 'mouseout', 'touchstart', 'touchmove'],
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        cubicInterpolationMode: 'monotone',
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 0,
        bottom: 20,
      },
    },
    scales: {
      yAxes: [
        {
          type: 'logarithmic',
          ticks: {
            beginAtZero: true,
            min: 1,
            max: 2000,
            precision: 0,
            callback: function (value, index, values) {
              return Number(value.toString());
            },
          },
          scaleLabel: {
            display: true,
            labelString: 'New Cases (since last 7 days)',
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
      xAxes: [
        {
          type: 'logarithmic',
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 2000,
            precision: 0,
            callback: function (value, index, values) {
              return Number(value.toString());
            },
          },
          scaleLabel: {
            display: true,
            labelString: 'Total Cases',
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
    },
  };

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Line data={dataset} options={options} />
      </div>
    </div>
  );
}

export default GrowthTrendChart;
