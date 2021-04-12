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

function StateMeta({stateCode, data, timeseries}) {
  const {t} = useTranslation();

  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaDateYesterdayISO()
  );
  const lastDate = pastDates[pastDates.length - 1];
  const lastConfirmed = getStatistic(
    timeseries?.[lastDate],
    'total',
    'confirmed'
  );
  const prevWeekConfirmed =
    lastConfirmed - getStatistic(timeseries?.[lastDate], 'delta7', 'confirmed');

  const prevWeekDate = formatISO(subDays(parseIndiaDate(lastDate), 7));

  const confirmedPerMillion = getStatistic(
    data[stateCode],
    'total',
    'confirmed',
    {perMillion: true}
  );
  const testPerMillion = getStatistic(data[stateCode], 'total', 'tested', {
    perMillion: true,
  });
  const totalConfirmedPerMillion = getStatistic(
    data['TT'],
    'total',
    'confirmed',
    {perMillion: true}
  );

  const activePercent = getStatistic(data[stateCode], 'total', 'activeRatio');
  const recoveryPercent = getStatistic(
    data[stateCode],
    'total',
    'recoveryRatio'
  );
  const deathPercent = getStatistic(data[stateCode], 'total', 'cfr');

  const growthRate =
    (Math.pow(lastConfirmed / prevWeekConfirmed, 1 / 7) - 1) * 100;

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
          title={'Confirmed Per Million'}
          statistic={formatNumber(confirmedPerMillion)}
          total={formatNumber(totalConfirmedPerMillion)}
          formula={'(confirmed / state population) * 1 Million'}
          description={`
            ~${formatNumber(Math.round(confirmedPerMillion))} ${t(
            'out of every 10 lakh people in'
          )} ${STATE_NAMES[stateCode]} ${t(
            'have tested positive for the virus.'
          )}
            `}
        />

        <StateMetaCard
          className="active"
          title={'Active Ratio'}
          statistic={`${formatNumber(activePercent, '%')}`}
          formula={'(active / confirmed) * 100'}
          description={
            activePercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  Math.round(activePercent)
                )} ${t('are currently infected.')}`
              : t('Currently, there are no active cases in this state.')
          }
        />

        <StateMetaCard
          className="recovery"
          title={'Recovery Ratio'}
          statistic={`${formatNumber(recoveryPercent, '%')}`}
          formula={'(recovered / confirmed) * 100'}
          description={
            recoveryPercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  Math.round(recoveryPercent)
                )} ${t('have recovered from the virus.')}`
              : t('Unfortunately, there are no recoveries in this state yet.')
          }
        />

        <StateMetaCard
          className="mortality"
          title={'Case Fatality Ratio'}
          statistic={`${formatNumber(deathPercent, '%')}`}
          formula={'(deceased / confirmed) * 100'}
          description={
            deathPercent > 0
              ? `${t('For every 100 confirmed cases')}, ~${formatNumber(
                  Math.round(deathPercent)
                )} ${t('have unfortunately passed away from the virus.')}`
              : t(
                  'Fortunately, no one has passed away from the virus in this state.'
                )
          }
        />

        <StateMetaCard
          className="gr"
          title={'Avg. Growth Rate'}
          statistic={growthRate > 0 ? `${formatNumber(growthRate, '%')}` : '-'}
          formula={
            '(((previousDayData - sevenDayBeforeData) / sevenDayBeforeData) * 100)/7'
          }
          date={`${formatDate(prevWeekDate, 'dd MMM')} - ${formatDate(
            lastDate,
            'dd MMM'
          )}`}
          description={
            growthRate > 0
              ? `${t(
                  'In the last one week, the number of new infections has grown by an average of'
                )} ${formatNumber(growthRate, '%')}
              ${t('every day.')}`
              : t(
                  'There has been no growth in the number of infections in last one week.'
                )
          }
        />

        <StateMetaCard
          className="tpm"
          title={'Tests Per Million'}
          statistic={`${formatNumber(testPerMillion)}`}
          formula={
            '(total tests in state / total population of state) * 1 Million'
          }
          date={
            testPerMillion
              ? `${t('As of')} ${formatLastUpdated(
                  data[stateCode]?.meta?.tested?.['last_updated']
                )} ${t('ago')}`
              : ''
          }
          description={
            testPerMillion > 0
              ? `${t('For every 10 lakh people in')} ${STATE_NAMES[stateCode]},
                ~${formatNumber(Math.round(testPerMillion))} ${t(
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
