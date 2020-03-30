import React, {useState, useEffect} from 'react';

function RateOfNewCases(props) {
  const [casesMap, setCasesMap] = useState(0);
  const [length, setLength] = useState(0);
  const upArrow = String.fromCharCode(8593);
  const downArrow = String.fromCharCode(8595);

  useEffect(() => {
    parseData();
  }, [props.timeseries, props.deltas]);

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
      {length > 0 && (
        <React.Fragment>
          <h2 className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
            Rate of New Cases
          </h2>
          <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
            {(function () {
              const rows = [];
              for (let index = casesMap.length - 1; index > 0; index--) {
                rows.push(
                  <React.Fragment>
                    {index < casesMap.length - 1 && (
                      <div
                        className={`level-item ${
                          casesMap[index - 1].cases - casesMap[index].cases < 0
                            ? casesMap[index - 1].date == 'Today'
                              ? 'is-blue'
                              : 'is-green'
                            : 'is-cherry'
                        }`}
                      >
                        <h5 className="heading"> </h5>
                        <h1>
                          {casesMap[index - 1].cases - casesMap[index].cases > 0
                            ? upArrow
                            : downArrow}
                          {Math.abs(
                            casesMap[index - 1].cases - casesMap[index].cases
                          )}
                          {casesMap[index - 1].date == 'Today' ? '*' : ''}
                        </h1>
                        <h1 className="title has-text-grey">{}</h1>
                      </div>
                    )}
                    <div
                      className={`level-item ${
                        casesMap[index - 1].cases - casesMap[index].cases < 0
                          ? casesMap[index - 1].date == 'Today'
                            ? 'is-blue'
                            : 'is-green'
                          : 'is-cherry'
                      }`}
                    >
                      <h5 className="heading">{casesMap[index - 1].date}</h5>
                      <h2 className="title has-text-grey">
                        {casesMap[index - 1].cases}
                        {casesMap[index - 1].date == 'Today' ? '*' : ''}
                      </h2>
                    </div>
                  </React.Fragment>
                );
              }
              return rows;
            })()}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default RateOfNewCases;
