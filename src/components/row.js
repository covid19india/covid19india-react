import {
  formatDate,
  formatDateAbsolute,
  formatNumber,
} from '../utils/commonfunctions';

import {formatDistance} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useState, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {useUpdateEffect} from 'react-use';

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.regionHighlighted, currProps.regionHighlighted)) {
    return false;
  }
  return true;
};

function Row({
  state,
  districts,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
  const [sortedDistricts, setSortedDistricts] = useState(districts);
  const [showDistricts, setShowDistricts] = useState(false);
  const [sortData, setSortData] = useState({
    sortColumn: 'confirmed',
    isAscending: false,
  });

  const onHighlightStateWrapper = useCallback(
    (state) => {
      if (!equal(state, regionHighlighted?.state)) {
        onHighlightState(state);
      }
    },
    [onHighlightState, regionHighlighted]
  );

  const sortDistricts = useCallback(
    (aDistricts) => {
      const sorted = {};
      if (aDistricts) {
        Object.keys(aDistricts)
          .sort((district1, district2) => {
            const sortColumn = sortData.sortColumn;
            const value1 =
              sortColumn === 'district'
                ? district1
                : parseInt(aDistricts[district1][sortData.sortColumn]);
            const value2 =
              sortColumn === 'district'
                ? district2
                : parseInt(aDistricts[district2][sortData.sortColumn]);
            const comparisonValue =
              value1 > value2
                ? 1
                : value1 === value2 && district1 > district2
                ? 1
                : -1;
            return sortData.isAscending
              ? comparisonValue
              : comparisonValue * -1;
          })
          .forEach((key) => {
            sorted[key] = aDistricts[key];
          });
        setSortedDistricts(sorted);
      }
    },
    [sortData]
  );

  const handleSort = (column) => {
    const isAscending =
      sortData.sortColumn === column
        ? !sortData.isAscending
        : sortData.sortColumn === 'district';
    setSortData({
      sortColumn: column,
      isAscending: isAscending,
    });
  };

  useUpdateEffect(() => {
    sortDistricts();
  }, [sortData]);

  return (
    <React.Fragment>
      <tr
        className={`state ${state.state === 'TT' ? 'is-total' : ''}`}
        onMouseEnter={() => onHighlightStateWrapper(state)}
        onClick={() => {
          setShowDistricts(!showDistricts);
        }}
      >
        <td style={{fontWeight: 600}}>
          <div className="table__title-wrapper">
            {state.state !== 'TT' && (
              <span
                className={`dropdown ${
                  showDistricts ? 'rotateRightDown' : 'rotateDownRight'
                }`}
              >
                <Icon.ChevronDown />
              </span>
            )}
            <span className="actual__title-wrapper">
              {state.state}
              {state.statenotes && (
                <span>
                  <span
                    data-tip={[`${state.statenotes}`]}
                    data-event="touchstart mouseover"
                    data-event-off="mouseleave"
                  >
                    <Icon.Info />
                  </span>
                  <ReactTooltip
                    place="right"
                    type="dark"
                    effect="solid"
                    multiline={true}
                    scrollHide={true}
                    globalEventOff="click"
                  />
                </span>
              )}
            </span>
          </div>
        </td>
        <td>
          <span className="deltas" style={{color: '#ff073a'}}>
            {state.deltaconfirmed > 0 && <Icon.ArrowUp />}
            {state.deltaconfirmed > 0 ? `${state.deltaconfirmed}` : ''}
          </span>
          <span className="table__count-text">
            {parseInt(state.confirmed) === 0
              ? '-'
              : formatNumber(state.confirmed)}
          </span>
        </td>
        <td
          style={{
            color: parseInt(state.active) === 0 ? '#B5B5B5' : 'inherit',
          }}
        >
          {parseInt(state.active) === 0 ? '-' : formatNumber(state.active)}
        </td>
        <td
          style={{
            color: parseInt(state.recovered) === 0 ? '#B5B5B5' : 'inherit',
          }}
        >
          <span className="deltas" style={{color: '#28a745'}}>
            {state.deltarecovered > 0 && <Icon.ArrowUp />}
            {state.deltarecovered > 0 ? `${state.deltarecovered}` : ''}
          </span>
          <span className="table__count-text">
            {parseInt(state.recovered) === 0
              ? '-'
              : formatNumber(state.recovered)}
          </span>
        </td>
        <td
          style={{
            color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit',
          }}
        >
          <span className="deltas" style={{color: '#6c757d'}}>
            {state.deltadeaths > 0 && <Icon.ArrowUp />}
            {state.deltadeaths > 0 ? `${state.deltadeaths}` : ''}
          </span>
          <span className="table__count-text">
            {parseInt(state.deaths) === 0 ? '-' : formatNumber(state.deaths)}
          </span>
        </td>
      </tr>

      {showDistricts && (
        <React.Fragment>
          <tr className={'state-last-update'}>
            <td colSpan={3}>
              <h6
                title={
                  isNaN(Date.parse(formatDate(state.lastupdatedtime)))
                    ? ''
                    : formatDateAbsolute(state.lastupdatedtime)
                }
              >
                {isNaN(Date.parse(formatDate(state.lastupdatedtime)))
                  ? ''
                  : `Last updated ${formatDistance(
                      new Date(formatDate(state.lastupdatedtime)),
                      new Date()
                    )} ago`}
              </h6>
              {sortedDistricts?.Unknown && (
                <div className="disclaimer">
                  <Icon.AlertCircle />
                  {`District-wise numbers are under reconciliation`}
                </div>
              )}
            </td>
            <td className="state-page-link" colSpan={2}>
              <Link to={`state/${state.statecode}`}>Visit state page</Link>
            </td>
          </tr>

          <tr className={`district-heading`}>
            <td onClick={(e) => handleSort('district')}>
              <div className="heading-content">
                <abbr title="District">District</abbr>
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
            <td onClick={(e) => handleSort('confirmed')}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-cherry' : ''}`}
                  title="Confirmed"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'C'
                      : 'Cnfmd'
                    : 'Confirmed'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'confirmed' ? 'initial' : 'none',
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
            <td onClick={(e) => handleSort('active')}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-blue' : ''}`}
                  title="Active"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'A'
                      : 'Actv'
                    : 'Active'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'active' ? 'initial' : 'none',
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
            <td onClick={(e) => handleSort('recovered')}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-green' : ''}`}
                  title="Recovered"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'R'
                      : 'Rcvrd'
                    : 'Recovered'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'recovered' ? 'initial' : 'none',
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
            <td onClick={(e) => handleSort('deceased')}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-gray' : ''}`}
                  title="Deaths"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'D'
                      : 'Dcsd'
                    : 'Deceased'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'deceased' ? 'initial' : 'none',
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
          </tr>
        </React.Fragment>
      )}

      {sortedDistricts &&
        showDistricts &&
        Object.keys(sortedDistricts)
          .filter((district) => district.toLowerCase() !== 'unknown')
          .map((district, index) => {
            if (district.toLowerCase() !== 'unknown') {
              return (
                <tr
                  key={index}
                  className={`district ${index % 2 === 0 ? 'is-odd' : ''}`}
                  style={{
                    background: index % 2 === 0 ? '#f8f9fa' : '',
                  }}
                  onMouseEnter={() =>
                    onHighlightDistrict(district, state, index)
                  }
                  onMouseLeave={() => onHighlightDistrict?.()}
                >
                  <td className="unknown" style={{fontWeight: 600}}>
                    {district}
                    <span>
                      <span
                        data-for="unknown"
                        data-tip={[[sortedDistricts[district].notes]]}
                        data-event="touchstart mouseover"
                        data-event-off="mouseleave"
                      >
                        {sortedDistricts[district].notes && <Icon.Info />}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="deltas" style={{color: '#ff073a'}}>
                      {sortedDistricts[district].delta.confirmed > 0 && (
                        <Icon.ArrowUp />
                      )}
                      {sortedDistricts[district].delta.confirmed > 0
                        ? `${sortedDistricts[district].delta.confirmed}`
                        : ''}
                    </span>
                    <span className="table__count-text">
                      {formatNumber(sortedDistricts[district].confirmed)}
                    </span>
                  </td>
                  <td>{formatNumber(sortedDistricts[district].active)}</td>
                  <td>
                    <span className="deltas" style={{color: '#28a745'}}>
                      {sortedDistricts[district].delta.recovered > 0 && (
                        <Icon.ArrowUp />
                      )}
                      {sortedDistricts[district].delta.recovered > 0
                        ? `${sortedDistricts[district].delta.recovered}`
                        : ''}
                    </span>
                    <span className="table__count-text">
                      {formatNumber(sortedDistricts[district].recovered)}
                    </span>
                  </td>
                  <td>
                    <span className="deltas" style={{color: '#6c757d'}}>
                      {sortedDistricts[district].delta.deceased > 0 && (
                        <Icon.ArrowUp />
                      )}
                      {sortedDistricts[district].delta.deceased > 0
                        ? `${sortedDistricts[district].delta.deceased}`
                        : ''}
                    </span>
                    <span className="table__count-text">
                      {formatNumber(sortedDistricts[district].deceased)}
                    </span>
                  </td>
                </tr>
              );
            }
            return null;
          })}

      {sortedDistricts?.Unknown && showDistricts && (
        <React.Fragment>
          <tr className={`district`}>
            <td className="unknown" style={{fontWeight: 600}}>
              Unknown
              <span>
                <span
                  data-for="unknown"
                  data-tip={
                    'Awaiting patient-level details from State Bulletin'
                  }
                  data-event="touchstart mouseover"
                  data-event-off="mouseleave"
                >
                  <Icon.Info />
                </span>
              </span>
            </td>
            <td>
              <span className="deltas" style={{color: '#ff073a'}}>
                {sortedDistricts['Unknown'].delta.confirmed > 0 && (
                  <Icon.ArrowUp />
                )}
                {sortedDistricts['Unknown'].delta.confirmed > 0
                  ? `${sortedDistricts['Unknown'].delta.confirmed}`
                  : ''}
              </span>
              <span className="table__count-text">
                {formatNumber(sortedDistricts['Unknown'].confirmed)}
              </span>
            </td>
            <td>{formatNumber(sortedDistricts['Unknown'].active)}</td>
            <td>
              <span className="deltas" style={{color: '#28a745'}}>
                {sortedDistricts['Unknown'].delta.recovered > 0 && (
                  <Icon.ArrowUp />
                )}
                {sortedDistricts['Unknown'].delta.recovered > 0
                  ? `${sortedDistricts['Unknown'].delta.recovered}`
                  : ''}
              </span>
              <span className="table__count-text">
                {formatNumber(sortedDistricts['Unknown'].recovered)}
              </span>
            </td>
            <td>
              <span className="deltas" style={{color: '#6c757d'}}>
                {sortedDistricts['Unknown'].delta.deceased > 0 && (
                  <Icon.ArrowUp />
                )}
                {sortedDistricts['Unknown'].delta.deceased > 0
                  ? `${sortedDistricts['Unknown'].delta.deceased}`
                  : ''}
              </span>
              <span className="table__count-text">
                {formatNumber(sortedDistricts['Unknown'].deceased)}
              </span>
            </td>
          </tr>
        </React.Fragment>
      )}

      {showDistricts && (
        <React.Fragment>
          <tr>
            <td colSpan={5}>
              <ReactTooltip
                id="unknown"
                place="right"
                type="dark"
                effect="solid"
                multiline={true}
                scrollHide={true}
                globalEventOff="click"
              />
            </td>
          </tr>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default React.memo(Row, isEqual);
