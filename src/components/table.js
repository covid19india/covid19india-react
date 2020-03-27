import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import axios from 'axios';

import Row from './row';

function Table(props) {
  const [sortedStates, setSortedStates] = useState(props.states);
  const [districts, setDistricts] = useState({});
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: 'confirmed',
    isAscending: false,
  });

  useEffect(()=>{
    if (props.summary===true) {
      setSortedStates(props.states.slice(0, 9));
    } else {
      setSortedStates(props.states);
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
  // setInterval(getDistricts, 600000);
  useEffect(() => {
    const interval = setInterval(getDistricts, 600000);
    return () => clearInterval(interval);
  }, []);

  const sortByKey = (arr, key, isAscending) => {
    return arr.concat().sort(({[key]: v1}, {[key]: v2}) => {
      const isNumber = !isNaN(v1);
      if (isNumber ? parseInt(v1) < parseInt(v2) : v1 < v2) {
        return isAscending ? -1 : 1;
      } else if (isNumber ? parseInt(v1) > parseInt(v2) : v1 > v2) {
        return isAscending ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const data = [...props.states].slice(1, props.states.length);
    const {sortColumn, isAscending} = sortData;
    setSortedStates([props.states[0]].concat(sortByKey(data, sortColumn, isAscending)));
  }, [sortData, props.states.length]);

  const handleSort = (e) => {
    const currentsortColumn = e.currentTarget.querySelector('abbr').getAttribute('title').toLowerCase();
    setSortData({
      sortColumn: currentsortColumn,
      isAscending: sortData.sortColumn == currentsortColumn? !sortData.isAscending : sortData.sortColumn === 'state',
    });
  };

  const tableRows = [
    {key: 'state', title: 'State/UT', titleShort: 'State/UT', titleSmall: 'State/UT', desktopStyle: 'state-heading', mobileStyle: 'state-heading'},
    {key: 'confirmed', title: 'Confirmed', titleShort: 'Cnfmd', titleSmall: 'C', desktopStyle: '', mobileStyle: 'is-cherry'},
    {key: 'active', title: 'Active', titleShort: 'Actv', titleSmall: 'A', desktopStyle: '', mobileStyle: 'is-blue'},
    {key: 'recovered', title: 'Recovered', titleShort: 'Rcvrd', titleSmall: 'R', desktopStyle: '', mobileStyle: 'is-green'},
    {key: 'deaths', title: 'Deceased', titleShort: 'Dcsd', titleSmall: 'D', desktopStyle: '', mobileStyle: 'is-gray'},
  ];

  return (
    <table className="table fadeInUp" style={{animationDelay: '1s'}}>
      <h5 className="affected-count">{count} States/UTS Affected</h5>
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
            <th key={index} className="state-heading" onClick={handleSort} >
              <div className='heading-content'>
                <abbr className={`${window.innerWidth <=769 ? mobileStyle : desktopStyle}`} title={title}>
                  {window.innerWidth <=769 ? window.innerWidth <=375 ? titleSmall : titleShort : title}
                </abbr>
                <div style={{display: sortData.sortColumn === key ? 'initial': 'none'}}><Icon.Maximize2/></div>
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
  );
}

export default Table;
