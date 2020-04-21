import React, {useState, useCallback} from 'react';
import {useEffectOnce} from 'react-use';
import * as Icon from 'react-feather';
import axios from 'axios';

import {MAP_META} from '../constants';

import {
  formatDate,
  formatDateAbsolute,
  preprocessTimeseries,
  parseStateTimeseries,
} from '../utils/common-functions';

import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeriesExplorer from './timeseriesexplorer';
import Minigraph from './minigraph';
import Updates from './updates';
import Search from './search';
import Footer from './footer';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [activeStateCode, setActiveStateCode] = useState('TT');
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [showUpdates, setShowUpdates] = useState(false);
  const [seenUpdates, setSeenUpdates] = useState(false);
  const [newUpdate, setNewUpdate] = useState(true);

  useEffectOnce(() => {
    /* if (localStorage.getItem('anyNewUpdate') === null) {
      localStorage.setItem('anyNewUpdate', true);
    } else {
      setSeenUpdates(true);
      setNewUpdate(localStorage.getItem('anyNewUpdate') === 'false');
    }*/

    getStates();
    /* axios
        .get('https://api.covid19india.org/updatelog/log.json')
        .then((response) => {
          const currentTimestamp = response.data
            .slice()
            .reverse()[0]
            .timestamp.toString();
          // Sets and Updates the data in the local storage.
          if (localStorage.getItem('currentItem') !== null) {
            if (localStorage.getItem('currentItem') !== currentTimestamp) {
              localStorage.setItem('currentItem', currentTimestamp);
              localStorage.setItem('anyNewUpdate', true);
            }
          } else {
            localStorage.setItem('currentItem', currentTimestamp);
          }
        })
        .catch((err) => {
          console.log(err);
        });
        */
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
      setTimeseries(ts);
      setLastUpdated(data.statewise[0].lastupdatedtime);

      const testData = stateTestData.states_tested_data.reverse();
      const totalTest = data.tested[data.tested.length - 1];

      testData.push({
        updatedon: totalTest.updatetimestamp.split(' ')[0],
        totaltested: totalTest.totalindividualstested,
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

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
  }, []);

  return (
    <React.Fragment>
      <div className="Home">
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
                        localStorage.setItem('anyNewUpdate', false);
                        setSeenUpdates(true);
                        setNewUpdate(
                          localStorage.getItem('anyNewUpdate') === 'false'
                        );
                      }}
                    />
                  )}
                  {seenUpdates ? (
                    !newUpdate ? (
                      <div className="indicator"></div>
                    ) : (
                      ''
                    )
                  ) : (
                    <div className="indicator"></div>
                  )}
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
              />

              {fetched && (
                <TimeSeriesExplorer
                  timeseries={timeseries}
                  activeStateCode={activeStateCode}
                  onHighlightState={onHighlightState}
                  states={states}
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
