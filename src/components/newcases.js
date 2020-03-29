import React, {useState, useEffect} from 'react';

function RateOfNewCases(props) {
  const [yesterdayCases, setYesterdayCases] = useState(0);
  const [secondLastDayCases, setSecondLastDayCases] = useState(0);
  const [secondLastDayDate, setSecondLastDayDate] = useState(0);
  const [thirdLastDayCases, setThirdLastDayCases] = useState(0);
  const [fourthLastDayCases, setFourthLastDayCases] = useState(0);
  const [thirdLastDayDate, setThirdLastDayDate] = useState(0);

  useEffect(() => {
    parseData();
  });

  const parseData = () => {
    const length = props.timeseries.length;
    if (length > 0) {
      setYesterdayCases(props.timeseries[length - 1]['dailyconfirmed']);
      setSecondLastDayCases(props.timeseries[length - 2]['dailyconfirmed']);
      setSecondLastDayDate(props.timeseries[length - 2]['date']);
      setThirdLastDayCases(props.timeseries[length - 3]['dailyconfirmed']);
      setThirdLastDayDate(props.timeseries[length - 3]['date']);
      setFourthLastDayCases(props.timeseries[length - 4]['dailyconfirmed']);
    }
  };

  return (
    <div className="home-left">
      <h2 className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
        Rate of New Cases
      </h2>
      <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
        <div
          className={`level-item ${
            thirdLastDayCases - fourthLastDayCases < 0
              ? 'is-green'
              : 'is-cherry'
          }`}
        >
          <h5 className="heading">{thirdLastDayDate}</h5>
          <h2 className="title has-text-grey">{thirdLastDayCases}</h2>
        </div>

        <div
          className={`level-item ${
            secondLastDayCases - thirdLastDayCases < 0
              ? 'is-green'
              : 'is-cherry'
          }`}
        >
          <h5 className="heading"> </h5>
          <h1>
            {(secondLastDayCases - thirdLastDayCases > 0 ? '+' : '') +
              (secondLastDayCases - thirdLastDayCases)}
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div
          className={`level-item ${
            secondLastDayCases - thirdLastDayCases < 0
              ? 'is-green'
              : 'is-cherry'
          }`}
        >
          <h5 className="heading">{secondLastDayDate}</h5>
          <h2 className="title has-text-success">{secondLastDayCases} </h2>
        </div>

        <div
          className={`level-item ${
            yesterdayCases - secondLastDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading has-text-info">{} </h5>
          <h1 className="has-text-info">
            {(yesterdayCases - secondLastDayCases > 0 ? '+' : '') +
              (yesterdayCases - secondLastDayCases)}
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div
          className={`level-item ${
            yesterdayCases - secondLastDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading">Yesterday</h5>
          <h2 className="title has-text-info">{yesterdayCases}</h2>
        </div>

        <div className="level-item is-blue">
          <h5 className="heading"> </h5>
          <h1>
            {(props.deltas.confirmeddelta - yesterdayCases > 0 ? '+' : '') +
              (props.deltas.confirmeddelta - yesterdayCases)}
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div className="level-item is-blue">
          <h5>Today</h5>
          <h2> {props.deltas.confirmeddelta}* </h2>
        </div>
      </div>
    </div>
  );
}

export default RateOfNewCases;
