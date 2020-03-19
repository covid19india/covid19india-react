import React, {useState, useEffect} from 'react';
import {appleStock} from '@vx/mock-data';
import {scaleTime, scaleLinear} from '@vx/scale';
import {AxisLeft, AxisBottom} from '@vx/axis';
import {extent, max} from 'd3-array';
import axios from 'axios';
import {LinePath, AreaClosed} from '@vx/shape';
import {curveMonotoneX} from '@vx/curve';
import {Group} from '@vx/group';

const width = 750;
const height = 400;

const xConfirmed = (d) => new Date(d.Date+'2020');
const yConfirmed = (d) => d['Total Confirmed'];

const xRecovered = (d) => new Date(d.Date+'2020');
const yRecovered = (d) => d['Total Recovered'];

const xDeceased = (d) => new Date(d.Date+'2020');
const yDeceased = (d) => d['Total Deceased'];

const margin = {
  top: 10,
  bottom: 60,
  left: 80,
  right: 0,
};

const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

function TimeSeries(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, [data.length]);

  const getData = () => {
    axios.get('https://api.steinhq.com/v1/storages/5e6fd170b88d3d04ae081593/cases_time_series')
        .then((response) => {
          response.data.pop();
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, xConfirmed),
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, yConfirmed)],
  });

  return (
    <div className="TimeSeries">

      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>

          <LinePath
            data={data}
            x={(d) => xScale(xConfirmed(d))}
            y={(d) => yScale(yConfirmed(d))}
            stroke={'#DC3545'}
            strokeWidth={3}
            curve={curveMonotoneX}
          />

          <LinePath
            data={data}
            x={(d) => xScale(xRecovered(d))}
            y={(d) => yScale(yRecovered(d))}
            stroke={'#28A745'}
            strokeWidth={3}
            curve={curveMonotoneX}
          />

          <LinePath
            data={data}
            x={(d) => xScale(xDeceased(d))}
            y={(d) => yScale(yDeceased(d))}
            stroke={'#6C757D'}
            strokeWidth={3}
            curve={curveMonotoneX}
          />

          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            label={'Number of People'}
            stroke={'#424242'}
            strokeWidth={3}
            tickTextFill={'#424242'}
          />

          <AxisBottom
            scale={xScale}
            top={yMax}
            label={'Dates'}
            stroke={'#424242'}
            strokeWidth={3}
            tickTextFill={'#424242'}
          />

        </Group>
      </svg>

    </div>
  );
}

export default TimeSeries;
