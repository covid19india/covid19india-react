import {INDIA_ISO_SUFFIX, LOCALE_SHORTHANDS} from '../constants';

import {format, formatDistance, formatISO, subDays} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import i18n from 'i18next';

let locale = null;

const getLocale = () => {
  import('date-fns/locale/').then((localePackage) => {
    locale =
      localePackage[
        LOCALE_SHORTHANDS[i18n.language || window.localStorage.i18nextLng]
      ];
  });
};

export const isDevelopmentOrTest = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
    return true;
  return false;
};

export const getIndiaDate = () => {
  return utcToZonedTime(new Date(), 'Asia/Kolkata');
};

export const getIndiaDateISO = () => {
  return formatISO(getIndiaDate(), {representation: 'date'});
};

export const getIndiaYesterdayISO = () => {
  return formatISO(subDays(getIndiaDate(), 1), {representation: 'date'});
};

export const formatLastUpdated = (unformattedDate) => {
  getLocale();
  return formatDistance(new Date(unformattedDate), new Date(), {
    locale: locale,
  });
};

export const parseIndiaDate = (isoDate) => {
  return utcToZonedTime(new Date(isoDate + INDIA_ISO_SUFFIX), 'Asia/Kolkata');
};

export const formatDate = (unformattedDate, formatString) => {
  if (
    typeof unformattedDate === 'string' &&
    unformattedDate.match(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/g)
  )
    unformattedDate += INDIA_ISO_SUFFIX;
  const date = utcToZonedTime(new Date(unformattedDate), 'Asia/Kolkata');
  return format(date, formatString, {
    locale: locale,
  });
};

export const abbreviateNumber = (number) => {
  const numberFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  });

  if (number < 1e3) return numberFormatter.format(number);
  if (number >= 1e3 && number < 1e6)
    return numberFormatter.format(number / 1e3) + 'K';
  if (number >= 1e6 && number < 1e9)
    return numberFormatter.format(number / 1e6) + 'M';
  if (number >= 1e9 && number < 1e12)
    return numberFormatter.format(number / 1e9) + 'B';
  if (number >= 1e12) return numberFormatter.format(number / 1e12) + 'T';
};

export const formatNumber = (value, option) => {
  if (isNaN(value)) return '-';
  else if (option === 'short') {
    return abbreviateNumber(value);
  }

  if (option === 'int') {
    value = Math.floor(value);
  }

  const numberFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  });

  return numberFormatter.format(value) + (option === '%' ? '%' : '');
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getStatistic = (data, type, statistic, options = {}) => {
  let count;
  if (statistic === 'population') {
    count = type === 'total' ? data?.meta?.population || NaN : 0;
  } else if (statistic === 'tested') {
    count = data?.[type]?.[statistic] || NaN;
  } else if (statistic === 'active') {
    const confirmed = data?.[type]?.confirmed || 0;
    const deceased = data?.[type]?.deceased || 0;
    const recovered = data?.[type]?.recovered || 0;
    const migrated = data?.[type]?.migrated || 0;
    count = confirmed - deceased - recovered - migrated;
  } else {
    count = data?.[type]?.[statistic] || 0;
  }

  if (options.percentagePerConfirmed) {
    const confirmed = data?.total?.confirmed || 0;
    if (type === 'delta') {
      const prevConfirmed = confirmed - data?.delta?.confirmed || 0;
      const currTotal = getStatistic(data, 'total', statistic);
      const prevTotal = currTotal - count;
      const currRate = confirmed ? currTotal / confirmed : NaN;
      const prevRate = prevConfirmed ? prevTotal / prevConfirmed : NaN;
      return 100 * (currRate - prevRate);
    } else if (type === 'total') {
      return confirmed ? (100 * count) / confirmed : NaN;
    }
  } else if (options.perMillion) {
    return (1e6 * count) / data?.meta?.population || 0;
  } else {
    return count;
  }
};

export const fetcher = (url) => {
  return fetch(url).then((response) => {
    return response.json();
  });
};
