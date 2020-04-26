import {defaultOptions, xAxisDefaults, formatNumber} from './chart-defaults';
import ModalWrapper from './modal-wrapper';

import deepmerge from 'deepmerge';
import React from 'react';
import {Bar} from 'react-chartjs-2';

function AgeChart(props) {
  const ages = Array(10).fill(0);
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  props.data.forEach((patient) => {
    if (patient.agebracket) {
      const age = parseInt(patient.agebracket);
      for (let i = 0; i < 10; i++) {
        if (age > i * 10 && age <= (i + 1) * 10) {
          ages[i]++;
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
        data: ages,
        label: 'Cases',
        backgroundColor: '#bc79c9',
      },
    ],
  };

  const chartOptions = deepmerge(defaultOptions, {
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
        {
          stacked: true,
        },
      ],
    },
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
    },
  });

  const sampleSize = ages.reduce((a, b) => a + b, 0);

  const getChart = () => {
    return <Bar data={chartData} options={chartOptions} />;
  };

  const getNote = () => {
    return `Sample Size: ${formatNumber(sampleSize)} patients`;
  };

  return (
    <div className="charts-header">
      <ModalWrapper
        content={getChart()}
        title={props.title}
        footer={getNote()}
      />
      <div className="chart-title">{props.title}</div>
      <div className="chart-content doughnut">{getChart()}</div>
      <div className="chart-note">{getNote()}</div>
    </div>
  );
}

export default AgeChart;
