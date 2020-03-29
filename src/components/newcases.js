import React, {useState, useEffect} from 'react';

function RateOfNewCases(props) {
  const [firstDayCases, setFirstDayCases] = useState(0);
  const [firstDayDate, setFirstDayDate] = useState(0);
  const [secondDayCases, setSecondDayCases] = useState(0);
  const [secondDayDate, setSecondDayDate] = useState(0);
  const [thirdDayCases, setThirdDayCases] = useState(0);
  const [thirdDayDate, setThirdDayDate] = useState(0);
  const [fourthDayCases, setFourthDayCases] = useState(0);
  const [fourthDayDate, setFourthDayDate] = useState(0);
  const [fifthDayCases, setFifthDayCases] = useState(0);
  const [upArrow, setUpArrow] = useState(0);
  const [downArrow, setDownArrow] = useState(0);

  useEffect(() => {
    parseData();
    setUpArrow(String.fromCharCode(8593));
    setDownArrow(String.fromCharCode(8595));
  });

  const parseData = () => {
    const length = props.timeseries.length;
    if (length > 0) {
      setFirstDayCases(props.deltas.confirmeddelta);
      setFirstDayDate('Today');
      setSecondDayCases(props.timeseries[length - 1]['dailyconfirmed']);
      setSecondDayDate('Yesterday');
      setThirdDayCases(props.timeseries[length - 2]['dailyconfirmed']);
      setThirdDayDate(props.timeseries[length - 2]['date']);
      setFourthDayCases(props.timeseries[length - 3]['dailyconfirmed']);
      setFourthDayDate(props.timeseries[length - 3]['date']);
      setFifthDayCases(props.timeseries[length - 4]['dailyconfirmed']);
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
            fourthDayCases - fifthDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading">{fourthDayDate}</h5>
          <h2 className="title has-text-grey">{fourthDayCases}</h2>
        </div>

        <div
          className={`level-item ${
            thirdDayCases - fourthDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading"> </h5>
          <h1>
            {thirdDayCases - fourthDayCases > 0 ? upArrow : downArrow}
            {Math.abs(thirdDayCases - fourthDayCases)}
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div
          className={`level-item ${
            thirdDayCases - fourthDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading">{thirdDayDate}</h5>
          <h2 className="title has-text-success">{thirdDayCases} </h2>
        </div>

        <div
          className={`level-item ${
            secondDayCases - thirdDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading has-text-info">{} </h5>
          <h1 className="has-text-info">
            {secondDayCases - thirdDayCases > 0 ? upArrow : downArrow}
            {Math.abs(secondDayCases - thirdDayCases)}
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div
          className={`level-item ${
            secondDayCases - thirdDayCases < 0 ? 'is-green' : 'is-cherry'
          }`}
        >
          <h5 className="heading">{secondDayDate}</h5>
          <h2 className="title has-text-info">{secondDayCases}</h2>
        </div>

        <div className="level-item is-blue">
          <h5 className="heading"> </h5>
          <h1>
            {firstDayCases - secondDayCases > 0 ? upArrow : downArrow}
            {Math.abs(firstDayCases - secondDayCases)}*
          </h1>
          <h1 className="title has-text-grey">{}</h1>
        </div>

        <div className="level-item is-blue">
          <h5>{firstDayDate}</h5>
          <h2> {firstDayCases}* </h2>
        </div>
      </div>
    </div>
  );
}

export default RateOfNewCases;
