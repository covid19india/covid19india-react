import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);
  const [revealedStates, setRevealedStates] = useState({});
  const [districts, setDistricts] = useState({});
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('state.sortColumn')
      ? localStorage.getItem('state.sortColumn')
      : 'confirmed',
    isAscending: localStorage.getItem('state.isAscending')
      ? localStorage.getItem('state.isAscending') === 'true'
      : false,
  });

  useEffect(() => {
    if (props.summary === true) {
      setStates(props.states.slice(0, 9));
    } else {
      setStates(props.states);
    }
  }, [props.states, props.summary]);

  useEffect(() => {
    if (props.states[0]) {
      setRevealedStates(
        props.states.reduce((a, state) => {
          return {...a, [state.state]: false};
        }, {})
      );
    }
  }, [props.states]);

  useEffect(() => {
    if (states.length > 0) {
      // slice to ignore the first item which is the total count
      setCount(states.slice(1).filter((s) => s && s.confirmed > 0).length);
    }
  }, [states]);

  useEffect(() => {
    setDistricts(props.stateDistrictWiseData);
  }, [props.stateDistrictWiseData]);

  const doSort = (e, props) => {
    const totalRow = states.splice(0, 1);
    states.sort((StateData1, StateData2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = StateData1[sortColumn];
      let value2 = StateData2[sortColumn];

      if (sortColumn !== 'state') {
        value1 = parseInt(StateData1[sortColumn]);
        value2 = parseInt(StateData2[sortColumn]);
      }

      if (sortData.isAscending) {
        return value1 > value2
          ? 1
          : value1 === value2 && StateData1['state'] > StateData2['state']
          ? 1
          : -1;
      } else {
        return value1 < value2
          ? 1
          : value1 === value2 && StateData1['state'] > StateData2['state']
          ? 1
          : -1;
      }
    });
    states.unshift(totalRow[0]);
  };

  const handleSort = (e, props) => {
    const currentsortColumn = e.currentTarget
      .querySelector('abbr')
      .getAttribute('title')
      .toLowerCase();
    const isAscending =
      sortData.sortColumn === currentsortColumn
        ? !sortData.isAscending
        : sortData.sortColumn === 'state';
    setSortData({
      sortColumn: currentsortColumn,
      isAscending: isAscending,
    });
    localStorage.setItem('state.sortColumn', currentsortColumn);
    localStorage.setItem('state.isAscending', isAscending);
  };

  const handleReveal = (state) => {
    setRevealedStates({
      ...revealedStates,
      [state]: !revealedStates[state],
    });
  };

  doSort();

  return (
    <React.Fragment>
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1.5s'}}>
        Compiled from State Govt. numbers <Link to="/faq">Know More</Link>
      </h5>
      <table className="table fadeInUp" style={{animationDelay: '1.8s'}}>
        <thead>
          <tr>
            <th
              className="sticky state-heading"
              onClick={(e) => handleSort(e, props)}
            >
              <div className="heading-content">
                <abbr title="State">State/UT</abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'state' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
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
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
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
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
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
                  className={
                    sortData.sortColumn === 'recovered' ? 'sort-black' : ''
                  }
                ></div>
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
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
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
                      sortData.sortColumn === 'deaths' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {states.map((state, index) => {
            if (index !== 0 && state.confirmed > 0) {
              return (
                <Row
                  key={index}
                  index={index}
                  state={state}
                  total={false}
                  reveal={revealedStates[state.state]}
                  districts={
                    state.state in districts
                      ? districts[state.state].districtData
                      : []
                  }
                  onHighlightState={props.onHighlightState}
                  onHighlightDistrict={props.onHighlightDistrict}
                  handleReveal={handleReveal}
                />
              );
            }
            return null;
          })}
        </tbody>

        <tbody>
          {states.length > 1 && props.summary === false && (
            <Row key={0} state={states[0]} total={true} />
          )}
        </tbody>
      </table>
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1s'}}>
        {count} States/UTS Affected
      </h5>
    </React.Fragment>
  );
}

export default Table;
