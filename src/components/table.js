import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);
  const [sortData, setSortData] = useState({
    sortColumn: 'confirmed',
    isAscending: false,
  });

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  const doSort = (e, props) => {

    const totalRow = states.splice(0, 1);
    console.log(totalRow)
    states.sort((StateData1, StateData2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = StateData1[sortColumn];
      let value2 = StateData2[sortColumn];

      if (sortColumn != 'state') {
        value1 = parseInt(StateData1[sortColumn]);
        value2 = parseInt(StateData2[sortColumn]);
      }

      if (sortData.isAscending) {
        return value1 > value2? 1 : -1;
      } else {
        return value1 > value2? -1 : 1;
      }
    });
    console.log(states);
    states.unshift(totalRow[0]);
  };

  const handleSort = (e, props) => {
    const currentsortColumn = e.currentTarget.querySelector('abbr').getAttribute('title').toLowerCase();
    setSortData({
      sortColumn: currentsortColumn,
      isAscending: sortData.sortColumn == currentsortColumn? !sortData.isAscending : sortData.sortColumn === 'state',
    });
  };

  doSort();

  console.log(states);

  return (
    <table className="table fadeInUp" style={{animationDelay: '1s'}}>
      <thead>
        <tr>
          <th className="state-heading" onClick={(e) => handleSort(e, props)} >
            <div className='heading-content'>
              <abbr title="State">
                  State/UT
              </abbr>
              <div className={ sortData.sortColumn == 'state'? 'sort-black': ''}></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-cherry' : ''}`} title="Confirmed">{window.innerWidth <=769 ? 'Confirmed' : 'Confirmed'}</abbr>
              <div className={ sortData.sortColumn == 'confirmed'? 'sort-black' : '' }></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-blue' : ''}`} title="Active">{window.innerWidth <=769 ? 'Active' : 'Active'}</abbr>
              <div className={ sortData.sortColumn == 'active'? 'sort-black' : ''}></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-green' : ''}`} title="Recovered">{window.innerWidth <=769 ? 'Recovered' : 'Recovered'}</abbr>
              <div className={ sortData.sortColumn == 'recovered'? 'sort-black' : ''}></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-gray' : ''}`} title="Deaths">{window.innerWidth <=769 ? 'Deaths' : 'Deaths'}</abbr>
              <div className={ sortData.sortColumn == 'deaths'? 'sort-black' : ''}></div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        {
          states.map((state, index) => {
            if (index!==0 && state.confirmed>0) {
              return (
                <Row key={index} state={state}/>
              );
            }
          })
        }
        { states.length > 1 && <Row key={0} state={states[0]}/> }
      </tbody>

    </table>
  );
}

export default Table;
