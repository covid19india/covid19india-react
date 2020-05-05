import {STATE_ROW_STATISTICS, DISTRICT_ROW_STATISTICS} from '../constants';
import {
  formatDate,
  formatNumber,
  capitalize,
  abbreviate,
} from '../utils/commonfunctions';

import classnames from 'classnames';
import {formatDistance} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useState, useCallback, useMemo} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {createBreakpoint, useLocalStorage, useEffectOnce} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function StateCell({state, statistic}) {
  const ArrowUp = useMemo(() => <Icon.ArrowUp />, []);

  return (
    <td>
      <span className={classnames('delta', `is-${statistic}`)}>
        {state[`delta${statistic}`] > 0 && ArrowUp}
        {state[`delta${statistic}`] > 0 && state[`delta${statistic}`]}
      </span>
      <span className="total">
        {state[statistic] === 0 ? '-' : formatNumber(state[statistic])}
      </span>
    </td>
  );
}

function DistrictHeaderCell({handleSort, statistic, sortData}) {
  const breakpoint = useBreakpoint();
  const {t} = useTranslation();

  return (
    <td onClick={() => handleSort(statistic)}>
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
            : t(capitalize(statistic === 'deaths' ? 'deceased' : statistic))}
        </abbr>
        <div
          style={{
            display: sortData.sortColumn === statistic ? 'initial' : 'none',
          }}
        >
          {sortData.isAscending ? (
            <div className="arrow-up" />
          ) : (
            <div className="arrow-down" />
          )}
        </div>
      </div>
    </td>
  );
}

function PureDistrictCell({district, statistic}) {
  return (
    <td>
      <span className={classnames('delta', `is-${statistic}`)}>
        {district.delta[statistic] > 0 && <Icon.ArrowUp />}
        {district.delta[statistic] > 0 && district.delta[statistic]}
      </span>
      <span className="total">{formatNumber(district[statistic])}</span>
    </td>
  );
}

const DistrictCell = React.memo(PureDistrictCell);

const isDistrictRowEqual = (prevProps, currProps) => {
  if (equal(prevProps.regionHighlighted?.district, prevProps.district)) {
    return false;
  }
  if (equal(currProps.regionHighlighted?.district, currProps.district)) {
    return false;
  }
  return true;
};

function PureDistrictRow({
  regionHighlighted,
  district,
  state,
  zone,
  onHighlightDistrict,
  sortedDistricts,
  districts,
}) {
  const {t} = useTranslation();

  return (
    <tr
      key={district.district}
      className={classnames('district', {
        'is-highlighted': regionHighlighted?.district === district,
      })}
      onMouseEnter={() => onHighlightDistrict(district, state)}
    >
      <td className={classnames(`is-${zone?.zone}`)}>
        <div className="title-chevron">
          <span className="title-icon">
            {t(district)}
            <span
              data-for="district"
              data-tip={[[sortedDistricts[district].notes]]}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              onClick={(e) => e.stopPropagation()}
            >
              {sortedDistricts[district].notes && <Icon.Info />}
            </span>
          </span>
        </div>
      </td>

      {DISTRICT_ROW_STATISTICS.map((statistic) => (
        <DistrictCell
          key={statistic}
          district={districts[district]}
          statistic={statistic}
        />
      ))}
    </tr>
  );
}

const DistrictRow = React.memo(PureDistrictRow, isDistrictRowEqual);

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.state.state, currProps.state.state)) {
    return false;
  }
  if (
    !equal(
      prevProps.regionHighlighted?.state,
      currProps.regionHighlighted?.state
    )
  ) {
    return false;
  }
  if (
    !equal(
      prevProps.regionHighlighted?.district,
      currProps.regionHighlighted?.district
    )
  ) {
    return false;
  }
  return true;
};

