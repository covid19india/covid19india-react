import {PRIMARY_STATISTICS, STATE_CODES} from '../constants';
import {formatNumber, capitalize, abbreviate} from '../utils/commonfunctions';

import Tooltip from '@primer/components/lib/Tooltip';
import {
  ArrowUpIcon,
  InfoIcon,
  TriangleUpIcon,
  TriangleDownIcon,
} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useState, useCallback, useMemo} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function PureCell({statistic, data}) {
  const ArrowUp = useMemo(
    () => <ArrowUpIcon size={10.5} verticalAlign={-2.1} />,
    []
  );

  const total = data.total[statistic];
  const delta = data.delta[statistic];

  return (
    <td>
      <span className={classnames('delta', `is-${statistic}`)}>
        {delta > 0 && ArrowUp}
        {delta > 0 && formatNumber(delta)}
      </span>
      <span className="total">{formatNumber(total) || '-'}</span>
    </td>
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
    </td>
  );
}

function PureDistrictRow({
  districtName,
  data: original,
  regionHighlighted,
  onHighlightDistrict,
  sortedDistricts,
}) {
  const {t} = useTranslation();

  const data = useMemo(() => {
    ['total', 'delta'].map((groupType) => {
      original[groupType] = produce(original[groupType], (draftDistrict) => {
        draftDistrict['active'] =
          draftDistrict.confirmed -
          draftDistrict.recovered -
          draftDistrict.deceased;
      });
    });
    return original;
  }, [original]);

  return (
    <tr
      className={classnames('district', {
        'is-highlighted': regionHighlighted?.districtName === districtName,
      })}
      // onMouseEnter={() => onHighlightDistrict(districtName, null)}
    >
      <td>
        <div className="title-chevron">
          <span className="title-icon">
            {t(districtName)}
            {data.notes && (
              <Tooltip aria-label={data.notes}>
                <Icon.Info />
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
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  if (equal(prevProps.regionHighlighted?.district, prevProps.district)) {
    return false;
  }
  if (equal(currProps.regionHighlighted?.district, currProps.district)) {
    return false;
  }
  return true;
};

const DistrictRow = React.memo(PureDistrictRow, isDistrictRowEqual);

function Row({
  stateCode,
  data,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
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

  // const _onHighlightState = useCallback(
  //   (state) => {
  //     if (!equal(state.state, regionHighlighted?.state)) {
  //       onHighlightState(state);
  //     }
  //   },
  //   [onHighlightState, regionHighlighted]
  // );

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
          ? parseInt(data.districts[districtNameA].total[sortData.sortColumn]) -
              parseInt(data.districts[districtNameB].total[sortData.sortColumn])
          : parseInt(data.districts[districtNameB].total[sortData.sortColumn]) -
              parseInt(
                data.districts[districtNameA].total[sortData.sortColumn]
              );
      } else {
        return sortData.isAscending
          ? districtNameA.localeCompare(districtNameB)
          : districtNameB.localeCompare(districtNameA);
      }
    },
    [sortData, data]
  );

  return (
    <React.Fragment>
      <tr
        className={classnames(
          'state',
          {'is-total': stateCode === 'TT'},
          {'is-highlighted': null}
        )}
        // onMouseEnter={() => _onHighlightState(state)}
        onClick={
          stateCode !== 'TT'
            ? () => {
                setShowDistricts(!showDistricts);
              }
            : null
        }
      >
        <td>
          <div className="title-chevron">
            {stateCode !== 'TT' && Chevron}
            <span className="title-icon">
              {t(STATE_CODES[stateCode])}

              {data.notes && (
                <Tooltip
                  className="tooltip"
                  aria-label={data.notes}
                  wrap={true}
                  direction={'e'}
                  noDelay={true}
                >
                  <InfoIcon size={'small'} />
                </Tooltip>
              )}
            </span>
          </div>
        </td>

        {PRIMARY_STATISTICS.map((statistic) => (
          <Cell key={statistic} {...{data, statistic}} />
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
            <td colSpan={4} style={{paddingBottom: 0}}>
              <p className="spacer"></p>
              <p>{data.last_updated}</p>
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
                state: t(STATE_CODES[stateCode]),
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
              {...{districtName}}
              data={data.districts[districtName]}
              regionHighlighted={regionHighlighted}
              onHighlightDistrict={onHighlightDistrict}
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
  if (!equal(prevProps.data.total, currProps.data.total)) {
    return false;
  }
  if (!equal(prevProps.statecode, currProps.statecode)) {
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

export default React.memo(Row, isEqual);
