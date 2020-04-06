import React, {useState, useEffect} from 'react';
import Minigraph from './minigraph';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [recoveries, setRecoveries] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [deltas, setDeltas] = useState(0);
  const [timeseries, setTimeseries] = useState(props.timeseries);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setTimeseries(props.timeseries);
  }, [props.timeseries]);

  useEffect(() => {
    const parseData = () => {
      let confirmed = 0;
      let active = 0;
      let recoveries = 0;
      let deaths = 0;
      let deltas = {};
      data.forEach((state, index) => {
        if (state) {
          if (index !== 0) {
            confirmed += parseInt(state.confirmed);
            active += parseInt(state.active);
            recoveries += parseInt(state.recovered);
            deaths += parseInt(state.deaths);
          } else {
            deltas = {
              confirmed: parseInt(state.deltaconfirmed),
              deaths: parseInt(state.deltadeaths),
              recovered: parseInt(state.deltarecovered),
            };
          }
        }
      });
      setConfirmed(confirmed);
      setActive(active);
      setRecoveries(recoveries);
      setDeaths(deaths);
      setDeltas(deltas);
    };
    parseData();
  }, [data]);

  return (
    <div
      className="fadeInUp"
      style={{
        animationDelay: '0.8s',
        display: 'flex',
        marginTop: '1rem',
      }}
    >
      <div className="card border-left-cherry">
        <div className="body is-cherry">
          <div>
            <h5>Confirmed</h5>
            <h1 style={{width: '6rem'}}>
              {confirmed}
              <small style={{alignSelf: 'center', fontSize: '1rem'}}>
                &nbsp; [
                {deltas
                  ? deltas.confirmeddelta >= 0
                    ? '+' + deltas.confirmeddelta
                    : '+0'
                  : ''}
                ]
              </small>
            </h1>
          </div>
          <Minigraph
            timeseries={timeseries}
            animate={false}
            panelType="CONFIRMED"
          />
        </div>
      </div>

      <div className="card border-left-blue">
        <div className="body is-blue">
          <div>
            <h5 className="heading">Active</h5>
            <h1 className="title has-text-info">{active}</h1>
          </div>

          <Minigraph
            timeseries={timeseries}
            animate={false}
            panelType="ACTIVE"
          />
        </div>
      </div>

      <div className="card border-left-green">
        <div className="body is-green">
          <div>
            <h5 className="heading">Recovered</h5>
            <h1 className="title has-text-success" style={{width: '6rem'}}>
              {recoveries}
              <small style={{alignSelf: 'center', fontSize: '1rem'}}>
                &nbsp; [
                {deltas
                  ? deltas.recovereddelta >= 0
                    ? '+' + deltas.recovereddelta
                    : '+0'
                  : ''}
                ]
              </small>
            </h1>
          </div>

          <Minigraph
            timeseries={timeseries}
            animate={false}
            panelType="RECOVERIES"
          />
        </div>
      </div>

      <div className="card border-left-gray">
        <div className="body is-gray">
          <div>
            <h5 className="heading">Deceased</h5>
            <h1 className="title has-text-grey" style={{width: '6rem'}}>
              {deaths}
              <small style={{alignSelf: 'center', fontSize: '1rem'}}>
                &nbsp; [
                {deltas
                  ? deltas.deceaseddelta >= 0
                    ? '+' + deltas.deceaseddelta
                    : '+0'
                  : ''}
                ]
              </small>
            </h1>
          </div>

          <Minigraph
            timeseries={timeseries}
            animate={false}
            panelType="DEATHS"
          />
        </div>
      </div>
    </div>
  );
}

export default Level;
