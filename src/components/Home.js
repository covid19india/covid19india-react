import TableLoader from './loaders/Table';

import {DATA_API_ROOT, GOSPEL_DATE} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {fetcher, getStatistic, retry} from '../utils/commonFunctions';

import {HeartIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {useState, useRef, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useLocalStorage, useSessionStorage, useWindowSize} from 'react-use';

const Actions = lazy(() => retry(() => import('./Actions')));
const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));
const LevelVaccinated = lazy(() => retry(() => import('./LevelVaccinated')));
const MapExplorer = lazy(() => retry(() => import('./MapExplorer')));
const MapSwitcher = lazy(() => retry(() => import('./MapSwitcher')));
const Minigraphs = lazy(() => retry(() => import('./Minigraphs')));
const Search = lazy(() => retry(() => import('./Search')));
const StateHeader = lazy(() => retry(() => import('./StateHeader')));
const Table = lazy(() => retry(() => import('./Table')));
const TimeseriesExplorer = lazy(() =>
  retry(() => import('./TimeseriesExplorer'))
);

function Home() {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useLocalStorage('anchor', null);
  const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active'
  );
  const [date, setDate] = useState('');
  const location = useLocation();

  const {data: timeseries} = useStickySWR(
    `${DATA_API_ROOT}/timeseries.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data} = useStickySWR(
    `${DATA_API_ROOT}/data${date ? `-${date}` : ''}.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

  const hideDistrictData = date !== '' && date < GOSPEL_DATE;
  const hideVaccinated =
    getStatistic(data?.['TT'], 'total', 'vaccinated') === 0;

  return (
    <>
      <Helmet>
        <title>Coronavirus Outbreak in India - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="Home">
        <div className={classnames('home-left', {expanded: expandTable})}>
          <div className="header">
            <Suspense fallback={<div />}>
              <Search />
            </Suspense>

            {!data && !timeseries && <div style={{height: '60rem'}} />}

            <>
              {!timeseries && <div style={{minHeight: '61px'}} />}
              {timeseries && (
                <Suspense fallback={<div style={{minHeight: '61px'}} />}>
                  <Actions
                    {...{
                      date,
                      setDate,
                      dates: Object.keys(timeseries['TT']?.dates),
                    }}
                  />
                </Suspense>
              )}
            </>
          </div>

          <div style={{position: 'relative', marginTop: '1rem'}}>
            {data && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                {width > 769 && !expandTable && (
                  <MapSwitcher {...{mapStatistic, setMapStatistic}} />
                )}
                <Level data={data['TT']} />
              </Suspense>
            )}

            <>
              {!timeseries && <div style={{height: '107px'}} />}
              {timeseries && (
                <Suspense fallback={<div style={{height: '107px'}} />}>
                  <Minigraphs
                    timeseries={timeseries['TT']?.dates}
                    {...{date}}
                  />
                </Suspense>
              )}
            </>
          </div>

          <a href="/resources" className="essentials fadeInUp">
            <HeartIcon />
            Crowdsourced Resources
          </a>

          {!hideVaccinated && <LevelVaccinated data={data['TT']} />}

          {data && (
            <Suspense fallback={<TableLoader />}>
              <Table
                {...{
                  data,
                  regionHighlighted,
                  setRegionHighlighted,
                  expandTable,
                  setExpandTable,
                  hideDistrictData,
                  hideVaccinated,
                }}
              />
            </Suspense>
          )}
        </div>

        <div
          className={classnames('home-right', {expanded: expandTable})}
          ref={homeRightElement}
          style={{minHeight: '2rem'}}
        >
          {(isVisible || location.hash) && (
            <>
              {data && (
                <div
                  className={classnames('map-container', {
                    expanded: expandTable,
                    stickied:
                      anchor === 'mapexplorer' || (expandTable && width > 769),
                  })}
                >
                  <Suspense fallback={<div style={{height: '50rem'}} />}>
                    <StateHeader data={data['TT']} stateCode={'TT'} />
                    <MapExplorer
                      stateCode="TT"
                      {...{date, data}}
                      {...{mapStatistic, setMapStatistic}}
                      {...{regionHighlighted, setRegionHighlighted}}
                      {...{anchor, setAnchor}}
                      {...{expandTable, hideDistrictData}}
                    />
                  </Suspense>
                </div>
              )}

              {timeseries && (
                <Suspense fallback={<div style={{height: '50rem'}} />}>
                  <TimeseriesExplorer
                    stateCode="TT"
                    {...{
                      timeseries,
                      date,
                      regionHighlighted,
                      setRegionHighlighted,
                      anchor,
                      setAnchor,
                      expandTable,
                      hideVaccinated,
                    }}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>

      {isVisible && (
        <Suspense fallback={<div />}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

export default Home;
