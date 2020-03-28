import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';

import Row from './row';

function Table(props) {
  const [sortedStates, setSortedStates] = useState(props.states);
  const [revealedStates, setRevealedStates] = useState({});
  const [districts, setDistricts] = useState({});
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('state.sortColumn')? localStorage.getItem('state.sortColumn') : 'confirmed',
    isAscending: localStorage.getItem('state.isAscending')? localStorage.getItem('state.isAscending') == 'true' : false,
  });

  useEffect(()=>{
    if (props.summary===true) {
      setSortedStates(props.states.slice(0, 9));
    } else {
      setSortedStates(props.states);
    }
  }, [props.states]);

  useEffect(() => {
    if (props.states[0]) {
      setRevealedStates(props.states.reduce((a, state) => {
        return ({...a, [state.state]: false});
      }, {}));
    }
  }, [props.states]);

  useEffect(()=>{
    if (props.states.length) {
      const affectedStates = props.states.reduce((pv, cv, ci) => {
        return cv.confirmed > 0 && ci > 0 ? pv + 1 : pv;
      }, 0);
      setCount(affectedStates);
    }
  }, [props.states.length]);

  useEffect(()=>{
    getDistricts();
  }, []);


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
  // setInterval(getDistricts, 600000);
  useEffect(() => {
    const interval = setInterval(getDistricts, 600000);
    return () => clearInterval(interval);
  }, []);

  const sortByKey = (arr, key, isAscending) => {
    return arr.concat().sort((s1, s2) => {
      const v1 = key !== 'state' ? parseInt(s1[key]) : s1[key];
      const v2 = key !== 'state' ? parseInt(s2[key]) : s2[key];
      return (v1 > v2 ? 1 : (v1 == v2) && s1['state'] > s2['state'] ? 1 : -1) * (isAscending ? 1 : -1);
    });
  };

  useEffect(() => {
    const data = props.states.slice(1, props.states.length);
    const {sortColumn, isAscending} = sortData;
    setSortedStates([props.states[0]].concat(sortByKey(data, sortColumn, isAscending)));
  }, [sortData, props.states.length]);

  const handleSort = (sortColumn) => {
    const isAscending = sortData.sortColumn == sortColumn? !sortData.isAscending : sortData.sortColumn === 'state';
    setSortData({
      sortColumn,
      isAscending,
    });
    localStorage.setItem('state.sortColumn', sortColumn);
    localStorage.setItem('state.isAscending', isAscending);
  };

  const tableRows = [
    {key: 'state', title: 'State/UT', titleShort: 'State/UT', titleSmall: 'State/UT', desktopStyle: 'state-heading', mobileStyle: 'state-heading'},
    {key: 'confirmed', title: 'Confirmed', titleShort: 'Cnfmd', titleSmall: 'C', desktopStyle: '', mobileStyle: 'is-cherry'},
    {key: 'active', title: 'Active', titleShort: 'Actv', titleSmall: 'A', desktopStyle: '', mobileStyle: 'is-blue'},
    {key: 'recovered', title: 'Recovered', titleShort: 'Rcvrd', titleSmall: 'R', desktopStyle: '', mobileStyle: 'is-green'},
    {key: 'deaths', title: 'Deceased', titleShort: 'Dcsd', titleSmall: 'D', desktopStyle: '', mobileStyle: 'is-gray'},
  ];

  const handleReveal = (state) => {
    setRevealedStates({
      ...revealedStates,
      [state]: !revealedStates[state],
    });
  };

  return (
    <>
      <h5 className="affected-count fadeInUp" style={{animationDelay: '1s'}}>{count} States/UTS Affected</h5>
      <table className="table fadeInUp" style={{animationDelay: '1s'}}>
        <thead>
          <tr>
            { tableRows.map(({
              key,
              title,
              desktopStyle,
              mobileStyle,
              titleSmall,
              titleShort,
            }, index) =>
              <th key={index} className="sticky" onClick={() => handleSort(key)} >
                <div className='heading-content'>
                  <abbr className={`${window.innerWidth <=769 ? mobileStyle : desktopStyle}`} title={title}>
                    {window.innerWidth <=769 ? window.innerWidth <=375 ? titleSmall : titleShort : title}
                  </abbr>
                  <div style={{display: sortData.sortColumn === key ? 'initial': 'none'}}>
                    {sortData.isAscending ? <Icon.ArrowDown/> : <Icon.ArrowUp/>}
                  </div>
                </div>
              </th>)}
          </tr>
        </thead>

        {
          sortedStates.map((state, index) => {
            if (index!==0 && state.confirmed>0) {
              return (
                <tbody>
                  <Row
                    key={index}
                    index={index}
                    state={state}
                    total={false}
                    reveal={revealedStates[state.state]}
                    handleReveal={handleReveal}
                    districts={Object.keys(districts).length-1 > 0 ? districts[state.state].districtData : []}
                    onHighlightState={props.onHighlightState} />
                </tbody>
              );
            }
          })
        }

        <tbody>
          {sortedStates.length > 1 && props.summary===false && <Row key={0} state={sortedStates[0]} total={true}/>}
        </tbody>

      </table>
    </>
  );
}

export default Table;
