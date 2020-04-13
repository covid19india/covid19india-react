import React, {useState, useEffect} from 'react';
import {formatNumber} from '../utils/common-functions';

function Level(props) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData({
      active: +props.data.active,
      confirmed: +props.data.confirmed,
      recovered: +props.data.recovered,
      deaths: +props.data.deaths,
      deltaconfirmed: +props.data.deltaconfirmed,
      deltadeaths: +props.data.deltadeaths,
      deltarecovered: +props.data.deltarecovered,
    });
  }, [props.data]);

  return (
    <div className="Level">
      <div
        className="level-item is-cherry fadeInUp"
        style={{animationDelay: '1s'}}
      >
        <h5>Confirmed</h5>
        <h4>
          [
          {isNaN(data.deltaconfirmed)
            ? ''
            : data.deltaconfirmed > 0
            ? '+' + formatNumber(data.deltaconfirmed)
            : '+0'}
          ]
        </h4>
        <h1>{formatNumber(data.confirmed)} </h1>
      </div>

      <div
        className="level-item is-blue fadeInUp"
        style={{animationDelay: '1.1s'}}
      >
        <h5 className="heading">Active</h5>
        <h4>&nbsp;</h4>
        {/* <h4>[{props.deltas ? props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta) >=0 ? '+'+(props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta)).toString() : '+0' : ''}]</h4>*/}
        <h1 className="title has-text-info">{formatNumber(data.active)}</h1>
      </div>

      <div
        className="level-item is-green fadeInUp"
        style={{animationDelay: '1.2s'}}
      >
        <h5 className="heading">Recovered</h5>
        <h4>
          [
          {isNaN(data.deltarecovered)
            ? ''
            : data.deltarecovered > 0
            ? '+' + formatNumber(data.deltarecovered)
            : '+0'}
          ]
        </h4>
        <h1 className="title has-text-success">
          {formatNumber(data.recovered)}{' '}
        </h1>
      </div>

      <div
        className="level-item is-gray fadeInUp"
        style={{animationDelay: '1.3s'}}
      >
        <h5 className="heading">Deceased</h5>
        <h4>
          [
          {isNaN(data.deltadeaths)
            ? ''
            : data.deltadeaths > 0
            ? '+' + formatNumber(data.deltadeaths)
            : '+0'}
          ]
        </h4>
        <h1 className="title has-text-grey">{formatNumber(data.deaths)}</h1>
      </div>
    </div>
  );
}

export default Level;
