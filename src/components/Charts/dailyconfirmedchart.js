import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import moment from 'moment';

function DailyConfirmedChart(props) {
  const dates = [];
  const confirmed = [];
  const recovered = [];
  const deceased = [];

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

  if (!props.timeseries || props.timeseries.length === 0) {
    return <div></div>;
  }

  props.timeseries.forEach((data, index) => {
    if (index >= 31) {
      dates.push(moment(data.date.trim(), 'DD MMM').format('DD MMM'));
      confirmed.push(data.dailyconfirmed);
      recovered.push(data.dailyrecovered);
      deceased.push(data.dailydeceased);
    }
  });

  const barDataSet = {
    labels: dates,
    datasets: [
      {
        data: confirmed,
        label: 'New Cases',
        borderWidth: 1,
        borderColor: '#007bff',
        fill: true,
        backgroundColor: 'rgba(0,123,255,0.8)',
      },
      {
        data: recovered,
        label: 'Recovered',
        borderWidth: 1,
        borderColor: '#28a745',
        fill: true,
        backgroundColor: 'rgba(40,167,69,0.8)',
      },
      {
        data: deceased,
        label: 'Deceased',
        borderWidth: 1,
        borderColor: '#404a54',
        fill: true,
        backgroundColor: 'rgba(64,74,84,0.9)',
      },
    ],
  };

  const options = {
    responsive: true,
    tooltips: {
      mode: 'index',
    },
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
    maintainAspectRatio: false,
    legend: {
      display: true,
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
      xAxes: [
        {
          stacked: true,
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

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
