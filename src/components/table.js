import Row from './row';

import equal from 'fast-deep-equal';
import React, {useState, useMemo} from 'react';
import {Link} from 'react-router-dom';

const isEqual = (prevProps, currProps) => {
  return equal(prevProps.regionHighlighted, currProps.regionHighlighted);
};

function Table({
  states,
  districts,
  regionHighlighted,
  onHighlightState,
  onHighlightDistrict,
}) {
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('state.sortColumn')
      ? localStorage.getItem('state.sortColumn')
      : 'confirmed',
    isAscending: localStorage.getItem('state.isAscending')
      ? localStorage.getItem('state.isAscending') === 'true'
      : false,
  });

  const FineprintTop = useMemo(
    () => (
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1.5s'}}>
        Compiled from State Govt. numbers,{' '}
        <Link to="/faq" style={{color: '#6c757d'}}>
          know more!
        </Link>
      </h5>
    ),
    []
  );

  const FineprintBottom = useMemo(
    () => (
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1s'}}>
        {states.slice(1).filter((s) => s && s.confirmed > 0).length} States/UTS
        Affected
      </h5>
    ),
    [states]
  );

  const doSort = (e) => {
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

  const handleSort = (e) => {
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

  doSort();

  if (states.length > 0) {
    return (
      <React.Fragment>
        {FineprintTop}
        <table className="table fadeInUp" style={{animationDelay: '1.8s'}}>
          <thead>
            <tr>
              <th
                className="sticky state-heading"
                onClick={(e) => handleSort(e)}
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
              <th className="sticky" onClick={(e) => handleSort(e)}>
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
                        sortData.sortColumn === 'confirmed'
                          ? 'initial'
                          : 'none',
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
              <th className="sticky" onClick={(e) => handleSort(e)}>
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
              <th className="sticky" onClick={(e) => handleSort(e)}>
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
                        sortData.sortColumn === 'recovered'
                          ? 'initial'
                          : 'none',
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
              <th className="sticky" onClick={(e) => handleSort(e)}>
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

          {states && (
            <tbody>
              {states.map((state, index) => {
                if (index !== 0 && state.confirmed > 0) {
                  return (
                    <Row
                      key={index}
                      state={state}
                      districts={districts[state.state]?.districtData}
                      regionHighlighted={
                        equal(regionHighlighted?.state, state)
                          ? regionHighlighted
                          : null
                      }
                      onHighlightState={onHighlightState}
                      onHighlightDistrict={onHighlightDistrict}
                    />
                  );
                }
                return null;
              })}
            </tbody>
          )}

          <tbody>
            <Row
              key={0}
              state={states[0]}
              onHighlightState={onHighlightState}
            />
          </tbody>
        </table>
        {states && FineprintBottom}
      </React.Fragment>
    );
  } else {
    return <div style={{height: '50rem'}}></div>;
  }
}

export default React.memo(Table, isEqual);
