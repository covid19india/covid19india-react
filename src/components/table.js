import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);
  const [districts, setDistricts] = useState({});
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: 'confirmed',
    isAscending: false,
  });

  useEffect(()=>{
    if (props.summary===true) {
      setStates(props.states.slice(0, 9));
    } else {
      setStates(props.states);
    }
  }, [props.states]);

  useEffect(()=>{
    if (states.length>0) {
      let length = 0;
      props.states.map((state, i) => {
        if (i!==0 && state.confirmed>0) length+=1;
        if (i===props.states.length-1) setCount(length);
      });
    }
  }, [states.length]);

  useEffect(()=>{
    getDistricts();
  }, [1]);


  const getDistricts = () => {
    axios.get('https://api.covid19india.org/state_district_wise.json')
        .then((response)=>{
          setDistricts(response.data);
        })
        .catch((err)=>{
          console.log(err);
        });
  };
  // make a axios call every 10minutes
  setInterval(getDistricts, 600000);

  const doSort = (e, props) => {
    const totalRow = states.splice(0, 1);
    {/* console.log(totalRow);*/}
    states.sort((StateData1, StateData2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = StateData1[sortColumn];
      let value2 = StateData2[sortColumn];

      if (sortColumn != 'state') {
        value1 = parseInt(StateData1[sortColumn]);
        value2 = parseInt(StateData2[sortColumn]);
      }

      if (sortData.isAscending) {
        return value1 > value2 ? 1 : (value1 == value2) && StateData1['state'] > StateData2['state'] ? 1 : -1;
      } else {
        return value1 < value2 ? 1 : (value1 == value2) && StateData1['state'] > StateData2['state'] ? 1 : -1;
      }
    });
    {/* console.log(states);*/}
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

  return (
    <table className="table fadeInUp" style={{animationDelay: '1s'}}>
      <h5 className="affected-count">{count} States/UTS Affected</h5>
      <thead>
        <tr>
          <th className="state-heading" onClick={(e) => handleSort(e, props)} >
            <div className='heading-content'>
              <abbr title="State">
                  State/UT
              </abbr>
              <div style={{display: sortData.sortColumn === 'state' ? 'initial': 'none'}}><Icon.Maximize2/></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-cherry' : ''}`} title="Confirmed">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'C' : 'Cnfmd' : 'Confirmed'}</abbr>
              <div style={{display: sortData.sortColumn === 'confirmed' ? 'initial': 'none'}}><Icon.Maximize2/></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-blue' : ''}`} title="Active">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'A' : 'Actv' : 'Active'}</abbr>
              <div style={{display: sortData.sortColumn === 'active' ? 'initial': 'none'}}><Icon.Maximize2/></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-green' : ''}`} title="Recovered">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'R' : 'Rcvrd' : 'Recovered'}</abbr>
              <div className={ sortData.sortColumn === 'recovered'? 'sort-black' : ''}></div>
              <div style={{display: sortData.sortColumn === 'recovered' ? 'initial': 'none'}}><Icon.Maximize2/></div>
            </div>
          </th>
          <th onClick={(e) => handleSort(e, props)}>
            <div className='heading-content'>
              <abbr className={`${window.innerWidth <=769 ? 'is-gray' : ''}`} title="Deaths">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'D' : 'Dcsd' : 'Deceased'}</abbr>
              <div style={{display: sortData.sortColumn === 'deaths' ? 'initial': 'none'}}><Icon.Maximize2/></div>
            </div>
          </th>
        </tr>
      </thead>

      {
        states.map((state, index) => {
          if (index!==0 && state.confirmed>0) {
            return (
              <tbody>
                <Row key={index} index={index} state={state} total={false} districts={Object.keys(districts).length-1 > 0 ? districts[state.state].districtData : []} onHighlightState={props.onHighlightState} />
              </tbody>
            );
          }
        })
      }

      <tbody>
        {states.length > 1 && props.summary===false && <Row key={0} state={states[0]} total={true}/>}
      </tbody>

    </table>
  );
}

export default Table;
