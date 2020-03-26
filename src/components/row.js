import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}>
      <td style={{fontWeight: 600}}>{state.state}</td>
      <td>
        {parseInt(state.confirmed)===0 ? '-' : state.confirmed}
        <span className="deltas" style={{color: '#ff073a'}}>
          {!state.delta.confirmed==0 && <Icon.ArrowUp/>}
          {state.delta.confirmed > 0 ? `${state.delta.confirmed}` : ''}
        </span>
      </td>
      <td style={{color: parseInt(state.active)===0 ? '#B5B5B5' : 'inherit'}}>
        {parseInt(state.active)==0 ? '-' : state.active}
        <span className="deltas" style={{color: '#007bff'}}>
          {!state.delta.active==0 && <Icon.ArrowUp/>}
          {state.delta.active>0 ? `${state.delta.active}` : ''}
        </span>
      </td>
      <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>
        {parseInt(state.recovered)===0 ? '-' : state.recovered}
        <span className="deltas" style={{color: '#28a745'}}>
          {!state.delta.recovered==0 && <Icon.ArrowUp/>}
          {state.delta.recovered > 0 ? `${state.delta.recovered}` : ''}
        </span>
      </td>
      <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>
        {parseInt(state.deaths)===0 ? '-' : state.deaths}
        <span className="deltas" style={{color: '#6c757d'}}>
          {!state.delta.deaths==0 && <Icon.ArrowUp/>}
          {state.delta.deaths>0 ? `${state.delta.deaths}` : ''}
        </span>
      </td>
    </tr>
  );
}

export default Row;
