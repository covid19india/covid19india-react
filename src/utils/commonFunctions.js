import {
  INDIA_ISO_SUFFIX,
  ISO_DATE_REGEX,
  LOCALE_SHORTHANDS,
  NAN_STATISTICS,
  PER_MILLION_OPTIONS,
  STATISTIC_CONFIGS,
  TESTED_LOOKBACK_DAYS,
} from '../constants';

import {
  differenceInDays,
  format,
  formatDistance,
  formatISO,
  subDays,
} from 'date-fns';
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

export const getIndiaDateYesterday = () => {
  return subDays(getIndiaDate(), 1);
};

export const getIndiaDateYesterdayISO = () => {
  return formatISO(getIndiaDateYesterday(), {representation: 'date'});
};

export const formatLastUpdated = (unformattedDate) => {
  getLocale();
  return formatDistance(new Date(unformattedDate), new Date(), {
    locale: locale,
  });
};

export const parseIndiaDate = (isoDate) => {
  if (!isoDate) return getIndiaDate();
  if (isoDate.match(ISO_DATE_REGEX)) isoDate += INDIA_ISO_SUFFIX;
  return utcToZonedTime(new Date(isoDate), 'Asia/Kolkata');
};

export const formatDate = (unformattedDate, formatString) => {
  if (!unformattedDate) return '';
  if (
    typeof unformattedDate === 'string' &&
    unformattedDate.match(ISO_DATE_REGEX)
  )
    unformattedDate += INDIA_ISO_SUFFIX;
  const date = utcToZonedTime(new Date(unformattedDate), 'Asia/Kolkata');
  return format(date, formatString, {
    locale: locale,
  });
};

export const abbreviateNumber = (number) => {
  if (Math.abs(number) < 1e3) return numberFormatter.format(number);
  else if (Math.abs(number) >= 1e3 && Math.abs(number) < 1e5)
    return numberFormatter.format(number / 1e3) + 'K';
  else if (Math.abs(number) >= 1e5 && Math.abs(number) < 1e7)
    return numberFormatter.format(number / 1e5) + 'L';
  else if (Math.abs(number) >= 1e7 && Math.abs(number) < 1e10)
    return numberFormatter.format(number / 1e7) + 'Cr';
  else if (Math.abs(number) >= 1e10 && Math.abs(number) < 1e14)
    return numberFormatter.format(number / 1e10) + 'K Cr';
  else if (Math.abs(number) >= 1e14)
    return numberFormatter.format(number / 1e14) + 'L Cr';
};

export const formatNumber = (value, option, statistic) => {
  if (statistic && NAN_STATISTICS.includes(statistic) && value === 0)
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

export const getStatistic = (
  data,
  type,
  statistic,
  {perMillion = false, movingAverage = false} = {}
) => {
  // TODO: Replace delta with daily to remove ambiguity
  //       Or add another type for daily/delta
  const statisticDefinition = STATISTIC_CONFIGS[statistic]?.definition;

  const {key, normalizeByKey: normalizeBy} = {
    ...statisticDefinition,
    ...(perMillion &&
      !statisticDefinition?.normalizeByKey &&
      PER_MILLION_OPTIONS),
  };

  let multiplyFactor = statisticDefinition?.multiplyFactor || 1;
  multiplyFactor *=
    (!statisticDefinition?.normalizeByKey &&
      perMillion &&
      PER_MILLION_OPTIONS?.multiplyFactor) ||
    1;

  if (type === 'delta' && movingAverage) {
    type = 'delta7';
    multiplyFactor *= (!statisticDefinition?.normalizeByKey && 1 / 7) || 1;
  }

  let count;
  if (key === 'population') {
    count = type === 'total' ? data?.meta?.population : 0;
  } else if (key === 'tested') {
    count = data?.[type]?.tested;
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
    count /= getStatistic(
      data,
      normalizeBy === 'population' ? 'total' : type,
      normalizeBy
    );
  }

  return multiplyFactor * ((isFinite(count) && count) || 0);
};

export const getTableStatistic = (data, statistic, args, lastUpdatedTT) => {
  const statisticDefinition = STATISTIC_CONFIGS[statistic]?.definition;

  const expired =
    (statisticDefinition?.key === 'tested' ||
      statisticDefinition?.normalizeByKey === 'tested') &&
    differenceInDays(
      lastUpdatedTT,
      parseIndiaDate(data.meta?.tested?.['last_updated'])
    ) > TESTED_LOOKBACK_DAYS;

  const type = STATISTIC_CONFIGS[statistic]?.tableConfig?.type || 'total';

  const total = !expired ? getStatistic(data, type, statistic, args) : 0;
  const delta =
    type === 'total' && !expired
      ? getStatistic(data, 'delta', statistic, args)
      : 0;
  return {total, delta};
};

export const fetcher = (url) => {
  return fetch(url).then((response) => {
    return response.json();
  });
};

export function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}
