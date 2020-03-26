import React from 'react';
import * as d3 from 'd3';
import {Line, defaults} from 'react-chartjs-2';
import moment from 'moment';

function Charts(props) {
  const dates = [];
  const confirmed = [];
  const recovered = [];
  const deceased = [];

  if (!props.timeseries || props.timeseries.length == 0) {
    return (<div></div>);
  }

  props.timeseries.forEach((data, index) => {
    dates.push(moment(data.date.trim(), 'DD MMM'));

    if (props.graphOption == 1) {
      confirmed.push(data.totalconfirmed);
      recovered.push(data.totalrecovered);
      deceased.push(data.totaldeceased);
    } else {
      confirmed.push(data.dailyconfirmed);
      recovered.push(data.dailyrecovered);
      deceased.push(data.dailydeceased);
    }
  });

  dates.splice(-1, 1);

  const dataset = {
    labels: dates,
    datasets: [{
      borderWidth: 5,
      data: confirmed,
      borderCapStyle: 'round',
      pointBackgroundColor: '#ff073a',
      label: 'Confirmed',
      borderColor: '#ff073a',
    }, {
      borderWidth: 5,
      data: recovered,
      borderCapStyle: 'round',
      pointBackgroundColor: '#28a745',
      label: 'Recovered',
      borderColor: '#28a745',
    }, {
      borderWidth: 5,
      data: deceased,
      borderCapStyle: 'round',
      pointBackgroundColor: '#6c757d',
      label: 'Deceased',
      borderColor: '#6c757d',
    }],
  };

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


  defaults.global.legend.display = true;
  defaults.global.legend.position = 'bottom';

  defaults.global.title.display=false;
  defaults.global.title.padding=35;
  defaults.global.title.fontSize=15;
  defaults.global.hover.intersect = false;


  defaults.global.tooltips.intersect = false;
  defaults.global.tooltips.mode = 'nearest';
  defaults.global.tooltips.position = 'nearest';
  defaults.global.title.display=false;
  defaults.global.title.padding=35;
  defaults.global.title.fontSize=15;
  defaults.global.elements.line.tension=0.3;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      yAxes: [{
        type: 'linear',
        ticks: {
          beginAtZero: true,
          max: undefined,
          precision: 0,
        },
        scaleLabel: {
          display: true,
          labelString: 'Total Cases',
        },

      }], xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM DD',
          stepSize: 7,
          displayFormats: {
            'millisecond': 'MMM DD',
            'second': 'MMM DD',
            'minute': 'MMM DD',
            'hour': 'MMM DD',
            'day': 'MMM DD',
            'week': 'MMM DD',
            'month': 'MMM DD',
            'quarter': 'MMM DD',
            'year': 'MMM DD',
          },
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)',
        },
      }],
    },
  };


  console.log(props.mode, props.graphOption);
  if (props.mode) {
    options.scales.yAxes = [{
      type: 'logarithmic',
      ticks: {
        min: 0,
        max: 10000,
        callback: function(value, index, values) {
          if (value === 10000) return '10000';
          if (value === 2000) return '2000';
          if (value === 500) return '500';
          if (value === 100) return '100';
          if (value === 20) return '20';
          if (value === 5) return '5';
          if (value === 0) return '0';
          return null;
        },
      },
    }];
  }


  return (
    <div className="charts-header fadeInUp" style={{animationDelay: '1.2s'}} >
      <Line data = { dataset } options={ options } />
    </div>
  );
}

export default Charts;
