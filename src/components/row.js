import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';

function Row(props) {
  const [state, setState] = useState(props.state);
  const [districts, setDistricts] = useState(props.districts);
  const [reveal, setReveal] = useState(false);

  useEffect(()=>{
    setState(props.state);
  }, [props.state]);

  useEffect(()=>{
    setDistricts(props.districts);
  }, [props.districts]);

  useEffect(()=>{
    sort(districts);
  }, [districts]);

  const handleReveal = () => {
    setReveal(!reveal);
  };

  const sort = (aDistricts) => {
    return aDistricts;
  };

  return (
    <React.Fragment>
      <span className={`dropdown ${reveal ? 'rotateRightDown' : 'rotateDownRight' }`} style={{display: !props.total ? '' : 'none'}} onClick={()=>{
        handleReveal();
      }}>
        <Icon.ChevronDown/>
      </span>
      <tr className={props.total ? 'state is-total' : 'state'} className={props.total ? 'is-total' : ''}
        onMouseEnter={() => props.onHighlightState?.(state, props.index)}
        touchstart={() => props.onHighlightState?.(state, props.index)}
        onClick={()=>{
          handleReveal();
        }}>
        <td style={{fontWeight: 600}}>{state.state}</td>
        <td>
          <span className="deltas" style={{color: '#ff073a'}}>
            {!state.delta.confirmed==0 && <Icon.ArrowUp/>}
            {state.delta.confirmed > 0 ? `${state.delta.confirmed}` : ''}
          </span>
          {parseInt(state.confirmed)===0 ? '-' : state.confirmed}
        </td>
        <td style={{color: parseInt(state.active)===0 ? '#B5B5B5' : 'inherit'}}>
          {/*<span className="deltas" style={{color: '#007bff'}}>
            {!state.delta.active==0 && <Icon.ArrowUp/>}
            {state.delta.active>0 ? `${state.delta.active}` : ''}
          </span>*/}
          {parseInt(state.active)===0 ? '-' : state.active}
        </td>
        <td style={{color: parseInt(state.recovered)===0 ? '#B5B5B5' : 'inherit'}}>
          {/*<span className="deltas" style={{color: '#28a745'}}>
            {!state.delta.recovered==0 && <Icon.ArrowUp/>}
            {state.delta.recovered > 0 ? `${state.delta.recovered}` : ''}
          </span>*/}
          {parseInt(state.recovered)===0 ? '-' : state.recovered}
        </td>
        <td style={{color: parseInt(state.deaths)===0 ? '#B5B5B5' : 'inherit'}}>
          {/*<span className="deltas" style={{color: '#6c757d'}}>
            {!state.delta.deaths==0 && <Icon.ArrowUp/>}
            {state.delta.deaths>0 ? `${state.delta.deaths}` : ''}
          </span>*/}
          {parseInt(state.deaths)===0 ? '-' : state.deaths}
        </td>
      </tr>

      <tr className={`spacer`} style={{display: reveal && !props.total ? '' : 'none'}}>
        <td></td>
        <td></td>
        <td></td>
      </tr>

      <tr className={`district-heading`} style={{display: reveal && !props.total ? '' : 'none'}}>
        <td>District</td>
        <td><abbr className={`${window.innerWidth <=769 ? 'is-cherry' : ''}`} title="Confirmed">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'Confirmed' : 'Confirmed' : 'Confirmed'}</abbr></td>
         {/*<td><abbr className={`${window.innerWidth <=769 ? 'is-blue' : ''}`} title="Active">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'A' : 'Actv' : 'Active'}</abbr></td>
        <td><abbr className={`${window.innerWidth <=769 ? 'is-green' : ''}`} title="Recovered">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'R' : 'Rcvrd' : 'Recovered'}</abbr></td>
        <td><abbr className={`${window.innerWidth <=769 ? 'is-gray' : ''}`} title="Deaths">{window.innerWidth <=769 ? window.innerWidth <=375 ? 'D' : 'Dcsd' : 'Deceased'}</abbr></td>*/}
      </tr>

      {districts?.Unknown &&
      <tr className={`district`} style={{display: reveal && !props.total ? '' : 'none'}}>
        <td style={{fontWeight: 600}}>Unknown</td>
        <td>{districts['Unknown'].confirmed}</td>
         {/*<td>{districts['Unknown'].active}</td>
        <td>{districts['Unknown'].recovered}</td>
        <td>{districts['Unknown'].deaths}</td>*/}
      </tr>
      }

      {
        Object.keys(districts ? districts : {}).map((district, index) => {
          if (district.toLowerCase()!=='unknown') {
            return (
              <tr key={index} className={`district`} style={{display: reveal && !props.total ? '' : 'none'}}>
                <td style={{fontWeight: 600}}>{district}</td>
                <td>{districts[district].confirmed}</td>
                 {/*<td>{districts[district].active}</td>
               <td>{districts[district].recovered}</td>
                <td>{districts[district].deaths}</td>*/}
              </tr>
            );
          }
        })
      }

      <tr className={`spacer`} style={{display: reveal && !props.total ? '' : 'none'}}>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </React.Fragment>
  );
}

export default Row;
