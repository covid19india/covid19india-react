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

  const ages = Array(10).fill(0);
  let unknown = 0;
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
