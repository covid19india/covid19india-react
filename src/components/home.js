import Actions from './actions';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import Search from './search';
import Table from './table';
// import TimeSeriesExplorer from './timeseriesexplorer';

import {INITIAL_DATA} from '../constants';
import useStickySWR from '../hooks/usestickyswr';
import {fetcher} from '../utils/commonfunctions';

import React, {useState} from 'react';
import {Helmet} from 'react-helmet';

function Home(props) {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });
  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('confirmed');

  const [date, setDate] = useState('2020-05-25');

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDate((date) =>
  //       formatISO(addDays(new Date(date), 1), {representation: 'date'})
  //     );
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const {data} = useStickySWR(`http://localhost:3001/${date}`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 100000,
    revalidateOnFocus: false,
  });

  const {data: timeseries} = useStickySWR(
    'https://api.covid19india.org/v3/timeseries.json',
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
      revalidateOnFocus: false,
    }
  );

  // const {data} = useSWR(
  //   'https://api.covid19india.org/v2/data.min.json',
  //   fetcher,
  //   {
  //     initialData: INITIAL_DATA,
  //     suspense: true,
  //     revalidateOnFocus: false,
  //     refreshInterval: 5 * 60 * 1000,
  //     compare: (dataA, dataB) => {
  //       return dataA['TT'].last_updated - dataB['TT'].last_updated;
  //     },
  //   }
  // );

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
            <Search />
            <Actions {...{setDate}} />
          </div>

          {data && <Level data={data['TT']} />}
          {timeseries && <Minigraph timeseries={timeseries['TT'].timeseries} />}
          {timeseries && data && (
            <Table {...{data, regionHighlighted, setRegionHighlighted}} />
          )}
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

          {/* <TimeSeriesExplorer
            timeseries={data[regionHighlighted.stateCode].timeseries}
            activeStateCode={regionHighlighted.stateCode}
            {...{regionHighlighted, setRegionHighlighted}}
            anchor={anchor}
            setAnchor={setAnchor}
          />*/}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Home;
