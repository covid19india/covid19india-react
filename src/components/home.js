import {MAP_META} from '../constants';
import useStickySWR from '../hooks/usestickyswr';
import {fetcher} from '../utils/commonfunctions';

import 'intersection-observer';

import React, {useState, useRef, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useIsVisible} from 'react-is-visible';

const TimeSeriesExplorer = lazy(() =>
  import('./timeseriesexplorer' /* webpackChunkName: "TimeSeriesExplorer" */)
);

const MapExplorer = lazy(() =>
  import('./mapexplorer' /* webpackChunkName: "MapExplorer" */)
);

const Actions = lazy(() =>
  import('./actions' /* webpackChunkName: "Actions" */)
);

const Table = lazy(() => import('./table' /* webpackChunkName: "Table" */));

const Minigraph = lazy(() =>
  import('./minigraph' /* webpackChunkName: "Minigraph" */)
);

const Footer = lazy(() => import('./footer' /* webpackChunkName: "Footer" */));

const Search = lazy(() => import('./search' /* webpackChunkName: "Search" */));

const Level = lazy(() => import('./level' /* webpackChunkName: "Level" */));

function Home(props) {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('active');

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

  const stateCodes = [
    'TT',
    ...[
      ...new Set([
        ...Object.keys(MAP_META).filter((stateCode) => stateCode !== 'TT'),
        ...Object.keys(data || {}).filter((stateCode) => stateCode !== 'TT'),
      ]),
    ].sort(),
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Coronavirus Outbreak in India - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="Home">
        <div className="home-left">
          <div className="header">
            <Suspense>
              <Search />
            </Suspense>

            <Suspense>
              {timeseries && (
                <Actions
                  {...{
                    setDate,
                    dates: Object.keys(timeseries['TT']).reverse(),
                    date,
                  }}
                />
              )}
            </Suspense>
          </div>

          {data && (
            <Suspense>
              <Level data={data['TT']} />
            </Suspense>
          )}

          <Suspense>
            {timeseries && (
              <Minigraph timeseries={timeseries['TT']} {...{date}} />
            )}
          </Suspense>

          <Suspense>
            {data && (
              <Table {...{data, regionHighlighted, setRegionHighlighted}} />
            )}
          </Suspense>
        </div>

        <div className="home-right" ref={homeRightElement}>
          {isVisible && (
            <React.Fragment>
              {data && (
                <Suspense fallback={<div />}>
                  <MapExplorer
                    stateCode="TT"
                    {...{data}}
                    {...{mapStatistic, setMapStatistic}}
                    {...{regionHighlighted, setRegionHighlighted}}
                    {...{anchor, setAnchor}}
                  />
                </Suspense>
              )}

              {timeseries && (
                <Suspense fallback={<div />}>
                  <TimeSeriesExplorer
                    timeseries={timeseries[regionHighlighted.stateCode]}
                    {...{date, stateCodes}}
                    {...{regionHighlighted, setRegionHighlighted}}
                    {...{anchor, setAnchor}}
                  />
                </Suspense>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Home;
