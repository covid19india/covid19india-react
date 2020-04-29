import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import {format, parse} from 'date-fns';
import deepmerge from 'deepmerge';
import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';

function DailyConfirmedChart(props) {
  const [range, setRange] = React.useState(31);
  let dates = [];
  let confirmed = [];
  let recovered = [];
  let deceased = [];

  if (!props.timeseries || props.timeseries.length === 0) {
    return <div></div>;
  }

  for (
    let i = range !== 31 ? props.timeseries.length - range : range;
    i < props.timeseries.length;
    i++
  ) {
    const data = props.timeseries[i];
    const date = parse(data.date, 'dd MMMM', new Date(2020, 0, 1));
    dates.push(format(date, 'dd MMM'));
    confirmed.push(data.dailyconfirmed);
    recovered.push(data.dailyrecovered);
    deceased.push(data.dailydeceased);
  }

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
        label: 'Confirmed',
        backgroundColor: '#ff6862',
      },
    ],
  };

  const options = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'index',
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
      <form
        onChange={(e) => {
          confirmed = [];
          recovered = [];
          deceased = [];
          dates = [];
          setRange(e.target.value);
          console.log(range);
        }}
        style={{display: 'inline'}}
      >
        <input type="radio" id="begin" name="range" value={31} defaultChecked />
        <label htmlFor="begin">Beginning</label>
        <input type="radio" id="6weeks" name="range" value={56} />
        <label htmlFor="6weeks">8 weeks</label>
        <input type="radio" id="6weeks" name="range" value={42} />
        <label htmlFor="6weeks">6 weeks</label>
        <input type="radio" id="4weeks" name="range" value={28} />
        <label htmlFor="4weeks">4 weeks</label>
      </form>
    </div>
  );
}

export default DailyConfirmedChart;
