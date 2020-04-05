import React, {useState, useEffect, useCallback} from 'react';
import * as Icon from 'react-feather';
import {formatDate, formatDateAbsolute} from '../utils/common-functions';
import {formatDistance} from 'date-fns';
function Row(props) {
  const [state, setState] = useState(props.state);
  const [districts, setDistricts] = useState(props.districts);
  const [sortedDistricts, setSortedDistricts] = useState(props.districts);
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
      <span
        className={`dropdown ${
          props.reveal ? 'rotateRightDown' : 'rotateDownRight'
        }`}
        style={{display: !props.total ? '' : 'none'}}
        onClick={() => {
          handleReveal();
        }}
      >
        <Icon.ChevronDown />
      </span>
      <tr
        className={props.total ? 'state is-total' : 'state'}
        onMouseEnter={() => props.onHighlightState?.(state, props.index)}
        onMouseLeave={() => props.onHighlightState?.()}
        touchstart={() => props.onHighlightState?.(state, props.index)}
        onClick={!props.total ? handleReveal : null}
        style={{background: props.index % 2 === 0 ? '#f8f9fa' : ''}}
      >
        <td style={{fontWeight: 600}}>{state.state}</td>
        <td>
          <span className="deltas" style={{color: '#ff073a'}}>
            {state.deltaconfirmed > 0 && <Icon.ArrowUp />}
            {state.deltaconfirmed > 0 ? `${state.deltaconfirmed}` : ''}
          </span>
          {parseInt(state.confirmed) === 0 ? '-' : state.confirmed}
        </td>
        <td
          style={{color: parseInt(state.active) === 0 ? '#B5B5B5' : 'inherit'}}
        >
          {/* <span className="deltas" style={{color: '#007bff'}}>
            {!state.delta.active==0 && <Icon.ArrowUp/>}
            {state.delta.active>0 ? `${state.delta.active}` : ''}
          </span>*/}
          {parseInt(state.active) === 0 ? '-' : state.active}
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
          {parseInt(state.recovered) === 0 ? '-' : state.recovered}
        </td>
        <td
          style={{color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit'}}
        >
          <span className="deltas" style={{color: '#6c757d'}}>
            {state.deltadeaths > 0 && <Icon.ArrowUp />}
            {state.deltadeaths > 0 ? `${state.deltadeaths}` : ''}
          </span>
          {parseInt(state.deaths) === 0 ? '-' : state.deaths}
        </td>
      </tr>

      <tr
        className={'state-last-update'}
        style={{display: props.reveal && !props.total ? '' : 'none'}}
      >
        <td colSpan={2}>
          <div className="last-update">
            <h6>Last Updated&nbsp;</h6>
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
                  )} Ago`}
            </h6>
          </div>
        </td>
      </tr>

      <tr
        className={`district-heading`}
        style={{display: props.reveal && !props.total ? '' : 'none'}}
      >
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
      </tr>

      {sortedDistricts &&
        Object.keys(sortedDistricts)
          .filter((district) => district.toLowerCase() !== 'unknown')
          .map((district, index) => {
            if (district.toLowerCase() !== 'unknown') {
              return (
                <tr
                  key={index}
                  className={`district`}
                  style={{
                    display: props.reveal && !props.total ? '' : 'none',
                    background: index % 2 === 0 ? '#f8f9fa' : '',
                  }}
                  onMouseEnter={() =>
                    props.onHighlightDistrict?.(district, state, props.index)
                  }
                  onMouseLeave={() => props.onHighlightDistrict?.()}
                  touchstart={() =>
                    props.onHighlightDistrict?.(district, state, props.index)
                  }
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
                    {sortedDistricts[district].confirmed}
                  </td>
                </tr>
              );
            }
            return null;
          })}

      {sortedDistricts?.Unknown && (
        <tr
          className={`district`}
          style={{display: props.reveal && !props.total ? '' : 'none'}}
        >
          <td style={{fontWeight: 600}}>Unknown</td>
          <td>
            <span className="deltas" style={{color: '#ff073a'}}>
              {sortedDistricts['Unknown'].delta.confirmed > 0 && (
                <Icon.ArrowUp />
              )}
              {sortedDistricts['Unknown'].delta.confirmed > 0
                ? `${sortedDistricts['Unknown'].delta.confirmed}`
                : ''}
            </span>
            {sortedDistricts['Unknown'].confirmed}
          </td>
        </tr>
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

export default Row;
