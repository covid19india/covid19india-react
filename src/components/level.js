import React, {useState, useEffect} from 'react';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [recoveries, setRecoveries] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    const parseData = () => {
      let confirmed = 0;
      let active = 0;
      let recoveries = 0;
      let deaths = 0;
      data.forEach((state, index) => {
        if (index !== 0) {
          confirmed += parseInt(state.confirmed);
          active += parseInt(state.active);
          recoveries += parseInt(state.recovered);
          deaths += parseInt(state.deaths);
        }
      });
      setConfirmed(confirmed);
      setActive(active);
      setRecoveries(recoveries);
      setDeaths(deaths);
    };
    parseData();
  }, [data]);

  return (
    <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
      <div className="level-item is-cherry">
        <h5>Confirmed</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.confirmeddelta >= 0
              ? '+' + props.deltas.confirmeddelta
              : '+0'
            : ''}
          ]
        </h4>
        <h1>{confirmed} </h1>
      </div>

      <div className="level-item is-blue">
        <h5 className="heading">Active</h5>
        <h4>&nbsp;</h4>
        {/* <h4>[{props.deltas ? props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta) >=0 ? '+'+(props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta)).toString() : '+0' : ''}]</h4>*/}
        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div className="level-item is-green">
        <h5 className="heading">Recovered</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.recovereddelta >= 0
              ? '+' + props.deltas.recovereddelta
              : '+0'
            : ''}
          ]
        </h4>
        <h1 className="title has-text-success">{recoveries} </h1>
      </div>

      <div className="level-item is-gray">
        <h5 className="heading">Deceased</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.deceaseddelta >= 0
              ? '+' + props.deltas.deceaseddelta
              : '+0'
            : ''}
          ]
        </h4>
        <h1 className="title has-text-grey">{deaths}</h1>
      </div>
    </div>
  );
}

export default Level;
