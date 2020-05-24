import {TIMESERIES_STATISTICS} from '../../constants';

import {format} from 'date-fns';
import produce from 'immer';
import {useMemo, useCallback} from 'react';

function useTimeseries(timeseries, chartType = 'cumulative') {
  const dates = Object.keys(timeseries);

  const highlightedDate = format(
    new Date(dates[dates.length - 1]),
    'yyyy-MM-dd'
  );

  const getDailyStatistic = useCallback(
    (date, statistic, chartType) => {
      switch (chartType) {
        case 'cumulative':
          const index = dates.findIndex((date) => date === highlightedDate);
          switch (statistic) {
            case 'active':
              return (
                statistics[chartType].confirmed[index] -
                statistics[chartType].recovered[index] -
                statistics[chartType].deceased[index]
              );

            default:
              return statistics[chartType][statistic][index];
          }

        default:
          switch (statistic) {
            case 'active':
              return (
                timeseries[date].confirmed -
                timeseries[date].recovered -
                timeseries[date].deceased
              );

            case 'tested':
              return timeseries[date].tested?.samples || 0;

            default:
              return timeseries[date][statistic];
          }
      }
    },
    [dates, highlightedDate, timeseries]
  );

  const statistics = useMemo(() => {
    const statistics = {};

    const getDiscreteStatisticArray = (statistic) => {
      let array = [];
      dates.map(
        (date) => (array = [...array, getDailyStatistic(date, statistic)])
      );
      return array;
    };

    const getCumulativeStatisticArray = (discreteStatisticArray) => {
      return discreteStatisticArray.reduce(function (
        r,
        discreteStatisticArray
      ) {
        r.push(((r.length && r[r.length - 1]) || 0) + discreteStatisticArray);
        return r;
      },
      []);
    };

    TIMESERIES_STATISTICS.map((statistic) => {
      switch (chartType) {
        case 'cumulative':
          return (statistics['cumulative'] = produce(
            statistics['cumulative'] || {},
            (draftCumulative) => {
              draftCumulative[statistic] = getCumulativeStatisticArray(
                getDiscreteStatisticArray(statistic)
              );
            }
          ));

        case 'discrete':
          return (statistics['discrete'] = produce(
            statistics['discrete'] || {},
            (draftDiscrete) => {
              draftDiscrete[statistic] = getDiscreteStatisticArray(statistic);
            }
          ));
      }
    });

    return statistics;
  }, [chartType, dates, getDailyStatistic]);

  return [statistics, dates, getDailyStatistic];
}

export default useTimeseries;
