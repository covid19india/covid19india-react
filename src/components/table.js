import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  return (
    <table className="table is-hoverable is-narrow is-striped fadeInUp" style={{animationDelay: '0.5s'}}>

      <thead>
        <tr>
          <th className="state-heading">State/UT</th>
          <th><abbr className="has-text-danger" title="Confirmed">{window.innerWidth <=769 ? 'C' : 'Confirmed'}</abbr></th>
          <th><abbr className="has-text-info" title="Active">{window.innerWidth <=769 ? 'A' : 'Active'}</abbr></th>
          <th><abbr className="has-text-success" title="Recovered">{window.innerWidth <=769 ? 'R' : 'Recovered'}</abbr></th>
          <th><abbr className="has-text-grey" title="Deaths">{window.innerWidth <=769 ? 'D' : 'Deaths'}</abbr></th>
        </tr>
      </thead>

      <tbody className="fadeInUp" style={{animationDelay: '0.5s'}}>
        {
          states.map((state, index) => {
            if (parseInt(state.Confirmed)>0 && index!==0) {
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
