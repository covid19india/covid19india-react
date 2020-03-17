import React, {useState, useEffect} from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className="fadeInUp">
      <td>{state.State}</td>
      <td>{state.Confirmed}</td>
      <td style={{color: parseInt(state.Active)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.Active)===0 ? '-' : state.Active}</td>
      <td style={{color: parseInt(state.Recovered)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.Recovered)===0 ? '-' : state.Recovered}</td>
      <td style={{color: parseInt(state.Deaths)===0 ? '#B5B5B5' : 'inherit'}}>{parseInt(state.Deaths)===0 ? '-' : state.Deaths}</td>
    </tr>
  );
}

export default Row;
