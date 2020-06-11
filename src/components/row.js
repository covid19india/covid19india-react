import Tooltip from './tooltip';

import {PRIMARY_STATISTICS, STATE_NAMES} from '../constants';
import {
  capitalize,
  formatLastUpdated,
  formatNumber,
  getStatistic,
} from '../utils/commonfunctions';

import {
  ClockIcon,
  GraphIcon,
  FilterIcon,
  FoldUpIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useState, useCallback, useRef} from 'react';
import {Info} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSpring, animated, config} from 'react-spring';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({S: 768});

function PureCell({statistic, data}) {
  const total = getStatistic(data, 'total', statistic);
  const delta = getStatistic(data, 'delta', statistic);

  const spring = useSpring(
    {
      total: total,
      delta: delta,
      from: {
        total: total,
        delta: delta,
      },
    },
    config.gentle
  );

  return (
    <div className="cell statistic">
      {statistic !== 'active' && (
        <animated.div className={classnames('delta', `is-${statistic}`)}>
          {spring.delta.interpolate((delta) =>
            delta > 0
              ? '\u2191' + formatNumber(Math.floor(delta))
              : delta < 0
              ? '\u2193' + formatNumber(Math.floor(Math.abs(delta)))
              : ''
          )}
        </animated.div>
      )}
      <animated.div className="total">
        {spring.total.interpolate((total) => formatNumber(Math.floor(total)))}
      </animated.div>
    </div>
  );
}

const isCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data.total, currProps.data.total)) {
    return false;
  }
  if (!equal(prevProps.data.delta, currProps.data.delta)) {
    return false;
  }
  return true;
};

const Cell = React.memo(PureCell, isCellEqual);

function DistrictHeaderCell({handleSortClick, statistic, sortData}) {
  const breakpoint = useBreakpoint();
  const {t} = useTranslation();

  return (
    <div className="cell heading" onClick={() => handleSortClick(statistic)}>
      {sortData.sortColumn === statistic && (
        <div
          className={classnames('sort-icon', {
            invert: sortData.isAscending,
          })}
        >
          <FilterIcon size={10} />
        </div>
      )}
      <div
        className={classnames({
          [`is-${statistic}`]: breakpoint === 'S',
        })}
        title={capitalize(statistic)}
      >
        {breakpoint === 'S'
          ? capitalize(statistic.slice(0, 1))
          : t(capitalize(statistic))}
      </div>
    </div>
  );
}

function PureDistrictRow({
  stateCode,
  districtName,
  data,
  regionHighlighted,
  setRegionHighlighted,
}) {
  const {t} = useTranslation();

  const highlightDistrict = useCallback(() => {
    if (regionHighlighted.districtName !== districtName) {
      setRegionHighlighted(
        produce(regionHighlighted, (draftRegionHighlighted) => {
          draftRegionHighlighted.stateCode = stateCode;
          draftRegionHighlighted.districtName = districtName;
        })
      );
    }
  }, [regionHighlighted, districtName, setRegionHighlighted, stateCode]);

  return (
    <div
      className={classnames('row', 'district', {
        'is-highlighted': regionHighlighted?.districtName === districtName,
      })}
      onMouseEnter={highlightDistrict}
    >
      <div className="cell">
        <div className="state-name">{t(districtName)}</div>
        {data?.meta?.notes && (
          <Tooltip {...{data: data.meta.notes}}>
            <Info size={16} />
          </Tooltip>
        )}
      </div>

      {PRIMARY_STATISTICS.map((statistic) => (
        <Cell key={statistic} {...{statistic}} data={data} />
      ))}
    </div>
  );
}

const isDistrictRowEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  } else if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  } else if (
    !equal(prevProps.data?.['last_updated'], currProps.data?.['last_updated'])
  ) {
    return false;
  } else if (
    !equal(
      prevProps.regionHighlighted.districtName,
      currProps.regionHighlighted.districtName
    ) &&
    (equal(prevProps.regionHighlighted.districtName, prevProps.districtName) ||
      equal(currProps.regionHighlighted.districtName, currProps.districtName))
  ) {
    return false;
  }
  return true;
};
const DistrictRow = React.memo(PureDistrictRow, isDistrictRowEqual);

