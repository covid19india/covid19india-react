import React, {useState, useEffect} from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}>
      <td style={{fontWeight: 600}}>{state.state}</td>
      <td>
          {state.confirmed}
          {state.delta && state.delta.confirmed && state.delta.confirmed > 0 &&
              <span style={{color: '#ff073a', float: 'right'}}>
                  +{state.delta.confirmed}
              </span>
          }
      </td>
      <td style={{color: parseInt(state.active)===0 ? '#B5B5B5' : 'inherit'}}>
          {parseInt(state.active)===0 ? '-' : state.active}
          {state.delta && state.delta.active && state.delta.active > 0 &&
            <span style={{color: '#007bff', float: 'right'}}>
                  +{state.delta.active}
            </span>
          }
      </td>
      <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>
          {parseInt(state.recovered)===0 ? '-' : state.recovered}
          {state.delta && state.delta.recovered && state.delta.recovered > 0 &&
              <span style={{color: '#28a745', float: 'right'}}>
                      +{state.delta.recovered}
              </span>
          }
      </td>
      <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>
          {parseInt(state.deaths)===0 ? '-' : state.deaths}
          {state.delta && state.delta.deaths && state.delta.deaths > 0 &&
              <span style={{color: '#6c757d', float: 'right'}}>
                   +{state.delta.deaths}
              </span>
          }
      </td>
    </tr>
  );
}

export default Row;
