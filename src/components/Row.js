import Cell from './Cell';
import DistrictRow from './DistrictRow';
import HeaderCell from './HeaderCell';
import Tooltip from './Tooltip';

import {
  STATE_NAMES,
  STATISTIC_CONFIGS,
  TABLE_STATISTICS,
  TABLE_STATISTICS_EXPANDED,
  UNKNOWN_DISTRICT_KEY,
} from '../constants';
import {
  capitalize,
  formatLastUpdated,
  getTableStatistic,
} from '../utils/commonFunctions';

import {
  AlertIcon,
  ClockIcon,
  FilterIcon,
  FoldUpIcon,
  GraphIcon,
  InfoIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useState, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSessionStorage} from 'react-use';

function Row({
  data,
  stateCode,
  districtName,
  isPerMillion,
  regionHighlighted,
  setRegionHighlighted,
  expandTable,
  lastUpdatedTT,
}) {
  const [showDistricts, setShowDistricts] = useState(false);
  const [sortData, setSortData] = useSessionStorage('districtSortData', {
    sortColumn: 'confirmed',
    isAscending: false,
    delta: false,
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
        const statisticConfig = STATISTIC_CONFIGS[sortData.sortColumn];
        const dataType =
          sortData.delta && !statisticConfig.hideDelta ? 'delta' : 'total';

        const statisticA = getTableStatistic(
          data.districts[districtNameA],
          sortData.sortColumn,
          isPerMillion,
          lastUpdatedTT
        )[dataType];
        const statisticB = getTableStatistic(
          data.districts[districtNameB],
          sortData.sortColumn,
          isPerMillion,
          lastUpdatedTT
        )[dataType];
        return sortData.isAscending
          ? statisticA - statisticB
          : statisticB - statisticA;
      } else {
        return sortData.isAscending
          ? districtNameA.localeCompare(districtNameB)
          : districtNameB.localeCompare(districtNameA);
      }
    },
    [sortData, data, isPerMillion, lastUpdatedTT]
  );

  const highlightState = useCallback(() => {
    if (stateCode) {
      if (regionHighlighted.stateCode !== stateCode) {
        setRegionHighlighted(
          produce(regionHighlighted, (draftRegionHighlighted) => {
            draftRegionHighlighted.stateCode = stateCode;
            draftRegionHighlighted.districtName = null;
          })
        );
      }
    } else if (districtName) {
      if (
        regionHighlighted.districtName !== districtName ||
        regionHighlighted.stateCode !== data.stateCode
      ) {
        setRegionHighlighted(
          produce(regionHighlighted, (draftRegionHighlighted) => {
            draftRegionHighlighted.stateCode = data.stateCode;
            draftRegionHighlighted.districtName = districtName;
          })
        );
      }
    }
  }, [
    data.stateCode,
    districtName,
    regionHighlighted,
    setRegionHighlighted,
    stateCode,
  ]);

  const _setShowDistrict = useCallback(() => {
    if (data.districts) {
      setShowDistricts(!showDistricts);
    }
  }, [showDistricts, data]);

  let districtNameStr = t(districtName);
  if (districtName === UNKNOWN_DISTRICT_KEY) {
    districtNameStr = `${t(UNKNOWN_DISTRICT_KEY)} [${t(
      STATE_NAMES[data.stateCode]
    )}]`;
  }

  const handleStatePageClick = useCallback(
    (stateCode) => {
      history.push(`state/${stateCode}`);
    },
    [history]
  );

  const handleCollapse = useCallback(() => {
    setShowDistricts(false);
    rowElement.current.scrollIntoView({
      block: 'start',
    });

    // eslint-disable-next-line
    const faux = stateCode;
  }, [stateCode]);

  const tableStatistics = expandTable
    ? TABLE_STATISTICS_EXPANDED
    : TABLE_STATISTICS;

  return (
    <React.Fragment>
      <div
        className={classnames(
          'row',
          {'is-total': stateCode === 'TT'},
          {
            'is-highlighted':
              (stateCode && regionHighlighted?.stateCode === stateCode) ||
              (districtName &&
                regionHighlighted?.districtName === districtName &&
                regionHighlighted?.stateCode === data.stateCode),
          }
        )}
        onMouseEnter={highlightState}
        onClick={_setShowDistrict}
        ref={rowElement}
      >
        <div className="cell">
          <div className="state-name fadeInUp">
            {t(STATE_NAMES[stateCode]) || districtNameStr}
          </div>
          {data?.meta?.notes && (
            <Tooltip {...{data: data.meta.notes}}>
              <InfoIcon size={16} />
            </Tooltip>
          )}
        </div>

        {tableStatistics.map((statistic) => (
          <Cell
            key={statistic}
            {...{data, statistic, isPerMillion, lastUpdatedTT}}
          />
        ))}
      </div>

      {showDistricts && (
        <React.Fragment>
          <div className="state-meta">
            <div className="state-meta-top">
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
                onClick={handleStatePageClick.bind(this, stateCode)}
              >
                <GraphIcon />
                <span>
                  {t('See more details on {{state}}', {
                    state: stateCode,
                  })}
                </span>
              </div>
            </div>

            {data.districts && UNKNOWN_DISTRICT_KEY in data.districts && (
              <div className="state-meta-bottom">
                <div className={classnames('disclaimer')}>
                  <AlertIcon />
                  <span>
                    {t('District-wise data not available in state bulletin')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={classnames('row', 'heading')}>
            <div
              className="cell heading"
              onClick={handleSortClick.bind(this, 'districtName')}
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

            {tableStatistics.map((statistic) => (
              <HeaderCell
                key={statistic}
                {...{statistic, sortData, setSortData}}
                handleSort={handleSortClick.bind(this, statistic)}
              />
            ))}
          </div>
        </React.Fragment>
      )}

      {showDistricts &&
        Object.keys(data.districts || {})
          .sort((a, b) => sortingFunction(a, b))
          .map((districtName) => (
            <DistrictRow
              data={data.districts[districtName]}
              key={districtName}
              {...{
                districtName,
                regionHighlighted,
                setRegionHighlighted,
                stateCode,
                isPerMillion,
                expandTable,
                lastUpdatedTT,
              }}
            />
          ))}

      {showDistricts && (
        <div className="spacer-row">
          <div className="spacer">
            <p>{`End of ${t(STATE_NAMES[stateCode])}'s districts`}</p>
            <div className="fold" onClick={handleCollapse}>
              <FoldUpIcon />
            </div>
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
  } else if (!equal(prevProps.isPerMillion, currProps.isPerMillion)) {
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
  } else if (!equal(prevProps.expandTable, currProps.expandTable)) {
    return false;
  } else return true;
};

export default React.memo(Row, isEqual);
