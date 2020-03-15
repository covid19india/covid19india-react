import React, {useState, useEffect} from 'react';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [cases, setCases] = useState(0);
  const [recoveries, setRecoveries] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(()=>{
    setData(props.data);
    parseData();
  });

  const parseData = () => {
    let cases = 0;
    let recoveries = 0;
    let deaths = 0;
    data.map((state, index) => {
      cases += parseInt(state.total_cases);
      recoveries += parseInt(state.recovered);
      deaths += parseInt(state.deaths);
    });
    setCases(cases);
    setRecoveries(recoveries);
    setDeaths(deaths);
  };

  return (
    <nav className="level is-mobile">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Total Cases</p>
          <p className="title">{cases}</p>
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
