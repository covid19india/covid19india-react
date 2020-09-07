import StateMetaCard from './StateMetaCard';

import {STATE_NAMES} from '../constants';
import {
  formatDate,
  formatNumber,
  formatLastUpdated,
  getStatistic,
  getIndiaYesterdayISO,
  parseIndiaDate,
} from '../utils/commonFunctions';

import {differenceInDays} from 'date-fns';
import React from 'react';
import {Compass} from 'react-feather';

function StateMeta({stateCode, data, timeseries}) {
  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaYesterdayISO()
  );
  const lastDate = pastDates[pastDates.length - 1];
  const lastConfirmed = getStatistic(
    timeseries?.[lastDate],
    'total',
    'confirmed'
  );
  const prevWeekDate = pastDates
    .reverse()
    .find(
      (date) =>
        differenceInDays(parseIndiaDate(lastDate), parseIndiaDate(date)) >= 7
    );
  const prevWeekConfirmed = getStatistic(
    timeseries?.[prevWeekDate],
    'total',
    'confirmed'
  );
  const diffDays = differenceInDays(
    parseIndiaDate(lastDate),
    parseIndiaDate(prevWeekDate)
  );

  const confirmedPerMillion = getStatistic(
    data[stateCode],
    'total',
    'confirmed',
    true
  );
  const testPerMillion = getStatistic(data[stateCode], 'total', 'tested', true);
  const totalConfirmedPerMillion = getStatistic(
    data['TT'],
    'total',
    'confirmed',
    true
  );

  const activePercent = getStatistic(data[stateCode], 'total', 'activeRatio');
  const recoveryPercent = getStatistic(
    data[stateCode],
    'total',
    'recoveryRatio'
  );
  const deathPercent = getStatistic(data[stateCode], 'total', 'cfr');

  const growthRate =
    (Math.pow(lastConfirmed / prevWeekConfirmed, 1 / diffDays) - 1) * 100;

  return (
    <React.Fragment>
      <div className="StateMeta population">
        <div className="meta-item population">
          <h3>Population</h3>
          <h1>{formatNumber(data[stateCode]?.meta?.population)}</h1>
        </div>
        <div className="alert">
          <Compass />
          <div className="alert-right">
            Based on 2019 population projection by NCP{' '}
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
            ~${formatNumber(
              Math.round(confirmedPerMillion)
            )} out of every 10 lakh people in ${
            STATE_NAMES[stateCode]
          } have tested positive for the virus.
            `}
        />

        <StateMetaCard
          className="active"
          title={'Active Ratio'}
          statistic={`${formatNumber(activePercent, '%')}`}
          formula={'(active / confirmed) * 100'}
          description={
            activePercent > 0
              ? `For every 100 confirmed cases, ~${formatNumber(
                  Math.round(activePercent)
                )} are currently infected.`
              : 'Currently, there are no active cases in this state.'
          }
        />

        <StateMetaCard
          className="recovery"
          title={'Recovery Ratio'}
          statistic={`${formatNumber(recoveryPercent, '%')}`}
          formula={'(recovered / confirmed) * 100'}
          description={
            recoveryPercent > 0
              ? `For every 100 confirmed cases, ~${formatNumber(
                  Math.round(recoveryPercent)
                )} have recovered from the virus.`
              : 'Unfortunately, there are no recoveries in this state yet.'
          }
        />

        <StateMetaCard
          className="mortality"
          title={'Case Fatality Ratio'}
          statistic={`${formatNumber(deathPercent, '%')}`}
          formula={'(deceased / confirmed) * 100'}
          description={
            deathPercent > 0
              ? `For every 100 confirmed cases, ~${formatNumber(
                  Math.round(deathPercent)
                )} have unfortunately passed away from the virus.`
              : 'Fortunately, no one has passed away from the virus in this state.'
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
              ? `In the last one week, the number of new infections has
              grown by an average of ${formatNumber(growthRate, '%')}
              every day.`
              : 'There has been no growth in the number of infections in last one week.'
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
              ? `As of ${formatLastUpdated(
                  data[stateCode]?.meta?.tested?.['last_updated']
                )} ago`
              : ''
          }
          description={
            testPerMillion > 0
              ? `For every 10 lakh people in ${STATE_NAMES[stateCode]},
                ~${formatNumber(
                  Math.round(testPerMillion)
                )} samples were tested.`
              : 'No tests have been conducted in this state yet.'
          }
        />
      </div>
    </React.Fragment>
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

export default React.memo(StateMeta, isEqual);
