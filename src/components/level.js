import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

function Level(props) {
  const {t} = useTranslation();
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
    <div className="Level">
      <div
        className="level-item is-cherry fadeInUp"
        style={{animationDelay: '1s'}}
      >
        <h5>{t('Confirmed')}</h5>
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

      <div
        className="level-item is-blue fadeInUp"
        style={{animationDelay: '1.1s'}}
      >
        <h5 className="heading">{t('Active')}</h5>
        <h4>&nbsp;</h4>
        {/* <h4>[{props.deltas ? props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta) >=0 ? '+'+(props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta)).toString() : '+0' : ''}]</h4>*/}
        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div
        className="level-item is-green fadeInUp"
        style={{animationDelay: '1.2s'}}
      >
        <h5 className="heading">{t('Recovered')}</h5>
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

      <div
        className="level-item is-gray fadeInUp"
        style={{animationDelay: '1.3s'}}
      >
        <h5 className="heading">{t('Deaths')}</h5>
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
