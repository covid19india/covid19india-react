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
        <span className="left"> {state.confirmed} </span>
        <span
          className="is-cherry"> {state.delta ? state.delta.confirmed >= 0 ? '+' + state.delta.confirmed : state.delta.confirmed : ''}
                </span>
      </td>

      <td style={{color: parseInt(state.active) === 0 ? '#B5B5B5' : 'inherit'}}>
        <span className="left"> {parseInt(state.active) === 0 ? '-' : state.active} </span>
        <span
          className="is-blue"> {state.delta ? state.delta.active >= 0 ? '+' + state.delta.active : state.delta.active : ''}
                </span>
      </td>

      <td style={{color: parseInt(state.recovered) === 0 ? '#B5B5B5' : 'inherit'}}>
        <span className="left"> {parseInt(state.recovered) === 0 ? '-' : state.recovered} </span>
        <span
          className="is-green"> {state.delta ? state.delta.recovered >= 0 ? '+' + state.delta.recovered : state.delta.recovered : ''}
                </span>
      </td>

      <td style={{color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit'}}>
        <span className="left"> {parseInt(state.deaths) === 0 ? '-' : state.deaths} </span>
        <span
          className="is-grey"> {state.delta ? state.delta.deaths >= 0 ? '+' + state.delta.deaths : state.delta.deaths : ''}
                </span>
      </td>
    </tr>
  );
}

export default Row;
