import TableLoader from './loaders/table';
import StateHeaderCell from './StateHeaderCell';

import {PRIMARY_STATISTICS} from '../constants';
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
import {useIsVisible} from 'react-is-visible';
import {Link} from 'react-router-dom';
import {useTrail, useTransition, animated, config} from 'react-spring';
import {createBreakpoint, useLocalStorage} from 'react-use';
// eslint-disable-next-line
import worker from 'workerize-loader!../workers/getDistricts';

const Row = lazy(() => import('./Row'));
const useBreakpoint = createBreakpoint({S: 768});

function PureFineprintTop() {
  const {t} = useTranslation();

  return (
    <React.Fragment>
      <h5 className="text">
        {t('Compiled from State Govt. numbers')},{' '}
        <Link to="/about" style={{color: '#6c757d'}}>
          {t('know more')}!
        </Link>
      </h5>
    </React.Fragment>
  );
}
const FineprintTop = React.memo(PureFineprintTop);

function Table({data, regionHighlighted, setRegionHighlighted}) {
  const {t} = useTranslation();
  const [sortData, setSortData] = useLocalStorage('sortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });
  const [districts, setDistricts] = useState();

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

  const [trail, set] = useTrail(3, () => ({
    transform: 'translate3d(0, 10px, 0)',
    opacity: 0,
    config: config.wobbly,
  }));

  set({transform: 'translate3d(0, 0px, 0)', opacity: 1});

  const tableElement = useRef();
  const isVisible = useIsVisible(tableElement);

  const [tableOption, setTableOption] = useState('states');
  const [isPerMillion, setIsPerMillion] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const sortingFunction = useCallback(
    (stateCodeA, stateCodeB) => {
      if (sortData.sortColumn !== 'stateName') {
        const statisticA = getStatistic(
          districts?.[stateCodeA] || data[stateCodeA],
          'total',
          sortData.sortColumn
        );
        const statisticB = getStatistic(
          districts?.[stateCodeB] || data[stateCodeB],
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
    [sortData.sortColumn, sortData.isAscending, districts, data]
  );

  const _setTableOption = () => {
    setTableOption((prevTableOption) =>
      prevTableOption === 'states' ? 'districts' : 'states'
    );

    const workerInstance = worker();
    workerInstance.getDistricts(data);
    workerInstance.addEventListener('message', (message) => {
      if (message.data.type !== 'RPC') {
        setDistricts(message.data);
        workerInstance.terminate();
      }
    });
  };

  const FADE_IN = {
    opacity: 1,
    transform: 'translate3d(0, 0px, 0)',
    height: 80,
  };

  const FADE_OUT = {
    opacity: 0,
    transform: 'translate3d(0, 2px, 0)',
    height: 0,
  };

  const transitions = useTransition(isInfoVisible, null, {
    from: FADE_OUT,
    enter: FADE_IN,
    leave: FADE_OUT,
  });

  return (
    <React.Fragment>
      <div className="table-top">
        <animated.div
          className={classnames('option-toggle', {
            'is-highlighted': tableOption === 'districts',
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
          1M
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

      {transitions.map(({item, key, props}) =>
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
          </animated.div>
        ) : null
      )}

      <animated.div className="table" style={trail[2]}>
        <div className="row heading">
          <div
            className="cell heading"
            onClick={() => handleSortClick('stateName')}
          >
            <div>{t(tableOption === 'states' ? 'State/UT' : 'District')}</div>
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

        {tableOption === 'states' &&
          Object.keys(data)
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
                  {...{isPerMillion}}
                  {...{stateCode, regionHighlighted, setRegionHighlighted}}
                />
              );
            })}

        {tableOption === 'districts' && !districts && <TableLoader />}

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
