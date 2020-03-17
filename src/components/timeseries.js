import React, {useState, useEffect} from 'react';
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
    </div>
  );
}

export default TimeSeries;