function Row({stateCode, data, regionHighlighted, setRegionHighlighted}) {
  const [showDistricts, setShowDistricts] = useState(false);
  const [sortData, setSortData] = useLocalStorage('districtSortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const history = useHistory();
  const {t} = useTranslation();

  const rowElement = useRef();

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
    (districtNameA, districtNameB) => {
      if (sortData.sortColumn !== 'districtName') {
        return sortData.isAscending
          ? getStatistic(
              data.districts[districtNameA],
              'total',
              sortData.sortColumn
            ) -
              getStatistic(
                data.districts[districtNameB],
                'total',
                sortData.sortColumn
              )
          : getStatistic(
              data.districts[districtNameB],
              'total',
              sortData.sortColumn
            ) -
              getStatistic(
                data.districts[districtNameA],
                'total',
                sortData.sortColumn
              );
      } else {
        return sortData.isAscending
          ? districtNameA.localeCompare(districtNameB)
          : districtNameB.localeCompare(districtNameA);
      }
    },
    [sortData, data]
  );

  const highlightState = useCallback(() => {
    if (regionHighlighted.stateCode !== stateCode) {
      setRegionHighlighted(
        produce(regionHighlighted, (draftRegionHighlighted) => {
          draftRegionHighlighted.stateCode = stateCode;
          draftRegionHighlighted.districtName = null;
        })
      );
    }
  }, [regionHighlighted, setRegionHighlighted, stateCode]);

  const _setShowDistrict = useCallback(() => {
    if (data.districts) {
      setShowDistricts(!showDistricts);
    }
  }, [showDistricts, data]);

  const spring = useSpring({
    from: {opacity: 0},
    to: {opacity: 1},
    config: config.gentle,
  });

  return (
    <React.Fragment>
      <animated.div
        className={classnames(
          'row',
          {'is-total': stateCode === 'TT'},
          {'is-highlighted': regionHighlighted?.stateCode === stateCode}
        )}
        onMouseEnter={highlightState}
        onClick={_setShowDistrict}
        style={spring}
        ref={rowElement}
      >
        <div className="cell">
          <div className="state-name">{t(STATE_NAMES[stateCode])}</div>
          {data?.meta?.notes && (
            <Tooltip {...{data: data.meta.notes}}>
              <Info size={16} />
            </Tooltip>
          )}
        </div>

        {PRIMARY_STATISTICS.map((statistic) => (
          <Cell key={statistic} {...{data, statistic}} />
        ))}
      </animated.div>

      {showDistricts && (
        <React.Fragment>
          <div className="state-meta">
            {data?.meta?.['last_updated'] && (
              <p className="last-updated">
                <ClockIcon />
                {capitalize(
                  `${formatLastUpdated(data.meta.last_updated)} ${t('ago')}`
                )}
              </p>
            )}
            <div
              className="state-page"
              onClick={() => {
                history.push(`state/${stateCode}`);
              }}
            >
              <GraphIcon />
              <span>
                {t('See more details on {{state}}', {
                  state: stateCode,
                })}
              </span>
            </div>
          </div>

          <div className={classnames('row', 'heading')}>
            <div
              className="cell heading"
              onClick={() => handleSortClick('districtName')}
            >
              <div className="district-name">{t('District')}</div>
              {sortData.sortColumn === 'districtName' && (
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
              <DistrictHeaderCell
                key={statistic}
                {...{statistic, sortData, handleSortClick}}
              />
            ))}
          </div>
        </React.Fragment>
      )}

      {showDistricts &&
        Object.keys(data.districts)
          .sort((a, b) => sortingFunction(a, b))
          .map((districtName) => (
            <DistrictRow
              key={districtName}
              {...{
                districtName,
                regionHighlighted,
                setRegionHighlighted,
                stateCode,
              }}
              data={data.districts[districtName]}
            />
          ))}

      {showDistricts && (
        <div className="spacer">
          <p>{`End of ${STATE_NAMES[stateCode]}'s districts`}</p>
          <div
            className="fold"
            onClick={() => {
              setShowDistricts(false);
              rowElement.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            <FoldUpIcon />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  } else if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  } else if (
    (!equal(
      prevProps.regionHighlighted.stateCode,
      currProps.regionHighlighted.stateCode
    ) &&
      equal(prevProps.regionHighlighted.stateCode, prevProps.stateCode)) ||
    equal(currProps.regionHighlighted.stateCode, currProps.stateCode)
  ) {
    return false;
  } else if (
    (!equal(
      prevProps.regionHighlighted.districtName,
      currProps.regionHighlighted.districtName
    ) &&
      equal(
        prevProps.regionHighlighted.districtName,
        prevProps.districtName
      )) ||
    equal(currProps.regionHighlighted.districtName, currProps.districtName)
  ) {
    return false;
  } else return true;
};

export default React.memo(Row, isEqual);
