import React, {useState, useEffect} from 'react';

function Level({data}) {
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [recoveries, setRecoveries] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(() => {
    parseData();
    console.log('sdsd:- ', data);
  });

  const parseData = () => {
    setConfirmed(data.confirmed);
    setActive(data.active);
    setRecoveries(data.recovered);
    setDeaths(data.deaths);
  };

  return (
    <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>

      <div className="level-item is-cherry">
        <h5>Confirmed</h5>
        <h4>[{data.delta ? (data.delta.confirmed >= 0 ? '+' + data.delta.confirmed : data.delta.confirmed) : ''}]</h4>
        <h1>{confirmed} </h1>
      </div>

      <div className="level-item is-blue">
        <h5 className="heading">Active</h5>
        <h4>[{data.delta ? (data.delta.active >= 0 ? '+' + data.delta.active : data.delta.active) : ''}]</h4>
        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div className="level-item is-green">
        <h5 className="heading">Recovered</h5>
        <h4>[{data.delta ? (data.delta.recovered >= 0 ? '+' + data.delta.recovered : data.delta.recovered) : ''}]</h4>
        <h1 className="title has-text-success">{recoveries} </h1>
      </div>

      <div className="level-item is-gray">
        <h5 className="heading">Deceased</h5>
        <h4>[{data.delta ? (data.delta.deaths >= 0 ? '+' + data.delta.deaths : '+0') : ''}]</h4>
        <h1 className="title has-text-grey">{deaths}</h1>
      </div>

    </div>
  );
}

export default Level;
