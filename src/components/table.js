import Row from './row';

import {STATE_ROW_STATISTICS} from '../constants';
import {capitalize, abbreviate} from '../utils/commonfunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React, {useState, useMemo, useCallback} from 'react';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {createBreakpoint, useLocalStorage, useEffectOnce} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function StateHeaderCell({handleSort, sortData, statistic}) {
  const breakpoint = useBreakpoint();

  return (
    <th onClick={() => handleSort(statistic)}>
      <div className="heading-content">
        <abbr
          className={classnames({[`is-${statistic}`]: breakpoint === 'S'})}
          title={statistic}
        >
          {breakpoint === 'L'
            ? statistic.slice(0)
            : breakpoint === 'S'
            ? capitalize(
                abbreviate(statistic === 'deaths' ? 'deceased' : statistic)
              )
            : capitalize(statistic === 'deaths' ? 'deceased' : statistic)}
        </abbr>
        <div
          style={{
            display: sortData.sortColumn === statistic ? 'initial' : 'none',
          }}
        >
          <div
            className={classnames(
              {'arrow-up': sortData.isAscending},
              {'arrow-down': !sortData.isAscending}
            )}
          />
        </div>
      </div>
    </th>
  );
}

const isEqual = (prevProps, currProps) => {
  return equal(prevProps.regionHighlighted, currProps.regionHighlighted);
};

function Table({
  states,
  districts,
  zones,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
  const [sortData, setSortData] = useLocalStorage('sortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const [sortedStates, setSortedStates] = useState(
    states.filter((state) => state.statecode !== 'TT')
  );

  const FineprintTop = useMemo(
    () => (
      <React.Fragment>
        <h5
          className="table-fineprint fadeInUp"
          style={{animationDelay: '1.5s'}}
        >
          Compiled from State Govt. numbers,{' '}
          <Link to="/faq" style={{color: '#6c757d'}}>
            know more!
          </Link>
        </h5>
        <h5
          className="table-fineprint fadeInUp"
          style={{animationDelay: '1.5s'}}
        >
          District zones as published by MoHFW,{' '}
          <a
            href="https://www.facebook.com/airnewsalerts/photos/a.262571017217636/1710062729135117/?type=3&theater"
            style={{color: '#6c757d'}}
          >
            source
          </a>
        </h5>
      </React.Fragment>
    ),
    []
  );

  const FineprintBottom = useMemo(
    () => (
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1s'}}>
        {states.slice(1).filter((s) => s && s.confirmed > 0).length} States/UTS
        Affected
      </h5>
    ),
    [states]
  );

  const doSort = useCallback(
    (sortData) => {
      const newSortedStates = [...sortedStates].sort((x, y) => {
        return sortData.isAscending
          ? parseInt(x[sortData.sortColumn]) - parseInt(y[sortData.sortColumn])
          : parseInt(y[sortData.sortColumn]) - parseInt(x[sortData.sortColumn]);
      });
      setSortedStates(newSortedStates);
    },
    [sortedStates]
  );

  const handleSort = useCallback(
    (statistic) => {
      const newSortData = {
        isAscending: !sortData.isAscending,
        sortColumn: statistic,
      };
      doSort(newSortData);
      setSortData(Object.assign({}, sortData, newSortData));
    },
    [doSort, setSortData, sortData]
  );

  useEffectOnce(() => {
    doSort(sortData);
  });

  if (states.length > 0) {
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

        <table className="table fadeInUp" style={{animationDelay: '1.8s'}}>
          <thead>
            <tr>
              <th className="state-heading" onClick={() => handleSort('state')}>
                <div className="heading-content">
                  <abbr title="State">State/UT</abbr>
                  <div
                    style={{
                      display:
                        sortData.sortColumn === 'state' ? 'initial' : 'none',
                    }}
                  >
                    <div
                      className={classnames(
                        {'arrow-up': sortData.isAscending},
                        {'arrow-down': !sortData.isAscending}
                      )}
                    />
                  </div>
                </div>
              </th>
              {STATE_ROW_STATISTICS.map((statistic, index) => (
                <StateHeaderCell
                  key={index}
                  handleSort={handleSort}
                  sortData={sortData}
                  statistic={statistic}
                />
              ))}
            </tr>
          </thead>

          {states && (
            <tbody>
              {sortedStates.map((state, index) => {
                if (state.confirmed > 0 && state.statecode !== 'TT') {
                  return (
                    <Row
                      key={state.statecode}
                      state={state}
                      districts={districts[state.state]?.districtData}
                      zones={zones[state.state]}
                      regionHighlighted={
                        equal(regionHighlighted?.state, state)
                          ? regionHighlighted
                          : null
                      }
                      onHighlightState={onHighlightState}
                      onHighlightDistrict={onHighlightDistrict}
                    />
                  );
                }
                return null;
              })}
            </tbody>
          )}

          {states && (
            <tbody>
              <Row
                key={0}
                state={states[0]}
                onHighlightState={onHighlightState}
              />
            </tbody>
          )}
        </table>
        {states && FineprintBottom}
      </React.Fragment>
    );
  } else {
    return <div style={{height: '50rem'}}></div>;
  }
}

export default React.memo(Table, isEqual);
