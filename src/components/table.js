import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);
  const [count, setCount] = useState(0);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  useEffect(()=>{
    if (states.length>0) {
      let length = 0;
      props.states.map((state, i) => {
        if (state.confirmed>0) length+=1;
        if (i===props.states.length-1) setCount(length);
      });
    }
  }, [states.length]);

  return (
    <table className="table fadeInUp" style={{animationDelay: '1s'}}>
      <h5 className="affected-count">{count} States/UTS Affected</h5>
      <thead>
        <tr>
          <th className="state-heading">State/UT</th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-cherry' : ''}`} title="Confirmed">{window.innerWidth <=769 ? 'Cnfrmd' : 'Confirmed'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-blue' : ''}`} title="Active">{window.innerWidth <=769 ? 'Active' : 'Active'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-green' : ''}`} title="Recovered">{window.innerWidth <=769 ? 'Rcvrd' : 'Recovered'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-gray' : ''}`} title="Deceased">{window.innerWidth <=769 ? 'Decsd' : 'Deaths'}</abbr></th>
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
      </tbody>

    </table>
  );
}

export default Table;
