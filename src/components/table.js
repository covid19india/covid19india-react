import React, {useState, useEffect} from 'react';

import Row from './row';

function Table(props) {
  const [states, setStates] = useState(props.states);

  useEffect(()=>{
    setStates(props.states);
  }, [props.states]);
  return (
    <table className="table table is-hoverable is-narrow is-striped">

      <thead>
        <tr>
          <th>State/UT</th>
          <th><abbr title="Cases">Cases</abbr></th>
          <th><abbr title="Indians">Indians</abbr></th>
          <th><abbr title="Foreigners">Foreigners</abbr></th>
          <th><abbr title="Recovered">Recovered</abbr></th>
          <th><abbr title="Deaths">Deaths</abbr></th>
        </tr>
      </thead>

      <tbody>
        {
          states.map((state, index) => {
            if (parseInt(state.total_cases)>0) {
              return (
                <Row key={index} state={state}/>
              );
            }
          })
        }
      </tbody>

      <p className="help">Last updated on March 15th, 3:53PM IST</p>

    </table>
  );
}

export default Table;
