import Row from './row';

import {PRIMARY_STATISTICS} from '../constants';
import {capitalize, abbreviate, getStatistic} from '../utils/commonfunctions';

import {TriangleUpIcon, TriangleDownIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useTrail, animated, config} from 'react-spring';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function PureStateHeaderCell({handleSort, sortData, statistic}) {
  const breakpoint = useBreakpoint();
  const {t} = useTranslation();

  return (
    <th onClick={() => handleSort(statistic)}>
      <div className="heading-content">
        <abbr
          className={classnames({[`is-${statistic}`]: breakpoint === 'S'})}
          title={capitalize(statistic)}
        >
          {breakpoint === 'S'
            ? capitalize(statistic.slice(0, 1))
            : breakpoint === 'L'
            ? capitalize(abbreviate(statistic))
            : capitalize(t(statistic))}
        </abbr>
        {sortData.sortColumn === statistic && (
          <div>
            {sortData.isAscending && <TriangleUpIcon />}
            {!sortData.isAscending && <TriangleDownIcon />}
            <div />
          </div>
        )}
      </div>
    </th>
  );
}

const isStateHeaderCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.sortData, currProps.sortData)) {
    return false;
  } else {
    return true;
  }
};

const StateHeaderCell = React.memo(PureStateHeaderCell, isStateHeaderCellEqual);

function PureFineprintTop() {
  const {t} = useTranslation();

  return (
    <React.Fragment>
      <h5 className="table-fineprint">
        {t('Compiled from State Govt. numbers')},{' '}
        <Link to="/about" style={{color: '#6c757d'}}>
          {t('know more')}!
        </Link>
      </h5>
    </React.Fragment>
  );
}
const FineprintTop = React.memo(PureFineprintTop);

function PureFineprintBottom({data}) {
  return (
    <h5 className="table-fineprint">
      {`${
        Object.keys(data).filter(
          (stateCode) => data[stateCode].total?.confirmed > 0
        ).length
      } States/UTS Affected`}
    </h5>
  );
}
const FineprintBottom = React.memo(PureFineprintBottom, () => {
  return true;
});

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

  return (
    <React.Fragment>
      <animated.span style={trail[0]}>
        <FineprintTop />
      </animated.span>

      <animated.table className="table" style={trail[1]}>
        <thead>
          <tr>
            <th
              className="state-heading"
              onClick={() => handleSortClick('stateName')}
            >
              <div className="heading-content">
                <abbr title="State">{t('State/UT')}</abbr>
                {sortData.sortColumn === 'stateName' && (
                  <div>
                    {sortData.isAscending && <TriangleDownIcon />}
                    {!sortData.isAscending && <TriangleUpIcon />}
                  </div>
                )}
              </div>
            </th>
            {PRIMARY_STATISTICS.map((statistic) => (
              <StateHeaderCell
                key={statistic}
                {...{statistic, sortData}}
                handleSort={() => {
                  handleSortClick(statistic);
                }}
              />
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.keys(data)
            .filter(
              (stateCode) =>
                stateCode !== 'TT' && data[stateCode].total?.confirmed
            )
            .sort((a, b) => sortingFunction(a, b))
            .map((stateCode) => {
              return (
                <Row
                  key={stateCode}
                  data={data[stateCode]}
                  {...{stateCode, regionHighlighted, setRegionHighlighted}}
                />
              );
            })}
        </tbody>

        <tbody>
          <Row
            key={'TT'}
            data={data['TT']}
            stateCode={'TT'}
            {...{regionHighlighted, setRegionHighlighted}}
          />
        </tbody>
      </animated.table>

      <FineprintBottom {...{data}} />
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
