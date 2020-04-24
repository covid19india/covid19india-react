import {defaultOptions, xAxisDefaults, yAxisDefaults} from './chart-defaults';

import {colorCodes} from '../../constants';
import {getStateName} from '../../utils/commonfunctions';

import deepmerge from 'deepmerge';
import moment from 'moment';
import React from 'react';
import {Line} from 'react-chartjs-2';

function AllStatesChart(props) {
  const dates = [];
  const [chartFilter, setChartFilter] = React.useState('top-10');

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
        dates.push(moment(data.date.trim(), 'DD MMM'));
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

  let index = 0;
  const datasets = [];
  sortedMap.forEach((data, key) => {
    if (key === 'tt') {
      return;
    }

    datasets.push({
      borderWidth: 2,
      data: statesData.get(key),
      borderCapStyle: 'round',
      pointBackgroundColor: colorCodes[index],
      label: getStateName(key),
      borderColor: colorCodes[index],
      pointHoverRadius: 0.5,
    });

    index++;
  });

  const dataset = {
    labels: dates,
    datasets:
      chartFilter === 'top-10'
        ? datasets.splice(0, 10)
        : chartFilter === '10-20'
        ? datasets.splice(10, 10)
        : datasets.splice(20, datasets.length),
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

  function handleFilterChange(value) {
    setChartFilter(value);
  }

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Line data={dataset} options={options} ref={chartReference} />
      </div>
      <div className="chart-note" style={{marginTop: '0px', height: '30px'}}>
        <input
          type="radio"
          id="top-10"
          name="chartFilter"
          checked={chartFilter === 'top-10'}
          value="top-10"
          onClick={() => handleFilterChange('top-10')}
          style={{margin: '8px'}}
        />
        <label htmlFor="top-10">Top 10</label>{' '}
        <input
          type="radio"
          id="10-20"
          name="chartFilter"
          checked={chartFilter === '10-20'}
          value="10-20"
          onClick={() => handleFilterChange('10-20')}
          style={{margin: '8px'}}
        />
        <label htmlFor="10-20">10 - 20 </label>
        <input
          type="radio"
          id="20-37"
          name="chartFilter"
          checked={chartFilter === '20-37'}
          value="20-37"
          onClick={() => handleFilterChange('20-37')}
          style={{margin: '8px'}}
        />
        <label htmlFor="20-37">20 - 37 </label>
        <button onClick={toggleSelection} style={{margin: '8px'}}>
          Toggle Selection
        </button>
      </div>
    </div>
  );
}

export default AllStatesChart;
