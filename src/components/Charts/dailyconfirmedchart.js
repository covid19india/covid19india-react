import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import deepmerge from 'deepmerge';
import moment from 'moment';
import React from 'react';
import {Bar} from 'react-chartjs-2';

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
      dates.push(
        moment(data.date.trim(), 'DD MMM').utcOffset('+05:30').format('DD MMM')
      );
      confirmed.push(data.dailyconfirmed);
      recovered.push(data.dailyrecovered);
      deceased.push(data.dailydeceased);
    }
  });

  const barDataSet = {
    labels: dates,
    datasets: [
      {
        data: recovered,
        label: 'Recovered',
        backgroundColor: '#7ebf80',
      },
      {
        data: deceased,
        label: 'Deceased',
        backgroundColor: '#6c757d',
      },
      {
        data: confirmed,
        label: 'confirmed',
        backgroundColor: '#ff6862',
      },
    ],
  };

  const options = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'index',
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        deepmerge(xAxisDefaults, {
          stacked: true,
        }),
      ],
      yAxes: [
        deepmerge(yAxisDefaults, {
          stacked: true,
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
        <Bar data={barDataSet} options={options} />
      </div>
    </div>
  );
}

export default DailyConfirmedChart;
