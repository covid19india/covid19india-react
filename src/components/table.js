import StateHeaderCell from './StateHeaderCell';

import {PRIMARY_STATISTICS} from '../constants';
import {getStatistic} from '../utils/commonFunctions';

import {FilterIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useCallback, useRef, lazy} from 'react';
import {useTranslation} from 'react-i18next';
import {useIsVisible} from 'react-is-visible';
import {Link} from 'react-router-dom';
import {useTrail, useTransition, animated, config} from 'react-spring';
import {createBreakpoint, useLocalStorage} from 'react-use';

const Row = lazy(() => import('./Row'));

function Table({data, regionHighlighted, setRegionHighlighted}) {
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

  const sortingFunction = useCallback(
    (stateCodeA, stateCodeB) => {
      if (sortData.sortColumn !== 'stateName') {
        const statisticA = getStatistic(
          data[stateCodeA],
          'total',
          sortData.sortColumn
        );
        const statisticB = getStatistic(
          data[stateCodeB],
          'total',
          sortData.sortColumn
        );
        return sortData.isAscending
          ? statisticA - statisticB
          : statisticB - statisticA;
      } else {
        return sortData.isAscending
          ? stateCodeA.localeCompare(stateCodeB)
          : stateCodeB.localeCompare(stateCodeA);
      }
    },
    [sortData, data]
  );

  const [trail, set] = useTrail(2, () => ({
    transform: 'translate3d(0, 10px, 0)',
    opacity: 0,
    config: config.wobbly,
  }));

  set({transform: 'translate3d(0, 0px, 0)', opacity: 1});

  const tableElement = useRef();
  const isVisible = useIsVisible(tableElement);

  return (
    <React.Fragment>
      <animated.div className="table" style={trail[1]}>
        <div className="row heading">
          <div
            className="cell heading"
            onClick={() => handleSortClick('stateName')}
          >
            <div>{t('State/UT')}</div>
            {sortData.sortColumn === 'stateName' && (
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
            <StateHeaderCell
              key={statistic}
              {...{statistic, sortData}}
              handleSort={() => {
                handleSortClick(statistic);
              }}
            />
          ))}
        </div>

        {Object.keys(data)
          .filter(
            (stateCode) =>
              stateCode !== 'TT' && data[stateCode].total?.confirmed
          )
          .sort((a, b) => sortingFunction(a, b))
          .slice(0, isVisible ? Object.keys(data).length - 1 : 10)
          .map((stateCode) => {
            return (
              <Row
                key={stateCode}
                data={data[stateCode]}
                {...{stateCode, regionHighlighted, setRegionHighlighted}}
              />
            );
          })}

        {!isVisible && (
          <span className="intersection" ref={tableElement}></span>
        )}

        <Row
          key={'TT'}
          data={data['TT']}
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
