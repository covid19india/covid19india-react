import moment from 'moment';

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

const stateCodes = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CT: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UT: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
  AN: 'Andaman and Nicobar Islands',
  CH: 'Chandigarh',
  DN: 'Dadra and Nagar Haveli',
  DD: 'Daman and Diu',
  DL: 'Delhi',
  JK: 'Jammu and Kashmir',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  PY: 'Puducherry',
};

export const getStateName = (code) => {
  return stateCodes[code.toUpperCase()];
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
      const year = today.getFullYear();
      return new Date(d.date + year) < today;
    });
};

export const preprocessTimeseries = (timeseries) => {
  return validateCTS(timeseries).map((stat) => ({
    date: new Date(stat.date + ' 2020'),
    totalconfirmed: +stat.totalconfirmed,
    totalrecovered: +stat.totalrecovered,
    totaldeceased: +stat.totaldeceased,
    dailyconfirmed: +stat.dailyconfirmed,
    dailyrecovered: +stat.dailyrecovered,
    dailydeceased: +stat.dailydeceased,
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
  const statewiseSeries = Object.keys(stateCodes).reduce((a, c) => {
    a[c] = [];
    return a;
  }, {});

  const today = moment();
  for (let i = 0; i < data.length; i += 3) {
    const date = moment(data[i].date, 'DD-MMM-YY');
    // Skip data from the current day
    if (date.isBefore(today, 'Date')) {
      Object.entries(statewiseSeries).forEach(([k, v]) => {
        const stateCode = k.toLowerCase();
        const prev = v[v.length - 1] || {};
        v.push({
          date: date.toDate(),
          dailyconfirmed: +data[i][stateCode] || 0,
          dailyrecovered: +data[i + 1][stateCode] || 0,
          dailydeceased: +data[i + 2][stateCode] || 0,
          totalconfirmed: +data[i][stateCode] + prev.totalconfirmed || 0,
          totalrecovered: +data[i + 1][stateCode] + prev.totalrecovered || 0,
          totaldeceased: +data[i + 2][stateCode] + prev.totaldeceased || 0,
        });
      });
    }
  }

  return statewiseSeries;
};
