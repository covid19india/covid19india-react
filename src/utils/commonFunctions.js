import {
  INDIA_ISO_SUFFIX,
  LOCALE_SHORTHANDS,
  NAN_STATISTICS,
  PER_MILLION_OPTIONS,
  STATISTIC_OPTIONS,
} from '../constants';

import {format, formatDistance, formatISO, subDays} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import i18n from 'i18next';

let locale = null;
const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 1,
});

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
  if (number < 1e3) return numberFormatter.format(number);
  else if (number >= 1e3 && number < 1e6)
    return numberFormatter.format(number / 1e3) + 'K';
  else if (number >= 1e6 && number < 1e9)
    return numberFormatter.format(number / 1e6) + 'M';
  else if (number >= 1e9 && number < 1e12)
    return numberFormatter.format(number / 1e9) + 'B';
  else if (number >= 1e12) return numberFormatter.format(number / 1e12) + 'T';
};

export const formatNumber = (value, option, statistic) => {
  if (statistic && value === 0 && NAN_STATISTICS.includes(statistic))
    value = NaN;

  if (isNaN(value)) return '-';
  else if (option === 'short') {
    return abbreviateNumber(value);
  } else if (option === 'int') {
    value = Math.floor(value);
  }
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

export const getStatistic = (data, type, statistic, perMillion = false) => {
  const {key, normalizeByKey: normalizeBy, multiplyFactor} = {
    ...STATISTIC_OPTIONS[statistic],
    ...(perMillion &&
      !STATISTIC_OPTIONS[statistic]?.normalizeByKey &&
      PER_MILLION_OPTIONS),
  };

  let count;
  if (key === 'population') {
    count = type === 'total' ? data?.meta?.population : 0;
  } else if (key === 'tested') {
    count = data?.[type]?.tested?.samples;
  } else if (key === 'positives') {
    count = data?.[type]?.tested?.positives;
  } else if (key === 'active') {
    const confirmed = data?.[type]?.confirmed || 0;
    const deceased = data?.[type]?.deceased || 0;
    const recovered = data?.[type]?.recovered || 0;
    const other = data?.[type]?.other || 0;
    count = confirmed - deceased - recovered - other;
  } else {
    count = data?.[type]?.[key];
  }

  if (normalizeBy) {
    if (type === 'total') {
      const normStatistic = getStatistic(data, 'total', normalizeBy);
      count /= normStatistic;
    } else {
      const currStatisticDelta = count;
      const currStatistic = getStatistic(data, 'total', key);
      const prevStatistic = currStatistic - currStatisticDelta;

      const normStatisticDelta = getStatistic(data, 'delta', {
        key: normalizeBy,
      });
      const normStatistic = getStatistic(data, 'total', normalizeBy);
      const prevNormStatistic = normStatistic - normStatisticDelta;

      count = currStatistic / normStatistic - prevStatistic / prevNormStatistic;
    }
  }

  return (multiplyFactor || 1) * count || 0;
};

export const getIndiaTPR = (states) => {
  const sumTested = Object.keys(states || {})
    .filter((stateCode) => stateCode !== 'TT')
    .reduce(
      (acc, stateCode) => {
        acc.total.positives += getStatistic(
          states[stateCode],
          'total',
          'positives'
        );
        acc.total.samples += getStatistic(states[stateCode], 'total', 'tested');

        acc.delta.positives += getStatistic(
          states[stateCode],
          'delta',
          'positives'
        );
        acc.delta.samples += getStatistic(states[stateCode], 'delta', 'tested');
        return acc;
      },
      {
        total: {
          samples: 0,
          positives: 0,
        },
        delta: {
          samples: 0,
          positives: 0,
        },
      }
    );

  const positives = sumTested.total.positives;
  const samples = sumTested.total.samples;
  const prevPositives = sumTested.total.positives - sumTested.delta.positives;
  const prevSamples = sumTested.total.samples - sumTested.delta.samples;

  const total = (100 * positives) / samples;
  const delta = 100 * (positives / samples - prevPositives / prevSamples);

  return {total, delta};
};

export const fetcher = (url) => {
  return fetch(url).then((response) => {
    return response.json();
  });
};
