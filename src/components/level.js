import React, {useState, useEffect} from 'react';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [recoveries, setRecoveries] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(()=>{
    setData(props.data);
    parseData();
  });

  const parseData = () => {
    let confirmed = 0;
    let active = 0;
    let recoveries = 0;
    let deaths = 0;
    data.map((state, index) => {
      if (index !== 0) {
        confirmed += parseInt(state.Confirmed);
        active += parseInt(state.Active);
        recoveries += parseInt(state.Recovered);
        deaths += parseInt(state.Deaths);
      }
    });
    setConfirmed(confirmed);
    setActive(active);
    setRecoveries(recoveries);
    setDeaths(deaths);
  };

  return (
    <div className="Level">

      <div className="level-item is-cherry">
        <h5>Confirmed</h5>
        <h1>{confirmed} </h1>
        <h4>[{data.length>0 ? '+'+data[0].Confirmed_Delta_Yesterday : ''}]</h4>
      </div>

      <div className="level-item is-blue">
        <h5 className="heading">Active</h5>
        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div className="level-item is-green">
        <h5 className="heading">Recovered</h5>
        <h1 className="title has-text-success">{recoveries} </h1>
        <h4>[{data.length>0 ? '+'+data[0].Recovered_Delta : ''}]</h4>
      </div>

      <div className="level-item is-gray">
        <h5 className="heading">Deceased</h5>
        <h1 className="title has-text-grey">{deaths}</h1>
        <h4>[{data.length>0 ? '+'+data[0].Deceased_Delta : ''}]</h4>
      </div>

    </div>
  );
}

export default Level;
