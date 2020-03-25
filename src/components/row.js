import React, {useState, useEffect} from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}>
      <td style={{fontWeight: 600}}>{state.state}</td>
      <td style={{color: '#000000', background: "#ff073a"}}>{state.confirmed}</td>
      <td style={{color: '#000000', background: "#007bff99"}}>{parseInt(state.active)===0 ? '-' : state.active}</td>
      <td style={{color: '#000000', background: "#28a74599"}}>{parseInt(state.recovered)===0 ? '-' : state.recovered}</td>
      <td style={{color: '#000000', background: "#6c757d"}}>{parseInt(state.deaths)===0 ? '-' : state.deaths}</td>
    </tr>
  );
}

export default Row;
