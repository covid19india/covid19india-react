import {defaultOptions, xAxisDefaults, yAxisDefaults} from './chart-defaults';

import {getStateName} from '../../utils/commonfunctions';

import {parse} from 'date-fns';
import deepmerge from 'deepmerge';
import React from 'react';
import {Line} from 'react-chartjs-2';

function AllStatesChart(props) {
  const dates = [];
  const chartReference = React.createRef();

  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  const statesData = new Map();

  props.data.forEach((data) => {
    if (data.status !== 'Confirmed') {
      return;
    }

    Object.keys(data).forEach((key) => {
      if (key === 'date') {
        const date = parse(data.date, 'dd-MMM-yy', new Date());
        dates.push(date);
      }

      if (key === 'status' || key === 'date') {
        return;
      }

      if (!statesData.has(key)) {
        statesData.set(key, []);
      }
      const previousValue =
        statesData.get(key).length > 0
          ? parseInt(statesData.get(key)[statesData.get(key).length - 1])
          : 0;
      const currentValue = data[key] !== '' ? parseInt(data[key]) : 0;
      statesData.get(key).push(previousValue + currentValue);
    });
  });

  const sortedMap = new Map(
    [...statesData.entries()].sort((a, b) => {
      return a[1][a[1].length - 1] < b[1][b[1].length - 1] ? 1 : -1;
    })
  );

  const colors = [
    '#718af0',
    '#7dd6fa',
    '#59b3aa',
    '#9bc26b',
    '#e5d22f',
    '#ffb041',
    '#ff8a66',
    '#db6b8f',
    '#bd66cc',
    '#8e8e8e',
  ];

  let index = 0;
  const datasets = [];
  sortedMap.forEach((data, key) => {
    if (key === 'tt') {
      return;
    }

    if (index >= 10) {
      return;
    }

    datasets.push({
      borderWidth: 2,
      data: statesData.get(key),
      borderCapStyle: 'round',
      pointBackgroundColor: colors[index],
      label: getStateName(key),
      borderColor: colors[index],
      pointHoverRadius: 0.5,
    });

    index++;
  });

  const dataset = {
    labels: dates,
    datasets: datasets,
  };

  const options = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'index',
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0,
      },
    },
    legend: {
      labels: {
        boxWidth: 20,
        fontSize: 11,
      },
    },
    scales: {
      yAxes: [
        deepmerge(yAxisDefaults, {
          type: 'linear',
          ticks: {
            beginAtZero: true,
            max: undefined,
            precision: 0,
          },
          scaleLabel: {
            display: false,
            labelString: 'Total Cases',
          },
        }),
      ],
      xAxes: [
        deepmerge(xAxisDefaults, {
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
        }),
      ],
    },
  });

  function toggleSelection() {
    // Get reference of chartInstance and update it
    const ci = chartReference.current.chartInstance;
    for (let i = 0; i < ci.data.datasets.length; i++) {
      const meta = ci.getDatasetMeta(i);
      meta.hidden =
        meta.hidden === null
          ? !chartReference.current.chartInstance.data.datasets[i].hidden
          : null;
    }
    ci.update();
  }

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Line data={dataset} options={options} ref={chartReference} />
      </div>
      <div className="chart-note" style={{marginTop: '0px', height: '30px'}}>
        <button onClick={toggleSelection}>Toggle Selection</button>
      </div>
    </div>
  );
}

export default AllStatesChart;
