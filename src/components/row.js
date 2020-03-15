import React, {useState, useEffect} from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr>
      <td>{state.name}</td>
      <td>{state.total_cases}</td>
      <td style={{color: parseInt(state.indians)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.indians)===0 ? '-' : state.indians}</td>
      <td style={{color: parseInt(state.foreigners)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.foreigners)===0 ? '-' : state.foreigners}</td>
      <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.recovered)===0 ? '-' : state.recovered}</td>
      <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.deaths)===0 ? '-' : state.deaths}</td>
    </tr>
  );
}

export default Row;
