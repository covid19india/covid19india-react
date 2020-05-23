import {INITIAL_DATA} from '../constants';

import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import Search from './search';
import Table from './table';
import TimeSeriesExplorer from './timeseriesexplorer';
import Updates from './updates';

import axios from 'axios';
import React, {useState, useMemo} from 'react';
import * as Icon from 'react-feather';
import {Helmet} from 'react-helmet';
import {useEffectOnce, useLocalStorage} from 'react-use';
import useSWR from 'swr';

const fetcher = (url) => axios(url).then((response) => response.data);

function Home(props) {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });
  const [showUpdates, setShowUpdates] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('confirmed');

  const [lastViewedLog, setLastViewedLog] = useLocalStorage(
    'lastViewedLog',
    null
  );
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);

  // const {data} = useSWR('http://localhost:3001/db', fetcher, {
  //   suspense: true,
  //   refreshInterval: 5000,
  // });

  const {data} = useSWR(
    'https://api.covid19india.org/v2/data.min.json',
    fetcher,
    {
      initialData: INITIAL_DATA,
      suspense: true,
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
      compare: (dataA, dataB) => {
        return dataA['TT'].last_updated - dataB['TT'].last_updated;
      },
    }
  );

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
          <Table {...{data, regionHighlighted, setRegionHighlighted}} />
        </div>

        <div className="home-right">
          {/* <MapExplorer
                mapName={'India'}
                data={data}
                regionHighlighted={regionHighlighted}
                setRegionHighlighted={setRegionHighlighted}
                anchor={anchor}
                setAnchor={setAnchor}
                mapStatistic={mapStatistic}
                setMapStatistic={setMapStatistic}
               />*/}
          <TimeSeriesExplorer
            timeseries={data[regionHighlighted.stateCode].timeseries}
            activeStateCode={regionHighlighted.stateCode}
            {...{regionHighlighted, setRegionHighlighted}}
            anchor={anchor}
            setAnchor={setAnchor}
          />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Home;
