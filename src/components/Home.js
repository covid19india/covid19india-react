import {MAP_META} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {fetcher} from '../utils/commonFunctions';

import React, {useState, useRef, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useWindowSize} from 'react-use';

const TimeseriesExplorer = lazy(() => import('./TimeseriesExplorer'));
const MapExplorer = lazy(() => import('./MapExplorer'));
const Actions = lazy(() => import('./Actions'));
const Table = lazy(() => import('./Table'));
const Minigraphs = lazy(() => import('./Minigraphs'));
const Footer = lazy(() => import('./Footer'));
const Search = lazy(() => import('./Search'));
const Level = lazy(() => import('./Level'));
const MapSwitcher = lazy(() => import('./MapSwitcher'));
const StateHeader = lazy(() => import('./StateHeader'));

function Home(props) {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useState(null);
  const [mapStatistic, setMapStatistic] = useState('confirmed');
  const [date, setDate] = useState('');
  const location = useLocation();

  const {data: timeseries} = useStickySWR(
    'https://api.covid19india.org/v3/min/timeseries.min.json',
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
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
    }
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

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
            <Suspense fallback={<div />}>
              <Search />
            </Suspense>

            {timeseries && (
              <Suspense fallback={<div style={{minHeight: '56px'}} />}>
                <Actions
                  {...{
                    setDate,
                    dates: Object.keys(timeseries['TT']).reverse(),
                    date,
                  }}
                />
              </Suspense>
            )}
          </div>

          <div style={{position: 'relative'}}>
            {data && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                {width > 769 && (
                  <MapSwitcher {...{mapStatistic, setMapStatistic}} />
                )}
                <Level data={data['TT']} />
              </Suspense>
            )}

            {timeseries && (
              <Suspense fallback={<div />}>
                <Minigraphs timeseries={timeseries['TT']} {...{date}} />
              </Suspense>
            )}
          </div>

          {data && (
            <Suspense fallback={<div />}>
              <Table {...{data, regionHighlighted, setRegionHighlighted}} />
            </Suspense>
          )}
        </div>

        <div className="home-right" ref={homeRightElement}>
          {(isVisible || location.hash) && (
            <React.Fragment>
              {data && (
                <Suspense fallback={<div />}>
                  <StateHeader data={data['TT']} stateCode={'TT'} />
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
                  <TimeseriesExplorer
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

      {isVisible && (
        <Suspense fallback={<div />}>
          <Footer />
        </Suspense>
      )}
    </React.Fragment>
  );
}

export default Home;
