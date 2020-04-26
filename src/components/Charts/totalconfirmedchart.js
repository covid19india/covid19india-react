import {defaultOptions, xAxisDefaults, yAxisDefaults} from './chart-defaults';

import {parse} from 'date-fns';
import deepmerge from 'deepmerge';
import React from 'react';
import {Line} from 'react-chartjs-2';

function TotalConfirmedChart(props) {
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
      dates.push(date);
      confirmed.push(data.totalconfirmed);
      recovered.push(data.totalrecovered);
      deceased.push(data.totaldeceased);
    }
  });

  const dataset = {
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
    scales: {
      yAxes: [
        deepmerge(yAxisDefaults, {
          scaleLabel: {
            display: false,
            labelString: 'Total Cases',
          },
        }),
      ],
      xAxes: [
        deepmerge(xAxisDefaults, {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM DD',
            stepSize: 7,
            displayFormats: {
              millisecond: 'MMM DD',
              second: 'MMM DD',
              minute: 'MMM DD',
              hour: 'MMM DD',
              day: 'MMM DD',
              week: 'MMM DD',
              month: 'MMM DD',
              quarter: 'MMM DD',
              year: 'MMM DD',
            },
          },
        }),
      ],
    },
  });

  if (props.mode) {
    options.scales.yAxes = [
      {
        type: 'logarithmic',
        ticks: {
          min: 0,
          max: 10000,
          callback: function (value, index, values) {
            if (value === 10000) return '10000';
            if (value === 2000) return '2500';
            if (value === 500) return '500';
            if (value === 100) return '100';
            if (value === 20) return '25';
            if (value === 5) return '5';
            if (value === 0) return '0';
            return null;
          },
        },
        scaleLabel: {
          display: false,
          labelString: 'Total Cases',
        },
      },
    ];
  }

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Line data={dataset} options={options} />
      </div>
    </div>
  );
}

export default TotalConfirmedChart;
