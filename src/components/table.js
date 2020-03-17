import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);

  return (
    <table className="table table is-hoverable is-narrow is-striped fadeInUp" style={{animationDelay: '0.5s'}}>

      <thead>
        <tr>
          <th className="state-heading">State/UT</th>
          <th><abbr title="Cases">Confirmed</abbr></th>
          <th><abbr title="Active">Active</abbr></th>
          <th><abbr title="Recovered">Recovered</abbr></th>
          <th><abbr title="Deaths">Deaths</abbr></th>
        </tr>
      </thead>

      <tbody>
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

      <p className="help">Last updated on {states[1] ? states[0]['15/03/2020 19:17:18'] : ''} IST</p>

    </table>
  );
}

export default Table;
