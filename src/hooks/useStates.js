import React, {useState, useCallback} from 'react';
import axios from 'axios';

const useStates = () => {
  const [states, setStates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [error, setError] = useState(null);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [didFetchStates, setDidFetchedStates] = useState(false);
  const fetchStates = useCallback(async () => {
    try {
      const [response, stateDistrictWiseResponse] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
      ]);
      setStates(response.data.statewise);
      setTimeseries(response.data.cases_time_series);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setDeltas(response.data.key_values[0]);
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setDidFetchedStates(true);
    } catch (err) {
      setDidFetchedStates(true);
      setError(err);
    }
  });
  return {
    fetchStates,

    states,
    lastUpdated,
    timeseries,
    deltas,
    stateDistrictWiseData,
    error,
    didFetchStates,
  };
};

export default useStates;
