import Row from './row';

import {PRIMARY_STATISTICS} from '../constants';
import {capitalize, abbreviate} from '../utils/commonfunctions';

import {TriangleUpIcon, TriangleDownIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useMemo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function StateHeaderCell({handleSort, sortData, statistic}) {
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
            {sortData.isAscending && <TriangleDownIcon />}
            {!sortData.isAscending && <TriangleUpIcon />}
            <div />
          </div>
        )}
      </div>
    </th>
  );
}

function Table({
  data: original,
  states,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
  const {t} = useTranslation();

  const [sortData, setSortData] = useLocalStorage('sortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const data = useMemo(() => {
    Object.keys(original).map((stateCode) => {
      original[stateCode] = produce(original[stateCode], (draftState) => {
        draftState.total['active'] =
          draftState.total.confirmed -
          draftState.total.recovered -
          draftState.total.deceased;
      });
    });
    return original;
  }, [original]);

  const FineprintTop = useMemo(
    () => (
      <React.Fragment>
        <h5 className="table-fineprint">
          {t('Compiled from State Govt. numbers')},{' '}
          <Link to="/about" style={{color: '#6c757d'}}>
            {t('know more')}!
          </Link>
        </h5>
      </React.Fragment>
    ),
    [t]
  );

  const FineprintBottom = useMemo(
    () => (
      <h5 className="table-fineprint">
        {`${
          Object.keys(data).filter(
            (stateCode) => data[stateCode].total.confirmed > 0
          ).length
        } States/UTS Affected`}
      </h5>
    ),
    [data]
  );

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
        const statisticA = data[stateCodeA].total[sortData.sortColumn] || 0;
        const statisticB = data[stateCodeB].total[sortData.sortColumn] || 0;
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

  return (
    <React.Fragment>
      <ReactTooltip
        place="right"
        type="dark"
        effect="solid"
        multiline={true}
        globalEventOff="click"
      />

      {FineprintTop}

      <table className="table">
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
            .sort((a, b) => sortingFunction(a, b))
            .map((stateCode) => {
              if (stateCode !== 'TT') {
                return (
                  <Row
                    key={stateCode}
                    {...{stateCode}}
                    data={data[stateCode]}
                    onHighlightState={onHighlightState}
                    onHighlightDistrict={onHighlightDistrict}
                  />
                );
              }
              return null;
            })}
        </tbody>
      </table>
      {states && FineprintBottom}
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
  return equal(prevProps.regionHighlighted, currProps.regionHighlighted);
};

export default React.memo(Table, isEqual);
