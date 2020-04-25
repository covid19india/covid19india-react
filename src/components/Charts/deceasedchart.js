import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import deepmerge from 'deepmerge';
import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';

function DeceasedChart(props) {
  const female = Array(10).fill(0);
  const male = Array(10).fill(0);
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  props.data.forEach((patient) => {
    let isDeceased = false;
    let isMale = false;
    let isFemale = false;
    if (patient.patientstatus === 'Deceased') {
      isDeceased = true;
    }
    if (patient.gender === 'M') {
      isMale = true;
    }
    if (patient.gender === 'F') {
      isFemale = true;
    }
    if (patient.agebracket) {
      const age = parseInt(patient.agebracket);
      for (let i = 0; i < 10; i++) {
        if (age > i * 10 && age <= (i + 1) * 10 && isDeceased && isFemale) {
          female[i]++;
        }
        if (age > i * 10 && age <= (i + 1) * 10 && isDeceased && isMale) {
          male[i]++;
        }
      }
    }
  });

  const chartData = {
    labels: [
      '0-10',
      '11-20',
      '21-30',
      '31-40',
      '41-50',
      '51-60',
      '61-70',
      '71-80',
      '81-90',
      '91-100',
    ],
    datasets: [
      {
        data: female,
        label: 'Deceased Female',
        backgroundColor: '#ea6e9a',
      },

      {
        data: male,
        label: 'Deceased Male',
        backgroundColor: '#6497f3',
      },
    ],
  };

  const chartOptions = deepmerge(defaultOptions, {
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
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
    },
  });

  const sampleSize =
    male.reduce((a, b) => a + b, 0) + female.reduce((a, b) => a + b, 0);

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content doughnut">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="chart-note">
        Sample Size: {formatNumber(sampleSize)} patients
      </div>
    </div>
  );
}

export default DeceasedChart;
