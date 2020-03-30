import React, {useState, useEffect} from 'react';

function RateOfNewCases(props) {
  const [casesMap, setCasesMap] = useState(0);
  const [length, setLength] = useState(0);
  const upArrow = String.fromCharCode(8593);
  const downArrow = String.fromCharCode(8595);

  useEffect(() => {
    parseData();
  });

  const parseData = () => {
    const length = props.timeseries.length;
    if (length > 0) {
      const casesDetails = [
        {
          cases: props.deltas.confirmeddelta,
          date: 'Today',
        },
        {
          cases: props.timeseries[length - 1]['dailyconfirmed'],
          date: 'Yesterday',
        },
        {
          cases: props.timeseries[length - 2]['dailyconfirmed'],
          date: props.timeseries[length - 2]['date'],
        },
        {
          cases: props.timeseries[length - 3]['dailyconfirmed'],
          date: props.timeseries[length - 3]['date'],
        },
        {
          cases: props.timeseries[length - 4]['dailyconfirmed'],
          date: props.timeseries[length - 4]['date'],
        },
      ];
      setCasesMap(casesDetails);
      setLength(length);
    }
  };

  return (
    <div className="home-left">
      <h2 className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
        Rate of New Cases
      </h2>
      <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
        {length > 0 && (
          <React.Fragment>
            <div
              className={`level-item ${
                casesMap[3].cases - casesMap[4].cases < 0
                  ? 'is-green'
                  : 'is-cherry'
              }`}
            >
              <h5 className="heading">{casesMap[3].date}</h5>
              <h2 className="title has-text-grey">{casesMap[3].cases}</h2>
            </div>

            <div
              className={`level-item ${
                casesMap[2].cases - casesMap[3].cases < 0
                  ? 'is-green'
                  : 'is-cherry'
              }`}
            >
              <h5 className="heading"> </h5>
              <h1>
                {casesMap[2].cases - casesMap[3].cases > 0
                  ? upArrow
                  : downArrow}
                {Math.abs(casesMap[2].cases - casesMap[3].cases)}
              </h1>
              <h1 className="title has-text-grey">{}</h1>
            </div>

            <div
              className={`level-item ${
                casesMap[2].cases - casesMap[3].cases < 0
                  ? 'is-green'
                  : 'is-cherry'
              }`}
            >
              <h5 className="heading">{casesMap[2].date}</h5>
              <h2 className="title has-text-success">{casesMap[2].cases} </h2>
            </div>

            <div
              className={`level-item ${
                casesMap[1].cases - casesMap[2].cases < 0
                  ? 'is-green'
                  : 'is-cherry'
              }`}
            >
              <h5 className="heading has-text-info">{} </h5>
              <h1 className="has-text-info">
                {casesMap[1].cases - casesMap[2].cases > 0
                  ? upArrow
                  : downArrow}
                {Math.abs(casesMap[1].cases - casesMap[2].cases)}
              </h1>
              <h1 className="title has-text-grey">{}</h1>
            </div>

            <div
              className={`level-item ${
                casesMap[1].cases - casesMap[2].cases < 0
                  ? 'is-green'
                  : 'is-cherry'
              }`}
            >
              <h5 className="heading">{casesMap[1].date}</h5>
              <h2 className="title has-text-info">{casesMap[1].cases}</h2>
            </div>

            <div className="level-item is-blue">
              <h5 className="heading"> </h5>
              <h1>
                {casesMap[0].cases - casesMap[1].cases > 0
                  ? upArrow
                  : downArrow}
                {Math.abs(casesMap[0].cases - casesMap[1].cases)}*
              </h1>
              <h1 className="title has-text-grey">{}</h1>
            </div>

            <div className="level-item is-blue">
              <h5>{casesMap[0].date}</h5>
              <h2> {casesMap[0].cases}* </h2>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default RateOfNewCases;
