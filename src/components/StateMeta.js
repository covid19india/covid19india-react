import StateMetaCard from './StateMetaCard';

import {STATE_NAMES} from '../constants';
import {
  formatDate,
  formatNumber,
  formatLastUpdated,
  getStatistic,
  getIndiaDateYesterdayISO,
  parseIndiaDate,
} from '../utils/commonFunctions';

import {formatISO, subDays} from 'date-fns';
import {memo} from 'react';
import {Compass} from 'react-feather';
import {useTranslation} from 'react-i18next';

function Fraction({numerator, denominator}) {
  return (
    <div className="frac">
      <span>{numerator}</span>
      <span className="bottom">{denominator}</span>
    </div>
  );
}

function StateMeta({stateCode, data, timeseries}) {
  const {t} = useTranslation();

  const confirmedPerLakh = getStatistic(data[stateCode], 'total', 'confirmed', {
    normalizedByPopulationPer: 'lakh',
  });
  const testPerLakh = getStatistic(data[stateCode], 'total', 'tested', {
    normalizedByPopulationPer: 'lakh',
  });
  const totalConfirmedPerLakh = getStatistic(data['TT'], 'total', 'confirmed', {
    normalizedByPopulationPer: 'lakh',
  });

  const activePercent = getStatistic(data[stateCode], 'total', 'activeRatio');
  const recoveryPercent = getStatistic(
    data[stateCode],
    'total',
    'recoveryRatio'
  );
  const deathPercent = getStatistic(data[stateCode], 'total', 'cfr');

  // Show TPR for week preceeding last updated date
  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaDateYesterdayISO()
  );
  const lastDate = pastDates[pastDates.length - 1];
  const prevWeekDate = formatISO(subDays(parseIndiaDate(lastDate), 6));

  const tprWeek = getStatistic(timeseries?.[lastDate], 'delta', 'tpr', {
    movingAverage: true,
  });

  return (
    <>
      <div className="StateMeta population">
        <div className="meta-item population">
          <h3>{t('Population')}</h3>
          <h1>{formatNumber(data[stateCode]?.meta?.population)}</h1>
        </div>
        <div className="alert">
          <Compass />
          <div className="alert-right">
            {t('Based on 2019 population projection by NCP')}
            <a
              href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
              target="_noblank"
            >
              report
            </a>
          </div>
        </div>
      </div>

      <div className="StateMeta">
        <StateMetaCard
          className="confirmed"
          title={t('Confirmed Per Lakh')}
          statistic={formatNumber(confirmedPerLakh)}
          total={formatNumber(totalConfirmedPerLakh)}
          formula={
            <>
              {`${1e5} x `}
              <Fraction
                numerator={t('Total confirmed cases')}
                denominator={t('Total population')}
              />
            </>
          }
          description={`
            ~${formatNumber(confirmedPerLakh, 'long')} ${t(
            'out of every lakh people in'
          )} ${STATE_NAMES[stateCode]} ${t(
            'have tested positive for the virus.'
          )}
            `}
        />

        <StateMetaCard
          className="active"
          title={t('Active Ratio')}
          statistic={`${formatNumber(activePercent, '%')}`}
          formula={
            <>
              {'100 x '}
              <Fraction
                numerator={t('Total active cases right now')}
                denominator={t('Total confirmed cases')}
              />
            </>
          }
          description={
            activePercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  activePercent,
                  'long'
                )} ${t('are currently infected.')}`
              : t('Currently, there are no active cases in this state.')
          }
        />

        <StateMetaCard
          className="recovery"
          title={t('Recovery Ratio')}
          statistic={`${formatNumber(recoveryPercent, '%')}`}
          formula={
            <>
              {'100 x '}
              <Fraction
                numerator={t('Total recovered cases')}
                denominator={t('Total confirmed cases')}
              />
            </>
          }
          description={
            recoveryPercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  recoveryPercent,
                  'long'
                )} ${t('have recovered from the virus.')}`
              : t('Unfortunately, there are no recoveries in this state yet.')
          }
        />

        <StateMetaCard
          className="mortality"
          title={t('Case Fatality Ratio')}
          statistic={`${formatNumber(deathPercent, '%')}`}
          formula={
            <>
              {'100 x '}
              <Fraction
                numerator={t('Total deaths')}
                denominator={t('Total confirmed cases')}
              />
            </>
          }
          description={
            deathPercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  deathPercent,
                  'long'
                )} ${t('have unfortunately passed away from the virus.')}`
              : t(
                  'Fortunately, no one has passed away from the virus in this state.'
                )
          }
        />

        <StateMetaCard
          className="tpr"
          title={t('Test Positivity Ratio')}
          statistic={tprWeek > 0 ? `${formatNumber(tprWeek, '%')}` : '-'}
          formula={
            <>
              {'100 x '}
              <Fraction
                numerator={t('Confirmed cases last week')}
                denominator={t('Samples tested last week')}
              />
            </>
          }
          date={`${formatDate(prevWeekDate, 'dd MMM')} - ${formatDate(
            lastDate,
            'dd MMM'
          )}`}
          description={
            tprWeek > 0
              ? `${t('In the last one week,')} ${formatNumber(tprWeek, '%')}
              ${t('of samples tested came back positive.')}`
              : t('No tested sample came back positive in last one week.')
          }
        />

        <StateMetaCard
          className="tpl"
          title={t('Tests Per Lakh')}
          statistic={`${formatNumber(testPerLakh)}`}
          formula={
            <>
              {`${1e5} x `}
              <Fraction
                numerator={t('Total samples tested')}
                denominator={t('Total population')}
              />
            </>
          }
          date={
            testPerLakh && data[stateCode]?.meta?.tested?.date
              ? `${t('As of')} ${formatLastUpdated(
                  data[stateCode].meta.tested.date
                )} ${t('ago')}`
              : ''
          }
          description={
            testPerLakh > 0
              ? `${t('For every lakh people in')} ${STATE_NAMES[stateCode]},
                ~${formatNumber(testPerLakh, 'long')} ${t(
                  'samples were tested.'
                )}`
              : t('No tests have been conducted in this state yet.')
          }
        />
      </div>
    </>
  );
}

const isEqual = (prevProps, currProps) => {
  if (currProps.timeseries && !prevProps.timeseries) {
    return false;
  } else if (prevProps.stateCode !== currProps.stateCode) {
    return false;
  }
  return true;
};

export default memo(StateMeta, isEqual);
