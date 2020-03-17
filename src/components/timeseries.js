import React, {useState, useEffect} from 'react';
import {Charts, ChartContainer, ChartRow, YAxis, LineChart} from 'react-timeseries-charts';
import axios from 'axios';

function TimeSeries(props) {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(()=>{
    if (fetched===false) {
      getTimeSeries();
    }
  }, [fetched]);

  const getTimeSeries = () => {
    axios.get('https://api.steinhq.com/v1/storages/5e6fd8b1b88d3d04ae081598/cases_time_series')
        .then((response)=>{
          setData(response.data);
          setFetched(true);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <div className="">
      <ChartContainer timeRange={series1.timerange()} width={800}>
        <ChartRow height="200">
          <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
          <Charts>
            <LineChart axis="axis1" series={series1}/>
          </Charts>
          <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
        </ChartRow>
      </ChartContainer>
    </div>
  );
}

export default TimeSeries;
