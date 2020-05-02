import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import Search from './search';
import Table from './table';
import TimeSeriesExplorer from './timeseriesexplorer';
import Updates from './updates';

import {MAP_META} from '../constants';
import {
  formatDate,
  formatDateAbsolute,
  mergeTimeseries,
  preprocessTimeseries,
  parseStateTimeseries,
  parseStateTestTimeseries,
  parseTotalTestTimeseries,
} from '../utils/commonfunctions';

import axios from 'axios';
import React, {useState, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {useEffectOnce, useLocalStorage, useFavicon} from 'react-use';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [fetched, setFetched] = useState(false);
  const [activeStateCode, setActiveStateCode] = useState('TT');
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [rowHighlighted, setRowHighlighted] = useState({
    statecode: undefined,
    isDistrict: false,
    districtName: undefined,
  });
  const [showUpdates, setShowUpdates] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [lastViewedLog, setLastViewedLog] = useLocalStorage(
    'lastViewedLog',
    null
  );
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);

  useFavicon(newUpdate ? '/icon_update.png' : '/favicon.ico');

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
        {data},
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        {data: stateTestData},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);

      setStates(data.statewise);

      const ts = parseStateTimeseries(statesDailyResponse);
      ts['TT'] = preprocessTimeseries(data.cases_time_series);
      // Testing data timeseries
      const testTs = parseStateTestTimeseries(stateTestData.states_tested_data);
      testTs['TT'] = parseTotalTestTimeseries(data.tested);
      // Merge
      const tsMerged = mergeTimeseries(ts, testTs);
      setTimeseries(tsMerged);

      setLastUpdated(data.statewise[0].lastupdatedtime);

      const testData = [...stateTestData.states_tested_data].reverse();
      const totalTest = data.tested[data.tested.length - 1];
      testData.push({
        updatedon: totalTest.updatetimestamp.split(' ')[0],
        totaltested: totalTest.totalsamplestested,
        source: totalTest.source,
        state: 'Total',
      });
      setStateTestData(testData);

      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };

  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };

  const onMapHighlightChange = useCallback((region) => {
    setActiveStateCode(region.statecode);
    if ('districtName' in region)
      setRowHighlighted({
        statecode: region.statecode,
        isDistrict: true,
        districtName: region.districtName,
      });
    else
      setRowHighlighted({
        statecode: region.statecode,
        isDistrict: false,
        districtName: undefined,
      });
  }, []);

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

        <div className="home-left">
          <div className="header fadeInUp" style={{animationDelay: '1s'}}>
            {fetched && <Search />}

            <div className="actions">
              <h5>
                {isNaN(Date.parse(formatDate(lastUpdated)))
                  ? ''
                  : formatDateAbsolute(lastUpdated)}
              </h5>
              {!showUpdates && (
                <div className="bell-icon">
                  {fetched && (
                    <Icon.Bell
                      onClick={() => {
                        setShowUpdates(!showUpdates);
                        setNewUpdate(false);
                      }}
                    />
                  )}
                  {newUpdate && <div className="indicator"></div>}
                </div>
              )}
              {showUpdates && (
                <Icon.BellOff
                  onClick={() => {
                    setShowUpdates(!showUpdates);
                  }}
                />
              )}
            </div>
          </div>

          {showUpdates && <Updates />}

          {fetched && <Level data={states[0]} />}
          {fetched && <Minigraph timeseries={timeseries['TT']} />}
          {fetched && (
            <Table
              states={states}
              summary={false}
              stateDistrictWiseData={stateDistrictWiseData}
              rowHighlighted={rowHighlighted}
              onHighlightState={onHighlightState}
              onHighlightDistrict={onHighlightDistrict}
            />
          )}
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <MapExplorer
                mapMeta={MAP_META.India}
                states={states}
                stateDistrictWiseData={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                onMapHighlightChange={onMapHighlightChange}
                isCountryLoaded={true}
                anchor={anchor}
                setAnchor={setAnchor}
              />

              {fetched && (
                <TimeSeriesExplorer
                  timeseries={timeseries[activeStateCode]}
                  activeStateCode={activeStateCode}
                  onHighlightState={onHighlightState}
                  states={states}
                  anchor={anchor}
                  setAnchor={setAnchor}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {fetched && <Footer />}
    </React.Fragment>
  );
}

export default React.memo(Home);
