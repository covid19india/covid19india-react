import {LOCALE_SHORTHANDS} from '../constants';

import axios from 'axios';
import {startOfDay, format, formatDistance} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import i18n from 'i18next';

export const isDevelopmentOrTest = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
    return true;
  return false;
};

export const getIndiaDay = () => {
  return startOfDay(utcToZonedTime(new Date(), 'Asia/Kolkata'));
};

export const formatLastUpdated = (unformattedDate) => {
  return formatDistance(new Date(unformattedDate), new Date(), {
    locale: LOCALE_SHORTHANDS[i18n.language],
  });
};

export const formatDate = (unformattedDate, formatString) => {
  return format(new Date(unformattedDate), formatString, {
    locale: LOCALE_SHORTHANDS[i18n.language],
  });
};

export function sliceTimeseriesFromEnd(timeseries, days) {
  return timeseries.slice(-days);
}

export const formatNumber = (value) => {
  const numberFormatter = new Intl.NumberFormat('en-IN');
  return isNaN(value) ? '-' : numberFormatter.format(value);
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const capitalizeAll = (s) => {
  if (typeof s !== 'string') return '';
  const str = s.toLowerCase().split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = capitalize(str[i]);
  }
  return str.join(' ');
};

export const abbreviate = (s) => {
  return s.slice(0, 1) + s.slice(1).replace(/[aeiou]/gi, '');
};

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getStatistic = (data, type, statistic, normalizer = 1) => {
  let count;
  if (statistic === 'active') {
    const confirmed = data?.[type]?.confirmed || 0;
    const deceased = data?.[type]?.deceased || 0;
    const recovered = data?.[type]?.recovered || 0;
    count = confirmed - deceased - recovered;
  } else {
    count = data?.[type]?.[statistic] || 0;
  }
  return count / normalizer;
};

export const fetcher = (url) => axios(url).then((response) => response.data);
