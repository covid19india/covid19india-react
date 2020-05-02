import {STATE_CODES} from '../constants';

import {parse, isBefore, isSameDay, startOfDay} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';

const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const getStateName = (code) => {
  return STATE_CODES[code.toUpperCase()];
};

export const getIndiaDay = () => {
  return startOfDay(utcToZonedTime(new Date(), 'Asia/Kolkata'));
};

export const formatDate = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const year = unformattedDate.slice(6, 10);
  const time = unformattedDate.slice(11);
  return `${year}-${month}-${day}T${time}+05:30`;
};

export const formatDateAbsolute = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

const validateCTS = (data = []) => {
  const dataTypes = [
    'dailyconfirmed',
    'dailydeceased',
    'dailyrecovered',
    'totalconfirmed',
    'totaldeceased',
    'totalrecovered',
  ];
  return data
    .filter((d) => dataTypes.every((dt) => d[dt]) && d.date)
    .filter((d) => dataTypes.every((dt) => Number(d[dt]) >= 0))
    .filter((d) => {
      // Skip data from the current day
      const today = getIndiaDay();
      const date = parse(d.date, 'dd MMMM', new Date(2020, 0, 1));
      return isBefore(date, today);
    });
};

export const preprocessTimeseries = (timeseries) => {
  return validateCTS(timeseries).map((stat, index) => ({
    date: parse(stat.date, 'dd MMMM', new Date(2020, 0, 1)),
    totalconfirmed: +stat.totalconfirmed,
    totalrecovered: +stat.totalrecovered,
    totaldeceased: +stat.totaldeceased,
    dailyconfirmed: +stat.dailyconfirmed,
    dailyrecovered: +stat.dailyrecovered,
    dailydeceased: +stat.dailydeceased,
    // Active = Confimed - Recovered - Deceased
    totalactive:
      +stat.totalconfirmed - +stat.totalrecovered - +stat.totaldeceased,
    dailyactive:
      +stat.dailyconfirmed - +stat.dailyrecovered - +stat.dailydeceased,
  }));
};

/**
 * Returns the last `days` entries
 * @param {Array<Object>} timeseries
 * @param {number} days
 *
 * @return {Array<Object>}
 */
export function sliceTimeseriesFromEnd(timeseries, days) {
  return timeseries.slice(-days);
}

export const formatNumber = (value) => {
  const numberFormatter = new Intl.NumberFormat('en-IN');
  return isNaN(value) ? '-' : numberFormatter.format(value);
};

export const parseStateTimeseries = ({states_daily: data}) => {
  const statewiseSeries = Object.keys(STATE_CODES).reduce((a, c) => {
    a[c] = [];
    return a;
  }, {});

  const today = getIndiaDay();
  for (let i = 0; i < data.length; i += 3) {
    const date = parse(data[i].date, 'dd-MMM-yy', new Date());
    // Skip data from the current day
    if (isBefore(date, today)) {
      Object.entries(statewiseSeries).forEach(([k, v]) => {
        const stateCode = k.toLowerCase();
        const prev = v[v.length - 1] || {};
        // Parser
        const dailyconfirmed = +data[i][stateCode] || 0;
        const dailyrecovered = +data[i + 1][stateCode] || 0;
        const dailydeceased = +data[i + 2][stateCode] || 0;
        const totalconfirmed = +data[i][stateCode] + (prev.totalconfirmed || 0);
        const totalrecovered =
          +data[i + 1][stateCode] + (prev.totalrecovered || 0);
        const totaldeceased =
          +data[i + 2][stateCode] + (prev.totaldeceased || 0);
        // Push
        v.push({
          date: date,
          dailyconfirmed: dailyconfirmed,
          dailyrecovered: dailyrecovered,
          dailydeceased: dailydeceased,
          totalconfirmed: totalconfirmed,
          totalrecovered: totalrecovered,
          totaldeceased: totaldeceased,
          // Active = Confimed - Recovered - Deceased
          totalactive: totalconfirmed - totalrecovered - totaldeceased,
          dailyactive: dailyconfirmed - dailyrecovered - dailydeceased,
        });
      });
    }
  }

  return statewiseSeries;
};

export const parseStateTestTimeseries = (data) => {
  const stateCodeMap = Object.keys(STATE_CODES).reduce((ret, sc) => {
    ret[STATE_CODES[sc]] = sc;
    return ret;
  }, {});

  const testTimseries = Object.keys(STATE_CODES).reduce((ret, sc) => {
    ret[sc] = [];
    return ret;
  }, {});

  const today = getIndiaDay();
  data.forEach((d) => {
    const date = parse(d.updatedon, 'dd/MM/yyyy', new Date());
    const totaltested = +d.totaltested;
    if (isBefore(date, today) && totaltested) {
      const stateCode = stateCodeMap[d.state];
      testTimseries[stateCode].push({
        date: date,
        totaltested: totaltested,
      });
    }
  });
  return testTimseries;
};

export const parseTotalTestTimeseries = (data) => {
  const testTimseries = [];
  const today = getIndiaDay();
  data.forEach((d) => {
    const date = parse(
      d.updatetimestamp.split(' ')[0],
      'dd/MM/yyyy',
      new Date()
    );
    const totaltested = +d.totalsamplestested;
    if (isBefore(date, today) && totaltested) {
      testTimseries.push({
        date: date,
        totaltested: totaltested,
      });
    }
  });
  return testTimseries;
};

export const mergeTimeseries = (ts1, ts2) => {
  const tsRet = Object.assign({}, ts1);
  for (const state in ts1) {
    if (ts1.hasOwnProperty(state)) {
      tsRet[state] = ts1[state].map((d1) => {
        const testData = ts2[state].find((d2) => isSameDay(d1.date, d2.date));
        return {
          totaltested: testData?.totaltested,
          ...d1,
        };
      });
    }
  }
  return tsRet;
};
