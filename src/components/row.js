import {
  formatDate,
  formatDateAbsolute,
  formatNumber,
} from '../utils/commonfunctions';

import {formatDistance} from 'date-fns';
import React, {useState, useEffect, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

function Row(props) {
  const [state, setState] = useState(props.state);
  const [districts, setDistricts] = useState(props.districts);
  const [sortedDistricts, setSortedDistricts] = useState(props.districts);
  const [showDistricts, setShowDistricts] = useState(false);
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('district.sortColumn')
      ? localStorage.getItem('district.sortColumn')
      : 'confirmed',
    isAscending: localStorage.getItem('district.isAscending')
      ? localStorage.getItem('district.isAscending') === 'true'
      : false,
  });

  useEffect(() => {
    setState(props.state);
  }, [props.state]);

  useEffect(() => {
    setDistricts(props.districts);
    setSortedDistricts(props.districts);
  }, [props.districts]);

  const handleReveal = () => {
    props.handleReveal(props.state.state);
    setShowDistricts(!showDistricts);
  };

  const handleTooltip = (e) => {
    e.stopPropagation();
  };

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
                : parseInt(aDistricts[district1].confirmed);
            const value2 =
              sortColumn === 'district'
                ? district2
                : parseInt(aDistricts[district2].confirmed);
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
    [sortData.isAscending, sortData.sortColumn]
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
    localStorage.setItem('district.sortColumn', column);
    localStorage.setItem('district.isAscending', isAscending);
  };

  useEffect(() => {
    sortDistricts(districts);
  }, [districts, sortData, sortDistricts]);

  return (
    <React.Fragment>
      <tr
        className={`state ${props.total ? 'is-total' : ''} ${
          props.index % 2 === 0 ? 'is-odd' : ''
        }`}
        onMouseEnter={() => props.onHighlightState?.(state, props.index)}
        onMouseLeave={() => props.onHighlightState?.()}
        onClick={!props.total ? handleReveal : null}
        style={{background: props.index % 2 === 0 ? '#f8f9fa' : ''}}
      >
        <td style={{fontWeight: 600}}>
          <div className="table__title-wrapper">
            <span
              className={`dropdown ${
                props.reveal && showDistricts
                  ? 'rotateRightDown'
                  : 'rotateDownRight'
              }`}
              onClick={() => {
                handleReveal();
              }}
            >
              <Icon.ChevronDown />
            </span>
            <span className="actual__title-wrapper">
              {state.state}
              {state.statenotes && (
                <span onClick={handleTooltip}>
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
          style={{color: parseInt(state.active) === 0 ? '#B5B5B5' : 'inherit'}}
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
          style={{color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit'}}
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
            <td colSpan={2}>
              <div className="last-update">
                <h6>Last updated&nbsp;</h6>
                <h6
                  title={
                    isNaN(Date.parse(formatDate(props.state.lastupdatedtime)))
                      ? ''
                      : formatDateAbsolute(props.state.lastupdatedtime)
                  }
                >
                  {isNaN(Date.parse(formatDate(props.state.lastupdatedtime)))
                    ? ''
                    : `${formatDistance(
                        new Date(formatDate(props.state.lastupdatedtime)),
                        new Date()
                      )} ago`}
                </h6>
              </div>
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
            <td className="state-page-link" colSpan={3}>
              <Link to={`state/${state.statecode}`}>
                <div>
                  <abbr>Visit state page</abbr>
                  <Icon.ArrowRightCircle />
                </div>
              </Link>
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
                    props.onHighlightDistrict?.(district, state, props.index)
                  }
                  onMouseLeave={() => props.onHighlightDistrict?.()}
                >
                  <td style={{fontWeight: 600}}>{district}</td>
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
              <span onClick={handleTooltip}>
                <span
                  data-for="unknown"
                  data-tip={[
                    'Awaiting patient-level details from State Bulletin',
                  ]}
                  data-event="touchstart mouseover"
                  data-event-off="mouseleave"
                >
                  <Icon.Info />
                </span>
                <ReactTooltip
                  id="unknown"
                  place="right"
                  type="dark"
                  effect="solid"
                  multiline={true}
                  scrollHide={true}
                  globalEventOff="click"
                />
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
          </tr>
        </React.Fragment>
      )}

      <tr
        className={`spacer`}
        style={{display: props.reveal && !props.total ? '' : 'none'}}
      >
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </React.Fragment>
  );
}

export default React.memo(Row);
