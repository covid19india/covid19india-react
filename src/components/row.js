import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import * as Icon from 'react-feather';

function Row(props) {
  const [state, setState] = useState(props.state);
  const {t} = useTranslation();

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  return (
    <tr className={props.total ? 'is-total' : ''}
        onMouseEnter={() => props.onHighlightState?.(state, props.index)}
        touchstart={() => props.onHighlightState?.(state, props.index)}>
      <td style={{fontWeight: 600}}>{t(`states.${state.state}`)}</td>
      <td>
        <span className="deltas" style={{color: '#ff073a'}}>
          {!state.delta.confirmed==0 && <Icon.ArrowUp/>}
          {state.delta.confirmed > 0 ? `${state.delta.confirmed}` : ''}
        </span>
        {parseInt(state.confirmed)===0 ? '-' : state.confirmed}
      </td>
      <td style={{color: parseInt(state.active)===0 ? '#B5B5B5' : 'inherit'}}>
        <span className="deltas" style={{color: '#007bff'}}>
          {!state.delta.active==0 && <Icon.ArrowUp/>}
          {state.delta.active>0 ? `${state.delta.active}` : ''}
        </span>
        {parseInt(state.active)==0 ? '-' : state.active}
      </td>
      <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>
        <span className="deltas" style={{color: '#28a745'}}>
          {!state.delta.recovered==0 && <Icon.ArrowUp/>}
          {state.delta.recovered > 0 ? `${state.delta.recovered}` : ''}
        </span>
        {parseInt(state.recovered)===0 ? '-' : state.recovered}
      </td>
      <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>
        <span className="deltas" style={{color: '#6c757d'}}>
          {!state.delta.deaths==0 && <Icon.ArrowUp/>}
          {state.delta.deaths>0 ? `${state.delta.deaths}` : ''}
        </span>
        {parseInt(state.deaths)===0 ? '-' : state.deaths}
      </td>
    </tr>
  );
}

export default Row;
