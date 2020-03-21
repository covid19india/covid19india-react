import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  return (
    <table className="table fadeInUp" style={{animationDelay: '1s'}}>
      <thead>
        <tr>
          <th className="state-heading">State/UT</th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-cherry' : ''}`} title="Confirmed">{window.innerWidth <=769 ? 'Confirmed' : 'Confirmed'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-blue' : ''}`} title="Active">{window.innerWidth <=769 ? 'Active' : 'Active'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-green' : ''}`} title="Recovered">{window.innerWidth <=769 ? 'Recovered' : 'Recovered'}</abbr></th>
          <th><abbr className={`${window.innerWidth <=769 ? 'is-gray' : ''}`} title="Deceased">{window.innerWidth <=769 ? 'Deaths' : 'Deaths'}</abbr></th>
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
