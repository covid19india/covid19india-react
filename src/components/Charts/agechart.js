import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';

function AgeChart(props) {
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

  const ages = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let unknown = 0;
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  props.data.forEach((patient) => {
    if (patient.agebracket) {
      const age = parseInt(patient.agebracket);
      if (age >= 0 && age <= 10) {
        ages[0]++;
      }
      if (age > 10 && age <= 20) {
        ages[1]++;
      }
      if (age > 20 && age <= 30) {
        ages[2]++;
      }
      if (age > 30 && age <= 40) {
        ages[3]++;
      }
      if (age > 40 && age <= 50) {
        ages[4]++;
      }
      if (age > 50 && age <= 60) {
        ages[5]++;
      }
      if (age > 60 && age <= 70) {
        ages[6]++;
      }
      if (age > 70 && age <= 80) {
        ages[7]++;
      }
      if (age > 80 && age <= 90) {
        ages[8]++;
      }
      if (age > 90 && age <= 100) {
        ages[9]++;
      }
    } else {
      unknown++;
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
        backgroundColor: '#ff073a',
      },
    ],
  };

  const chartOptions = {
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 0,
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
      <div className="chart-content doughnut">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="chart-note">*Awaiting details for {unknown} patients</div>
    </div>
  );
}

export default AgeChart;
