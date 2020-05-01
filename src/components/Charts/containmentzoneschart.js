import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import {format, parse} from 'date-fns';

import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import deepmerge from 'deepmerge';

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    if(property === 'dateannounced'){
      return function (a, b) {
        let fmtDate = new Date()
        let aprop=parse(a[property], 'dd/MM/yyyy', fmtDate);
        let bprop=parse(b[property], 'dd/MM/yyyy', fmtDate);
        if(sortOrder === -1) {
          return bprop-aprop;
        } else {
          return aprop-bprop;
        }
      }
    } else {
      return function (a, b) {
        if(sortOrder === -1) {
          return b[property].localeCompare(a[property]);
        } else {
          return a[property].localeCompare(b[property]);
        }
      }
    }
}

function ContainmentZonesChart(props) {
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  const runDate = new Date()
  const oneDay = 24 * 60 * 60 * 1000;
  const totalDistricts = 720;
  const limitToOrangeDays = 14;
  const limitToGreenDays = 28;
  const patients = props.data;
  patients.sort(dynamicSort("dateannounced"));

  let redcasemap = new Map();
  let orangecasemap = new Map();
  let plotDates = [];
  let red = [];
  let orange = [];
  let green = [];

  for (let i = 0; i < patients.length; i++){
    let plotDate = parse(patients[i].dateannounced, 'dd/MM/yyyy', runDate);
    if (redcasemap[patients[i].detecteddistrict]) {
      // update latest for already red;
      redcasemap[patients[i].detecteddistrict] = patients[i].dateannounced;
    } else if (orangecasemap[patients[i].detecteddistrict]) {
      redcasemap[patients[i].detecteddistrict] = patients[i].dateannounced;
      // few oranges went back to red;
      delete orangecasemap[patients[i].detecteddistrict];
    } else {
      // new red;
      redcasemap[patients[i].detecteddistrict] = patients[i].dateannounced;
    }
    if (i > 0 && patients[i-1].dateannounced !== patients[i].dateannounced){

      // moving old reds to orage
      Object.keys(redcasemap).forEach((dist) => {
        if (dist) {
          let eventDate  = parse(redcasemap[dist], 'dd/MM/yyyy', plotDate);
          let diffDays = Math.round((plotDate - eventDate) / oneDay);
          if (limitToOrangeDays <= diffDays && diffDays < limitToGreenDays){
            orangecasemap[dist] = redcasemap[dist];
            delete redcasemap[dist];
          }
        }
      });

      // moving old oranges to green
      Object.keys(orangecasemap).forEach((dist) => {
        if (dist) {
          let eventDate  = parse(orangecasemap[dist], 'dd/MM/yyyy', plotDate);
          const diffDays = Math.round((plotDate - eventDate) / oneDay);
          if (diffDays >= limitToGreenDays) {
            delete orangecasemap[dist];
          }
        }
      });

      let redcasecount = Object.keys(redcasemap).length;
      let orangecasecount = Object.keys(orangecasemap).length;
      plotDates.push(format(plotDate, 'dd MMM'));
      red.push(redcasecount);
      orange.push(orangecasecount);
      green.push(totalDistricts - redcasecount - orangecasecount);
    }
  }

  const barDataSet = {
    labels: plotDates,
    datasets: [
      {
        data: red,
        label: 'red',
        backgroundColor: '#FF0000',
      },
      {
        data: orange,
        label: 'orange',
        backgroundColor: '#FF4500',
      },
      {
        data: green,
        label: 'green',
        backgroundColor: '#008000',
      },
    ],
  };

  const options = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'index',
    },
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
  });

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Bar data={barDataSet} options={options} />
      </div>
    </div>
  );
}

export default ContainmentZonesChart;
