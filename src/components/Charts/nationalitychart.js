import {formatNumber} from './chart-defaults';

import React from 'react';
import {Doughnut} from 'react-chartjs-2';

function NationalityChart(props) {
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  const nationality = {};

  props.data.forEach((patient) => {
    if (!patient.nationality) {
      return;
    }
    if (!nationality.hasOwnProperty(patient.nationality.toLowerCase())) {
      nationality[patient.nationality.toLowerCase()] = 0;
    }
    nationality[patient.nationality.toLowerCase()]++;
  });

  // delete nationality.india;
  const data = [];
  const labels = [];

  Object.keys(nationality).forEach((country) => {
    if (country) {
      labels.push(country.toUpperCase());
      data.push(nationality[country]);
    }
  });

  const chartData = {
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#ff8a66',
          '#718af0',
          '#7dd6fa',
          '#59b3aa',
          '#9bc26b',
          '#e5d22f',
          '#ffb041',
          '#db6b8f',
          '#bd66cc',
          '#8e8e8e',
        ],
      },
    ],
    labels: labels,
  };

  const chartOptions = {
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 0,
        bottom: 20,
      },
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'point',
      events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return currentValue + ' (' + percentage + '%)';
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  };

  const sampleSize = data.reduce((a, b) => a + b, 0);

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content doughnut">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      <div className="chart-note">
        Sample size: {formatNumber(sampleSize)} patients
      </div>
    </div>
  );
}

export default NationalityChart;
