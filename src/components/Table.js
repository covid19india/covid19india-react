import HeaderCell from './HeaderCell';
import TableLoader from './loaders/Table';

import {FADE_IN, FADE_OUT} from '../animations';
import {PRIMARY_STATISTICS} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {getStatistic} from '../utils/commonFunctions';

import {
  FilterIcon,
  OrganizationIcon,
  QuestionIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useCallback, useState, useRef, lazy} from 'react';
import {Info} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useTrail, useTransition, animated, config} from 'react-spring';
import {useLocalStorage} from 'react-use';
// eslint-disable-next-line
import worker from 'workerize-loader!../workers/getDistricts';

const Row = lazy(() => import('./Row'));

function Table({data: states, regionHighlighted, setRegionHighlighted}) {
  const {t} = useTranslation();
  const [sortData, setSortData] = useLocalStorage('sortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const handleSortClick = useCallback(
    (statistic) => {
      setSortData(
        produce(sortData, (draftSortData) => {
          draftSortData.isAscending = !sortData.isAscending;
          draftSortData.sortColumn = statistic;
        })
      );
    },
    [sortData, setSortData]
  );

  const trail = useTrail(3, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {transform: 'translate3d(0, 0px, 0)', opacity: 1},
    config: config.wobbly,
  });

  const tableElement = useRef();
  const isVisible = useIsVisible(tableElement);
  const [districts, setDistricts] = useState();

  const [tableOption, setTableOption] = useState('States');
  const [isPerMillion, setIsPerMillion] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const sortingFunction = useCallback(
    (regionKeyA, regionKeyB) => {
      if (sortData.sortColumn !== 'regionName') {
        const statisticA = getStatistic(
          districts?.[regionKeyA] || states[regionKeyA],
          'total',
          sortData.sortColumn
        );
        const statisticB = getStatistic(
          districts?.[regionKeyB] || states[regionKeyB],
          'total',
          sortData.sortColumn
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
    [districts, sortData.isAscending, sortData.sortColumn, states]
  );

  const _setTableOption = () => {
    setTableOption((prevTableOption) =>
      prevTableOption === 'States' ? 'Districts' : 'States'
    );

    const workerInstance = worker();
    workerInstance.getDistricts(states);
    workerInstance.addEventListener('message', (message) => {
      if (message.data.type !== 'RPC') {
        setDistricts(message.data);
        workerInstance.terminate();
      }
    });
  };

  const transition = useTransition(isInfoVisible, null, {
    from: FADE_OUT,
    enter: FADE_IN,
    leave: FADE_OUT,
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
          onClick={() => {
            setIsPerMillion((prevState) => !prevState);
          }}
          style={trail[0]}
        >
          <span>1M</span>
        </animated.div>

        <animated.div
          className={classnames('info-toggle', {
            'is-highlighted': isInfoVisible,
          })}
          onClick={() => {
            setIsInfoVisible((prevState) => !prevState);
          }}
          style={trail[0]}
        >
          <QuestionIcon size={14} />
        </animated.div>

        <animated.div className="fineprint" style={trail[1]}></animated.div>
      </div>

      {transition.map(({item, key, props}) =>
        item ? (
          <animated.div key={key} className="table-helper" style={props}>
            <div className="info-item">
              <OrganizationIcon size={14} />
              <p>Show/Hide Top 50 Districts</p>
            </div>
            <div className="info-item">
              <Info size={15} />
              <p>Extra notes</p>
            </div>
            <h5 className="text">
              {t('Compiled from State Govt. numbers')},{' '}
              <Link to="/about" style={{color: '#6c757d'}}>
                {t('know more')}!
              </Link>
            </h5>
          </animated.div>
        ) : null
      )}

      <animated.div className="table" style={trail[2]}>
        <div className="row heading">
          <div
            className="cell heading"
            onClick={() => handleSortClick('regionName')}
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

          {PRIMARY_STATISTICS.map((statistic) => (
            <HeaderCell
              key={statistic}
              {...{statistic, sortData}}
              handleSort={() => {
                handleSortClick(statistic);
              }}
            />
          ))}
        </div>

        {tableOption === 'States' &&
          Object.keys(states)
            .filter(
              (stateCode) =>
                stateCode !== 'TT' && states[stateCode].total?.confirmed
            )
            .sort((a, b) => sortingFunction(a, b))
            .slice(0, isVisible ? Object.keys(states).length - 1 : 10)
            .map((stateCode) => {
              return (
                <Row
                  key={stateCode}
                  data={states[stateCode]}
                  {...{isPerMillion}}
                  {...{stateCode, regionHighlighted, setRegionHighlighted}}
                />
              );
            })}

        {tableOption === 'Districts' && !districts && <TableLoader />}

        {districts &&
          Object.keys(districts)
            .sort((a, b) => sortingFunction(a, b))
            .slice(0, 50)
            .map((districtName) => {
              return (
                <Row
                  key={districtName}
                  data={districts[districtName]}
                  {...{
                    districtName,
                    regionHighlighted,
                    setRegionHighlighted,
                  }}
                />
              );
            })}

        <span className="intersection" ref={tableElement}></span>

        <Row
          key={'TT'}
          data={states['TT']}
          stateCode={'TT'}
          {...{regionHighlighted, setRegionHighlighted}}
        />
      </animated.div>
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
  if (
    !equal(
      prevProps.regionHighlighted.districtName,
      currProps.regionHighlighted.districtName
    )
  ) {
    return false;
  } else if (
    !equal(
      prevProps.regionHighlighted.stateCode,
      currProps.regionHighlighted.stateCode
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
