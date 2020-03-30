import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import {formatDate} from '../utils/common-functions';
import {formatDistance} from 'date-fns';
function Row(props) {
  const [state, setState] = useState(props.state);
  const [districts, setDistricts] = useState(props.districts);
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('district.sortColumn')
      ? localStorage.getItem('district.sortColumn')
      : 'confirmed',
    isAscending: localStorage.getItem('district.isAscending')
      ? localStorage.getItem('district.isAscending') === 'true'
      : false,
  });

  let sortedDistricts = {};

  useEffect(() => {
    setState(props.state);
  }, [props.state]);

  useEffect(() => {
    setDistricts(props.districts);
  }, [props.districts]);

  useEffect(() => {
    sort(districts);
  }, [districts]);

  const handleReveal = () => {
    props.handleReveal(props.state.state);
  };

  const sort = (aDistricts) => {
    sortedDistricts = {};
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
          return sortData.isAscending ? comparisonValue : comparisonValue * -1;
        })
        .forEach((key) => {
          sortedDistricts[key] = aDistricts[key];
        });
    }
  };

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

  sort(districts);

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
        onClick={() => {
          handleReveal();
        }}
      >
        <td style={{fontWeight: 600}}>{state.state}</td>
        <td>
          <span className="deltas" style={{color: '#ff073a'}}>
            {!state.delta.confirmed == 0 && <Icon.ArrowUp />}
            {state.delta.confirmed > 0 ? `${state.delta.confirmed}` : ''}
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
          {/* <span className="deltas" style={{color: '#28a745'}}>
            {!state.delta.recovered==0 && <Icon.ArrowUp/>}
            {state.delta.recovered > 0 ? `${state.delta.recovered}` : ''}
          </span>*/}
          {parseInt(state.recovered) === 0 ? '-' : state.recovered}
        </td>
        <td
          style={{color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit'}}
        >
          {/* <span className="deltas" style={{color: '#6c757d'}}>
            {!state.delta.deaths==0 && <Icon.ArrowUp/>}
            {state.delta.deaths>0 ? `${state.delta.deaths}` : ''}
          </span>*/}
          {parseInt(state.deaths) === 0 ? '-' : state.deaths}
        </td>
      </tr>

      <tr
        className={'state-last-update'}
        style={{display: props.reveal && !props.total ? '' : 'none'}}
      >
        <td colSpan={5}>
          <div className="last-update">
            <h6>Last Updated&nbsp;</h6>
            <h6>
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
              {sortData.isAscending ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
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
              {sortData.isAscending ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
            </div>
          </div>
        </td>
      </tr>

      {Object.keys(sortedDistricts).map((district, index) => {
        if (district.toLowerCase() !== 'unknown') {
          return (
            <tr
              key={index}
              className={`district`}
              style={{display: props.reveal && !props.total ? '' : 'none'}}
              onMouseEnter={() =>
                props.onHighlightDistrict?.(district, state, props.index)
              }
              onMouseLeave={() => props.onHighlightDistrict?.()}
              touchstart={() =>
                props.onHighlightDistrict?.(district, state, props.index)
              }
            >
              <td style={{fontWeight: 600}}>{district}</td>
              <td>{sortedDistricts[district].confirmed}</td>
            </tr>
          );
        }
      })}

      {sortedDistricts?.Unknown && (
        <tr
          className={`district`}
          style={{display: props.reveal && !props.total ? '' : 'none'}}
        >
          <td style={{fontWeight: 600}}>Unknown</td>
          <td>{sortedDistricts['Unknown'].confirmed}</td>
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
