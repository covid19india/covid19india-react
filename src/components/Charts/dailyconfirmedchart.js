import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import {format, parse} from 'date-fns';
import deepmerge from 'deepmerge';
import React from 'react';
import {Line, defaults} from 'react-chartjs-2';

function DailyConfirmedChart(props) {
  const dates = [];
  const confirmed = [];
  const recovered = [];
  const deceased = [];

  if (!props.timeseries || props.timeseries.length === 0) {
    return <div></div>;
  }

  props.timeseries.forEach((data, index) => {
    if (index >= 31) {
      const date = parse(data.date, 'dd MMMM', new Date(2020, 0, 1));
      dates.push(format(date, 'dd MMM'));
      confirmed.push(data.dailyconfirmed);
      recovered.push(data.dailyrecovered);
      deceased.push(data.dailydeceased);
    }
  });

  const barDataSet = {
    labels: dates,
    datasets: [
      {
        borderWidth: 2,
        data: confirmed,
        borderCapStyle: 'round',
        pointBackgroundColor: '#ff6862',
        label: 'Confirmed',
        borderColor: '#ff6862',
        pointHoverRadius: 2,
      },
      {
        borderWidth: 2,
        data: recovered,
        borderCapStyle: 'round',
        pointBackgroundColor: '#7ebf80',
        label: 'Recovered',
        borderColor: '#7ebf80',
        pointHoverRadius: 2,
      },
      {
        borderWidth: 2,
        data: deceased,
        borderCapStyle: 'round',
        pointBackgroundColor: '#6c757d',
        label: 'Deceased',
        borderColor: '#6c757d',
        pointHoverRadius: 2,
      },
    ],
  };

  const options = deepmerge(defaultOptions, {
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.1,
      },
    },
    legend: {
      display: true,
      reverse: true,
      labels: {
        usePointStyle: true, // Required to change pointstyle to 'rectRounded' from 'circle'
        generateLabels: (chart) => {
          const labels = defaults.global.legend.labels.generateLabels(chart);
          labels.forEach((label) => {
            label.pointStyle = 'rectRounded';
          });
          return labels;
        },
      },
    },
    scales: {
      xAxes: [deepmerge(xAxisDefaults, {})],
      yAxes: [
        deepmerge(yAxisDefaults, {
          ticks: {
            callback: (value) => formatNumber(value),
          },
        }),
      ],
    },
  });

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Line data={barDataSet} options={options} />
      </div>
    </div>
  );
}

export default DailyConfirmedChart;
