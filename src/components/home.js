import Actions from './actions';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import Search from './search';
import Table from './table';
import TimeSeriesExplorer from './timeseriesexplorer';

import 'intersection-observer';

import useStickySWR from '../hooks/usestickyswr';
import {fetcher} from '../utils/commonfunctions';

import React, {useState, Suspense, useRef} from 'react';
import {Helmet} from 'react-helmet';
import {useIsVisible} from 'react-is-visible';

function Home(props) {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('confirmed');

  const [date, setDate] = useState('');

  const {data: timeseries} = useStickySWR(
    'https://api.covid19india.org/v3/min/timeseries.min.json',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const {data} = useStickySWR(
    `https://api.covid19india.org/v3/min/data${
      date ? `-${date}` : ''
    }.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
      revalidateOnFocus: false,
    }
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement, {once: true});

  return (
    <React.Fragment>
      {data && timeseries && (
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

              <Suspense fallback={<div style={{minHeight: '5rem'}} />}>
                <Actions
                  {...{
                    setDate,
                    dates: Object.keys(timeseries['TT']).reverse(),
                    date,
                  }}
                />
              </Suspense>
            </div>

            <Level data={data['TT']} />
            <Minigraph timeseries={timeseries['TT']} {...{date}} />
            <Table {...{data, regionHighlighted, setRegionHighlighted}} />
          </div>

          <div className="home-right" ref={homeRightElement}>
            {isVisible && (
              <React.Fragment>
                <MapExplorer
                  mapName={'India'}
                  {...{data, date}}
                  {...{mapStatistic, setMapStatistic}}
                  {...{regionHighlighted, setRegionHighlighted}}
                  {...{anchor, setAnchor}}
                />

                <TimeSeriesExplorer
                  timeseries={timeseries[regionHighlighted.stateCode]}
                  {...{date}}
                  {...{regionHighlighted, setRegionHighlighted}}
                  {...{anchor, setAnchor}}
                />
              </React.Fragment>
            )}
          </div>
        </div>
      )}
      <Footer />
    </React.Fragment>
  );
}

export default Home;