function Row({
  index,
  state,
  districts,
  zones,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
  const [sortedDistricts, setSortedDistricts] = useState(districts);
  const [showDistricts, setShowDistricts] = useState(false);
  const [sortData, setSortData] = useLocalStorage('districtSortData', {
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const history = useHistory();
  const {t} = useTranslation();

  const Chevron = useMemo(
    () => (
      <span
        className={classnames(
          'dropdown',
          {rotateRightDown: showDistricts},
          {rotateDownRight: !showDistricts}
        )}
      >
        <Icon.ChevronDown />
      </span>
    ),
    [showDistricts]
  );

  const _onHighlightState = useCallback(
    (state) => {
      if (!equal(state.state, regionHighlighted?.state)) {
        onHighlightState(state);
      }
    },
    [onHighlightState, regionHighlighted]
  );

  const doSort = useCallback(
    (sortData) => {
      const sorted = {};
      Object.keys(sortedDistricts)
        .sort((district1, district2) => {
          if (sortData.sortColumn !== 'district') {
            return sortData.isAscending
              ? parseInt(sortedDistricts[district1][sortData.sortColumn]) -
                  parseInt(sortedDistricts[district2][sortData.sortColumn])
              : parseInt(sortedDistricts[district2][sortData.sortColumn]) -
                  parseInt(sortedDistricts[district1][sortData.sortColumn]);
          } else {
            return sortData.isAscending
              ? district1.localeCompare(district2)
              : district2.localeCompare(district1);
          }
        })
        .forEach((key) => {
          sorted[key] = sortedDistricts[key];
        });
      setSortedDistricts(sorted);
    },
    [sortedDistricts]
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
    if (state.statecode !== 'TT') doSort(sortData);
  });

  return (
    <React.Fragment>
      <tr
        className={classnames(
          'state',
          {'is-total': state.statecode === 'TT'},
          {'is-highlighted': regionHighlighted?.state === state.state},
          {'is-odd': index % 2 === 0}
        )}
        onMouseEnter={() => _onHighlightState(state)}
        onClick={
          state.statecode !== 'TT'
            ? () => {
                setShowDistricts(!showDistricts);
              }
            : null
        }
      >
        <td>
          <div className="title-chevron">
            {state.statecode !== 'TT' && Chevron}
            <span className="title-icon">
              {t(state.state)}

              <span
                data-tip={[t(`${state.statenotes}`)]}
                data-event="touchstart mouseover"
                data-event-off="mouseleave"
                onClick={(e) => e.stopPropagation()}
              >
                {state.statenotes && <Icon.Info />}
              </span>
            </span>
          </div>
        </td>

        {STATE_ROW_STATISTICS.map((statistic, index) => (
          <StateCell key={index} state={state} statistic={statistic} />
        ))}
      </tr>

      {showDistricts && (
        <React.Fragment>
          <tr className="is-spacer">
            <td colSpan={5}>
              <p />
            </td>
          </tr>

          <tr className={'state-last-update'}>
            <td colSpan={3} style={{paddingBottom: 0}}>
              <p className="spacer"></p>
              <p>
                {isNaN(Date.parse(formatDate(state.lastupdatedtime)))
                  ? ''
                  : `${t('Last updated')} ${formatDistance(
                      new Date(formatDate(state.lastupdatedtime)),
                      new Date()
                    )} ${t('ago')}`}
              </p>
              {sortedDistricts?.Unknown && (
                <div className="disclaimer">
                  <Icon.AlertCircle />
                  {t('District-wise numbers are under reconciliation')}
                </div>
              )}
            </td>
            <td
              align="center"
              className="state-page-link"
              colSpan={2}
              onClick={() => {
                history.push(`state/${state.statecode}`);
              }}
            >{`View ${t(state.state)}'s Page`}</td>
          </tr>

          <tr className={classnames('district-heading')}>
            <td onClick={() => handleSort('district')}>
              <div className="heading-content">
                <abbr title="District">{t('District')}</abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'district' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </td>

            {DISTRICT_ROW_STATISTICS.map((statistic, index) => (
              <DistrictHeaderCell
                key={index}
                handleSort={handleSort}
                statistic={statistic}
                sortData={sortData}
              />
            ))}
          </tr>
        </React.Fragment>
      )}

      {showDistricts &&
        Object.keys(sortedDistricts).map((district, index) => (
          <DistrictRow
            key={district}
            state={state}
            district={district}
            districts={districts}
            zone={zones[district]}
            sortedDistricts={sortedDistricts}
            regionHighlighted={regionHighlighted}
            onHighlightDistrict={onHighlightDistrict}
          />
        ))}

      {showDistricts && (
        <tr className="is-spacer">
          <td colSpan={5}>
            <p />
            <ReactTooltip
              id="district"
              place="right"
              type="dark"
              effect="solid"
              multiline={true}
              scrollHide={true}
              globalEventOff="click"
            />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default React.memo(Row, isEqual);
