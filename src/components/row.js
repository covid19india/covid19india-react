import React, {useState, useEffect} from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}>
      <td style={{fontWeight: 600}}>{state.state}</td>
      <td>{state.confirmed}</td>
      <td style={{color: parseInt(state.active)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.active)===0 ? '-' : state.active}</td>
      <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.recovered)===0 ? '-' : state.recovered}</td>
      <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.deaths)===0 ? '-' : state.deaths}</td>
    </tr>
  );
}

export default Row;
