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
    <nav className="level is-mobile">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Confirmed</p>
          <p className="title">{confirmed}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Active</p>
          <p className="title">{active}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Recoveries</p>
          <p className="title">{recoveries}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Deaths</p>
          <p className="title">{deaths}</p>
        </div>
      </div>
    </nav>
  );
}

export default Level;
