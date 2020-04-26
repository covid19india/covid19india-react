import {defaultOptions, formatNumber} from './chart-defaults';
import ModalWrapper from './modal-wrapper';

import deepmerge from 'deepmerge';
import React from 'react';
import {Doughnut} from 'react-chartjs-2';

function GenderChart(props) {
  let male = 0;
  let female = 0;

  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  props.data.forEach((patient) => {
    if (patient.gender === 'M') {
      male++;
    } else if (patient.gender === 'F') {
      female++;
    }
  });

  const chartData = {
    datasets: [
      {
        data: [male, female],
        backgroundColor: ['#6497f3', '#ea6e9a'],
        label: 'Hola',
      },
    ],
    labels: ['Male', 'Female'],
  };

  const chartOptions = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'point',
      position: 'nearest',
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return formatNumber(currentValue) + ' (' + percentage + '%)';
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  });

  const getChart = () => {
    return <Doughnut data={chartData} options={chartOptions} />;
  };

  const getNote = () => {
    return `Sample size: ${formatNumber(male + female)} patients`;
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

export default GenderChart;
