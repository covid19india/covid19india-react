import React from 'react';
import {Doughnut, defaults} from 'react-chartjs-2';

function StateChart(props) {
  defaults.global.tooltips.intersect = false;
  defaults.global.tooltips.mode = 'nearest';
  defaults.global.tooltips.position = 'average';
  defaults.global.tooltips.backgroundColor = 'rgba(255, 255, 255, 0.8)';
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

  const stateNames = [];
  const stateCases = [];
  let otherStateCases = 0;
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  props.data.forEach((state, index) => {
    if (index === 0 || state.confirmed <= 0) {
      return;
    }
    if (index <= 15) {
      stateNames.push(state.state);
      stateCases.push(state.confirmed);
    } else {
      otherStateCases += parseInt(state.confirmed);
    }
  });

  stateNames.push('Others');
  stateCases.push(otherStateCases);

  const chartData = {
    datasets: [
      {
        data: stateCases,
        backgroundColor: [
          '#ff7272',
          '#ffb385',
          '#fae7cb',
          '#ffd31d',
          '#00a8cc',
          '#005082',
          '#000839',
          '#ffa41b',
          '#f1e7b6',
          '#400082',
          '#fe346e',
          '#5a3f11',
          '#9c5518',
          '#f67575',
          '#d4f8e8',
          '#1eb2a6',
        ],
      },
    ],
    labels: stateNames,
  };

  const chartOptions = {
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
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

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content doughnut">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default StateChart;
