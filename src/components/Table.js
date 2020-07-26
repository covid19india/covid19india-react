import HeaderCell from './HeaderCell';
import TableLoader from './loaders/Table';
import TableDeltaHelper from './snippets/TableDeltaHelper';

import {TABLE_FADE_IN, TABLE_FADE_OUT} from '../animations';
import {
  DISTRICT_TABLE_COUNT,
  TABLE_STATISTICS,
  UNASSIGNED_STATE_CODE,
} from '../constants';
import {getStatistic} from '../utils/commonFunctions';

import {
  FilterIcon,
  OrganizationIcon,
  QuestionIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useCallback, useEffect, useState, lazy} from 'react';
import {Info} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useTrail, useTransition, animated, config} from 'react-spring';
import {useSessionStorage} from 'react-use';
// eslint-disable-next-line
import worker from 'workerize-loader!../workers/getDistricts';

const Row = lazy(() => import('./Row'));

function Table({data: states, regionHighlighted, setRegionHighlighted}) {
  const {t} = useTranslation();
  const [sortData, setSortData] = useSessionStorage('sortData', {
    sortColumn: 'confirmed',
    isAscending: false,
    delta: false,
  });

  const handleSortClick = useCallback(
    (statistic) => {
      if (sortData.sortColumn !== statistic) {
        setSortData(
          produce(sortData, (draftSortData) => {
            draftSortData.sortColumn = statistic;
          })
        );
      } else {
        setSortData(
          produce(sortData, (draftSortData) => {
            draftSortData.isAscending = !sortData.isAscending;
          })
        );
      }
    },
    [sortData, setSortData]
  );

  const trail = useTrail(3, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {transform: 'translate3d(0, 0px, 0)', opacity: 1},
    config: config.wobbly,
  });

  const [districts, setDistricts] = useState();

  const [tableOption, setTableOption] = useState('States');
  const [isPerMillion, setIsPerMillion] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const sortingFunction = useCallback(
    (regionKeyA, regionKeyB) => {
      if (sortData.sortColumn !== 'regionName') {
        const statisticA = getStatistic(
          districts?.[regionKeyA] || states[regionKeyA],
          sortData.delta ? 'delta' : 'total',
          sortData.sortColumn,
          isPerMillion
        );
        const statisticB = getStatistic(
          districts?.[regionKeyB] || states[regionKeyB],
          sortData.delta ? 'delta' : 'total',
          sortData.sortColumn,
          isPerMillion
        );
        return sortData.isAscending
          ? statisticA - statisticB
          : statisticB - statisticA;
      } else {
        return sortData.isAscending
          ? regionKeyA.localeCompare(regionKeyB)
          : regionKeyB.localeCompare(regionKeyA);
      }
    },
    [
      districts,
      isPerMillion,
      sortData.delta,
      sortData.isAscending,
      sortData.sortColumn,
      states,
    ]
  );

  const _setTableOption = useCallback(() => {
    setTableOption((prevTableOption) =>
      prevTableOption === 'States' ? 'Districts' : 'States'
    );
  }, []);

  useEffect(() => {
    const workerInstance = worker();
    workerInstance.getDistricts(states);
    workerInstance.addEventListener('message', (message) => {
      if (message.data.type !== 'RPC') {
        setDistricts(message.data);
        workerInstance.terminate();
      }
    });
  }, [tableOption, states]);

  const transition = useTransition(isInfoVisible, null, {
    from: TABLE_FADE_OUT,
    enter: TABLE_FADE_IN,
    leave: TABLE_FADE_OUT,
  });

  return (
    <React.Fragment>
      <div className="table-top">
        <animated.div
          className={classnames('option-toggle', {
            'is-highlighted': tableOption === 'Districts',
          })}
          onClick={_setTableOption}
          style={trail[0]}
        >
          <OrganizationIcon size={14} />
        </animated.div>

        <animated.div
          className={classnames('million-toggle', {
            'is-highlighted': isPerMillion,
          })}
          onClick={setIsPerMillion.bind(this, !isPerMillion)}
          style={trail[0]}
        >
          <span>1M</span>
        </animated.div>

        <animated.div
          className={classnames('info-toggle', {
            'is-highlighted': isInfoVisible,
          })}
          onClick={setIsInfoVisible.bind(this, !isInfoVisible)}
          style={trail[0]}
        >
          <QuestionIcon size={14} />
        </animated.div>

        <animated.div className="scroll-right-helper" style={trail[1]}>
          <span>{'Scroll Right \u2192'}</span>
        </animated.div>
      </div>

      {transition.map(({item, key, props}) =>
        item ? (
          <animated.div key={key} className="table-helper" style={props}>
            <div className="helper-top">
              <div className="helper-left">
                <div className="info-item">
                  <span>
                    <OrganizationIcon size={14} />
                  </span>
                  <p>{`Toggle between States/Districts`}</p>
                </div>

                <div className="info-item">
                  <h5>1M</h5>
                  <p>Per Million of Population</p>
                </div>

                <div className="info-item sort">
                  <span>
                    <FilterIcon size={14} />
                  </span>
                  <p>Sort by Descending</p>
                </div>

                <div className="info-item sort invert">
                  <span>
                    <FilterIcon size={14} />
                  </span>
                  <p>Sort by Ascending</p>
                </div>

                <div className="info-item sort">
                  <TableDeltaHelper />
                </div>

                <div className="info-item notes">
                  <span>
                    <Info size={15} />
                  </span>
                  <p>Notes</p>
                </div>
              </div>

              <div className="helper-right">
                <div className="info-item">
                  <h5>C</h5>
                  <p>Confirmed</p>
                </div>

                <div className="info-item notes">
                  <h5>A</h5>
                  <p>Active</p>
                </div>

                <div className="info-item">
                  <h5>R</h5>
                  <p>Recovered</p>
                </div>

                <div className="info-item notes">
                  <h5>D</h5>
                  <p>Deceased</p>
                </div>

                <div className="info-item notes">
                  <h5>T</h5>
                  <p>Tested</p>
                </div>
              </div>
            </div>

            <h5 className="text">
              {t('Compiled from State Govt. numbers')},{' '}
              <Link to="/about">{t('know more')}!</Link>
            </h5>
          </animated.div>
        ) : null
      )}

      <div className="table fadeInUp">
        <div className="table-wrapper">
          <div className="row heading">
            <div
              className="cell heading"
              onClick={handleSortClick.bind(this, 'regionName')}
            >
              <div>{t(tableOption === 'States' ? 'State/UT' : 'District')}</div>
              {sortData.sortColumn === 'regionName' && (
                <div
                  className={classnames('sort-icon', {
                    invert: !sortData.isAscending,
                  })}
                >
                  <FilterIcon size={10} />
                </div>
              )}
            </div>

            {TABLE_STATISTICS.map((statistic) => (
              <HeaderCell
                key={statistic}
                {...{statistic, sortData, setSortData}}
                handleSort={handleSortClick.bind(this, statistic)}
              />
            ))}
          </div>

          {tableOption === 'States' &&
            Object.keys(states)
              .filter(
                (stateCode) =>
                  stateCode !== 'TT' &&
                  !(stateCode === UNASSIGNED_STATE_CODE && isPerMillion)
              )
              .sort((a, b) => sortingFunction(a, b))
              .map((stateCode) => {
                return (
                  <Row
                    key={stateCode}
                    data={states[stateCode]}
                    {...{
                      stateCode,
                      isPerMillion,
                      regionHighlighted,
                      setRegionHighlighted,
                    }}
                  />
                );
              })}

          {tableOption === 'Districts' && !districts && <TableLoader />}

          {tableOption === 'Districts' &&
            districts &&
            Object.keys(districts)
              .sort((a, b) => sortingFunction(a, b))
              .slice(0, DISTRICT_TABLE_COUNT)
              .map((districtKey) => {
                return (
                  <Row
                    key={districtKey}
                    data={districts[districtKey]}
                    districtName={districts[districtKey].districtName}
                    {...{
                      isPerMillion,
                      regionHighlighted,
                      setRegionHighlighted,
                    }}
                  />
                );
              })}

          <Row
            key={'TT'}
            data={states['TT']}
            stateCode={'TT'}
            {...{isPerMillion, regionHighlighted, setRegionHighlighted}}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
  if (
    !equal(
      prevProps.regionHighlighted?.districtName,
      currProps.regionHighlighted?.districtName
    )
  ) {
    return false;
  } else if (
    !equal(
      prevProps.regionHighlighted?.stateCode,
      currProps.regionHighlighted?.stateCode
    )
  ) {
    return false;
  } else if (
    !equal(
      prevProps.data['TT'].total.confirmed,
      currProps.data['TT'].total.confirmed
    )
  ) {
    return false;
  } else return true;
};

export default React.memo(Table, isEqual);
