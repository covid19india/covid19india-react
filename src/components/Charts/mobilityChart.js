import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import moment from 'moment';

function MobilityChart(props) {
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

  const datapointToShow = 40;
  const dates = [];
  const values = [];
  const reversedPropsArray = props.data ? props.data.reverse() : [];

  reversedPropsArray.forEach((dataPoint, index) => {
    if (index >= reversedPropsArray.length - datapointToShow) {
      dates.push(moment(dataPoint.date).format('DD MMM'));
      values.push(dataPoint.value);
    }
  });

  const chartData = {
    labels: dates,
    datasets: [
      {
        data: values,
        label: 'comparative value',
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
      <div className="chart-note">*Based on Google&apos;s data</div>
    </div>
  );
}

export default MobilityChart;
