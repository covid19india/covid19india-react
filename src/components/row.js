import Tooltip from './tooltip';

import {PRIMARY_STATISTICS, STATE_NAMES} from '../constants';
import {
  abbreviate,
  capitalize,
  formatLastUpdated,
  formatNumber,
  getStatistic,
} from '../utils/commonfunctions';

import {TriangleUpIcon, TriangleDownIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useState, useCallback} from 'react';
import {Info} from 'react-feather';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSpring, animated, config} from 'react-spring';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({L: 768, S: 350});

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
    <td onClick={() => handleSortClick(statistic)}>
      <div className="heading-content">
        <abbr
          className={classnames({
            [`is-${statistic}`]: breakpoint === 'S',
          })}
          title={capitalize(statistic)}
        >
          {breakpoint === 'S'
            ? capitalize(statistic.slice(0, 1))
            : breakpoint === 'L'
            ? capitalize(abbreviate(statistic))
            : t(capitalize(statistic))}
        </abbr>
        {sortData.sortColumn === statistic && (
          <div>
            {sortData.isAscending && <TriangleUpIcon />}
            {!sortData.isAscending && <TriangleDownIcon />}
            <div />
          </div>
        )}
      </div>
    </td>
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
    <tr
      className={classnames('district', {
        'is-highlighted': regionHighlighted?.districtName === districtName,
      })}
      onMouseEnter={highlightDistrict}
    >
      <td>
        <div className="title-chevron">
          <span className="title-icon">
            <span className="title">{t(districtName)}</span>
            {data?.meta?.notes && (
              <Tooltip {...{data: data.meta.notes}}>
                <Info />
              </Tooltip>
            )}
          </span>
        </div>
      </td>

      {PRIMARY_STATISTICS.map((statistic) => (
        <Cell key={statistic} {...{statistic}} data={data} />
      ))}
    </tr>
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

  return (
    <React.Fragment>
      <div
        className={classnames(
          'row',
          {'is-total': stateCode === 'TT'},
          {'is-highlighted': regionHighlighted?.stateCode === stateCode}
        )}
        onMouseEnter={highlightState}
        onClick={_setShowDistrict}
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
      </div>

      {showDistricts && (
        <React.Fragment>
          <tr className="is-spacer">
            <td colSpan={5}>
              <p />
            </td>
          </tr>

          <tr className={'state-last-update'}>
            <td colSpan={4} style={{paddingBottom: 0}}>
              <p className="spacer"></p>
              {data?.meta?.['last_updated'] && (
                <p>
                  {`Last updated ${formatLastUpdated(
                    data.meta.last_updated
                  )} ${t('ago')}`}
                </p>
              )}
              {data.districts['Unknown'] && (
                <div className="disclaimer">
                  <Icon.AlertCircle />
                  {t('District-wise numbers are under reconciliation')}
                </div>
              )}
            </td>
            <td
              align="center"
              className="state-page-link"
              colSpan={1}
              style={{width: '1.5rem'}}
              onClick={() => {
                history.push(`state/${stateCode}`);
              }}
            >
              {t('See more details on {{state}}', {
                state: t(STATE_NAMES[stateCode]),
              })}
            </td>
          </tr>

          <tr className={classnames('district-heading')}>
            <td onClick={() => handleSortClick('districtName')}>
              <div className="heading-content">
                <abbr title="District">{t('District')}</abbr>
                {sortData.sortColumn === 'districtName' && (
                  <div>
                    {sortData.isAscending && <TriangleDownIcon />}
                    {!sortData.isAscending && <TriangleUpIcon />}
                  </div>
                )}
              </div>
            </td>

            {PRIMARY_STATISTICS.map((statistic) => (
              <DistrictHeaderCell
                key={statistic}
                {...{statistic, sortData, handleSortClick}}
              />
            ))}
          </tr>
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
        <tr className="is-spacer">
          <td colSpan={5}>
            <p />
          </td>
        </tr>
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
