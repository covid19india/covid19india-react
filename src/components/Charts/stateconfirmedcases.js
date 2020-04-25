import React from 'react';
import {Doughnut, defaults} from 'react-chartjs-2';

function StateConfirmedCases(props) {
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

  let unknown = 0;
  let Imported = 0;
  let Local = 0;

  if (props.rawData) {
    props.rawData.forEach((patient) => {
      if (props.data === 'TT') {
        if (patient.typeoftransmission == 'Imported') {
          Imported++;
        } else if (patient.typeoftransmission == 'Local') {
          Local++;
        } else {
          unknown++;
        }
      } else if (patient.statecode.toUpperCase() === props.data) {
        if (patient.typeoftransmission == 'Imported') {
          Imported++;
        } else if (patient.typeoftransmission == 'Local') {
          Local++;
        } else {
          unknown++;
        }
      }
    });
  }

  if (props.patients) {
    for (let i = 0; i < props.patients.length; i++) {
      if (props.patients[i].typeoftransmission === 'Imported') {
        Imported++;
      } else if (props.patients[i].typeoftransmission === 'Local') {
        Local++;
      } else if (props.patients[i].typeoftransmission === 'Unknown') {
        unknown++;
      } else if (props.patients[i].typeoftransmission === '') {
        unknown++;
      }
    }
  }

  const data = [Imported, Local, unknown];

  const chartData = {
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#ffd31d',
          '#00a8cc',
          '#005082',

          // '#000839',
          // '#ffa41b',
          // '#f1e7b6',
          // '#400082',
          // '#fe346e',
          // '#5a3f11',
          // '#9c5518',
        ],
        hoverBackgroundColor: ['#ff7272', '#f1e7b6', '#9c5518'],
      },
    ],
    labels: ['Imported', 'Local', 'TBD'],
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
      display: true,
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

  return (
    <div className="charts-header">
      <div className="chart-content doughnut">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default StateConfirmedCases;
