import React from 'react';
import * as d3 from 'd3';
import {Line, Bar, defaults} from 'react-chartjs-2';
import moment from 'moment';
import PropTypes from 'prop-types';

function Charts(props) {
  const dates = [];
  const confirmed = [];
  const recovered = [];
  const deceased = [];

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

  if (!props.timeseries || props.timeseries.length == 0) {
    return <div></div>;
  }

  props.timeseries.forEach((data, index) => {
    if (index >= 31) {
      dates.push(moment(data.date.trim(), 'DD MMM').format('DD MMM'));
      if (props.graphOption == 1) {
        confirmed.push(data.totalconfirmed);
        recovered.push(data.totalrecovered);
        deceased.push(data.totaldeceased);
      } else {
        confirmed.push(data.dailyconfirmed);
        recovered.push(data.dailyrecovered);
        deceased.push(data.dailydeceased);
      }
    }
  });

  dates.splice(-1, 1);

  const dataset = {
    labels: dates,
    datasets: [
      {
        borderWidth: 4,
        data: confirmed,
        borderCapStyle: 'round',
        pointBackgroundColor: '#ff073a',
        label: 'Confirmed',
        borderColor: '#ff073a',
      },
      {
        borderWidth: 4,
        data: recovered,
        borderCapStyle: 'round',
        pointBackgroundColor: '#28a745',
        label: 'Recovered',
        borderColor: '#28a745',
      },
      {
        borderWidth: 4,
        data: deceased,
        borderCapStyle: 'round',
        pointBackgroundColor: '#6c757d',
        label: 'Deceased',
        borderColor: '#6c757d',
      },
    ],
  };

  const barDataSet = {
    labels: dates,
    datasets: [
      {
        data: recovered,
        label: 'Recovered',
        backgroundColor: '#28a745',
      },
      {
        data: deceased,
        label: 'Deceased',
        backgroundColor: '#6c757d',
      },
      {
        data: confirmed,
        label: 'Confirmed',
        backgroundColor: '#ff073a',
      },
    ],
  };

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
      line: {
        tension: 0.2,
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
      yAxes: [
        {
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
        },
      ],
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM DD',
            stepSize: 7,
            displayFormats: {
              millisecond: 'MMM DD',
              second: 'MMM DD',
              minute: 'MMM DD',
              hour: 'MMM DD',
              day: 'MMM DD',
              week: 'MMM DD',
              month: 'MMM DD',
              quarter: 'MMM DD',
              year: 'MMM DD',
            },
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
    },
  };

  console.log(props.mode, props.graphOption);
  if (props.mode) {
    options.scales.yAxes = [
      {
        type: 'logarithmic',
        ticks: {
          min: 0,
          max: 10000,
          callback: function(value, index, values) {
            if (value === 10000) return '10000';
            if (value === 2000) return '2500';
            if (value === 500) return '500';
            if (value === 100) return '100';
            if (value === 20) return '25';
            if (value === 5) return '5';
            if (value === 0) return '0';
            return null;
          },
        },
        scaleLabel: {
          display: true,
          labelString: 'Total Cases',
        },
      },
    ];
  }

  return (
    <div className="charts-header fadeInUp" style={{animationDelay: '1.2s'}}>
      {props.graphOption == 1 && <Line data={dataset} options={options} />}
      {props.graphOption == 2 && <Bar data={barDataSet} options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              color: 'rgba(0, 0, 0, 0)',
            },
          }],
          yAxes: [{
            stacked: true,
          }],
        },
      }}/> }

    </div>
  );
}

Charts.propTypes = {
  timeseries: PropTypes.array,
  graphOption: PropTypes.number,
  mode: PropTypes.bool,
};

export default Charts;
