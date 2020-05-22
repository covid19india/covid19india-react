import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import Search from './search';
import Table from './table';
import TimeSeriesExplorer from './timeseriesexplorer';
import Updates from './updates';

import {STATE_CODES_REVERSE} from '../constants';
import {
  mergeTimeseries,
  preprocessTimeseries,
  parseStateTimeseries,
  parseStateTestData,
  parseStateTestTimeseries,
  parseTotalTestTimeseries,
  parseDistrictZones,
} from '../utils/commonfunctions';

import axios from 'axios';
import React, {useState, useCallback, useMemo, Suspense} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {useEffectOnce, useLocalStorage} from 'react-use';
import useSWR from 'swr';

const fetcher = (url) => axios(url).then((response) => response.data);

function Home(props) {
  const [states, setStates] = useState(null);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState(null);
  const [districtZones, setDistrictZones] = useState(null);
  const [stateTestData, setStateTestData] = useState(null);
  const [timeseries, setTimeseries] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    state: 'Total',
  });
  const [showUpdates, setShowUpdates] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('confirmed');

  const [lastViewedLog, setLastViewedLog] = useLocalStorage(
    'lastViewedLog',
    null
  );
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);

  const {data} = useSWR('http://localhost:3001/db', fetcher, {
    suspense: true,
    refreshInterval: 5000,
  });

  // const {data} = useSWR(
  //   'https://api.covid19india.org/v2/data.min.json',
  //   fetcher,
  //   {
  //     suspense: true,
  //     refreshInterval: 5000,
  //   }
  // );

  const Bell = useMemo(
    () => (
      <Icon.Bell
        onClick={() => {
          setShowUpdates(!showUpdates);
          setNewUpdate(false);
        }}
      />
    ),
    [setNewUpdate, showUpdates]
  );

  const BellOff = useMemo(
    () => (
      <Icon.BellOff
        onClick={() => {
          setShowUpdates(!showUpdates);
        }}
      />
    ),
    [showUpdates]
  );

  useEffectOnce(() => {
    getStates();
  });

  useEffectOnce(() => {
    axios
      .get('https://api.covid19india.org/updatelog/log.json')
      .then((response) => {
        const lastTimestamp = response.data
          .slice()
          .reverse()[0]
          .timestamp.toString();
        if (lastTimestamp !== lastViewedLog) {
          setNewUpdate(true);
          setLastViewedLog(lastTimestamp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const getStates = async () => {
    try {
      const [
        {data: statesDailyResponse},
        {data: zonesResponse},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/zones.json'),
      ]);

      const [
        {data},
        {data: stateDistrictWiseResponse},
        {data: stateTestData},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);

      setStates(data.statewise);
      setDistrictZones(parseDistrictZones(zonesResponse.zones));

      const ts = parseStateTimeseries(statesDailyResponse);
      ts['TT'] = preprocessTimeseries(data.cases_time_series);
      // Testing data timeseries
      const testTs = parseStateTestTimeseries(stateTestData.states_tested_data);
      testTs['TT'] = parseTotalTestTimeseries(data.tested);
      // Merge
      const tsMerged = mergeTimeseries(ts, testTs);
      setTimeseries(tsMerged);

      const testData = parseStateTestData(stateTestData.states_tested_data);
      const totalTest = data.tested[data.tested.length - 1];
      testData['Total'] = {
        source: totalTest.source,
        totaltested: totalTest.totalsamplestested,
        updatedon: totalTest.updatetimestamp.split(' ')[0],
      };
      setStateTestData(testData);

      setStateDistrictWiseData(stateDistrictWiseResponse);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = useCallback((state) => {
    if (!state) return setRegionHighlighted(null);
    setRegionHighlighted({state: state.state});
  }, []);

  const onHighlightDistrict = useCallback((district, state) => {
    if (!state && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state: state.state});
  }, []);

  const highlightedStateCode = STATE_CODES_REVERSE[regionHighlighted?.state] || 'TT';

  return (
    <React.Fragment>
      <div className="Home">
        <Helmet>
          <title>Coronavirus Outbreak in India - covid19india.org</title>
          <meta
            name="title"
            content="Coronavirus Outbreak in India: Latest Map and Case Count"
          />
        </Helmet>

        <Suspense fallback={<div />}>
          <div className="home-left">
            <div className="header">
              <Search districtZones={null} />

              <div className="actions">
                <h5>{data['TT'].last_updated}</h5>
                {!showUpdates && (
                  <div className="bell-icon">
                    {Bell}
                    {newUpdate && <div className="indicator"></div>}
                  </div>
                )}
                {showUpdates && BellOff}
              </div>
            </div>

            {showUpdates && <Updates />}

            <Level data={data['TT']} />
            <Minigraph timeseries={data['TT'].timeseries} />
            <Table
              data={data}
              regionHighlighted={regionHighlighted}
              setRegionHighlighted={setRegionHighlighted}
              onHighlightState={onHighlightState}
              onHighlightDistrict={onHighlightDistrict}
            />
          </div>
        </Suspense>

        <Suspense fallback={<div />}>
          <div className="home-right">
            <MapExplorer
              mapName={'India'}
              data={data}
              regionHighlighted={regionHighlighted}
              setRegionHighlighted={setRegionHighlighted}
              anchor={anchor}
              setAnchor={setAnchor}
              mapStatistic={mapStatistic}
              setMapStatistic={setMapStatistic}
            />
            <TimeSeriesExplorer
              timeseries={data[highlightedStateCode].timeseries}
              activeStateCode={highlightedStateCode}
              onHighlightState={onHighlightState}
              states={states}
              anchor={anchor}
              setAnchor={setAnchor}
            />
          </div>
        </Suspense>
      </div>
      {fetched && <Footer />}
    </React.Fragment>
  );
}

export default Home;
