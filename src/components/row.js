import React, { useState, useEffect } from 'react';

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(() => {
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}>
      <td style={{ fontWeight: 600 }}>{state.state}</td>
      <td>
        <span style={{ float: 'left', textAlign: 'right', width: '50%' }}>{state.confirmed}</span>
        <span style={{ float: 'right', color: '#ff073a99' }}>
          {state.delta.confirmed > 0 ? '+' + state.delta.confirmed : ''}
        </span>
      </td>
      <td style={{ color: parseInt(state.active) === 0 ? '#B5B5B5' : 'inherit' }}>
        <span style={{ float: 'left', textAlign: 'right', width: '50%' }}>{parseInt(state.active) === 0 ? '-' : state.active}&nbsp;</span>
        <span style={{ float: 'right', color: '#007bff99' }}>
          {state.delta.active > 0 ? '+' + state.delta.active : ''}
        </span>
      </td>
      <td style={{ color: parseInt(state.recovered) === 0 ? '#B5B5B5' : 'inherit' }}>
        <span style={{ float: 'left', textAlign: 'right', width: '50%' }}>{parseInt(state.recovered) === 0 ? '-' : state.recovered}</span>
        <span style={{ float: 'right', color: '#28a74599' }}>
          {state.delta.recovered > 0 ? '+' + state.delta.recovered : ''}
        </span>
      </td>
      <td style={{ color: parseInt(state.deaths) === 0 ? '#B5B5B5' : 'inherit' }}>
        <span style={{ float: 'left', textAlign: 'right', width: '50%' }}>{parseInt(state.deaths) === 0 ? '-' : state.deaths}</span>
        <span style={{ float: 'right', color: '#6c757d99' }}>
          {state.delta.deaths > 0 ? '+' + state.delta.deaths : ''}
        </span>
      </td>
    </tr>
  );
}

export default Row;
