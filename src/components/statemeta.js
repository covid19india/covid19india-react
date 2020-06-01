import StateMetaCard from './statemetacard';

import {STATE_NAMES} from '../constants';
import {
  formatNumber,
  formatLastUpdated,
  getStatistic,
  getIndiaDate,
} from '../utils/commonfunctions';

import {format, sub} from 'date-fns';
import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

function StateMeta({stateCode, data, timeseries, population}) {
  const confirmed = getStatistic(data, 'total', 'confirmed');
  const active = getStatistic(data, 'total', 'active');
  const deceased = getStatistic(data, 'total', 'deceased');
  const recovered = getStatistic(data, 'total', 'recovered');
  const tested = getStatistic(data, 'total', 'tested');

  const indiaDate = format(getIndiaDate(), 'yyyy-MM-dd');
  const prevWeekDate = format(sub(getIndiaDate(), {weeks: 1}), 'yyyy-MM-dd');

  const prevWeekConfirmed = getStatistic(
    timeseries[prevWeekDate],
    'total',
    'confirmed'
  );

  const confirmedPerMillion = (confirmed / population) * 1000000;
  const testPerMillion = (tested / population) * 1000000;
  const totalConfirmedPerMillion = (confirmed / 1332900000) * 1000000;

  const recoveryPercent = (recovered / confirmed) * 100;
  const activePercent = (active / confirmed) * 100;
  const deathPercent = (deceased / confirmed) * 100;

  const growthRate =
    ((confirmed - prevWeekConfirmed) / prevWeekConfirmed) * 100;

  return (
    <React.Fragment>
      <div className="StateMeta population">
        <ReactTooltip
          place="top"
          type="dark"
          effect="solid"
          multiline={true}
          scrollHide={true}
          globalEventOff="click"
          id="stateMeta"
        />
        <div className="meta-item population fadeInUp">
          <h3>Population</h3>
          <h1>{formatNumber(population)}</h1>
        </div>
        <div className="alert">
          <Icon.Compass />
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
          statistic={confirmedPerMillion.toFixed(2)}
          total={totalConfirmedPerMillion.toFixed(2)}
          formula={'(confirmed / state population) * 1 Million'}
          description={`
            ${Math.round(
              confirmedPerMillion
            )} out of every 1 million people in ${
            STATE_NAMES[stateCode]
          } have tested positive for the virus.
            `}
        />

        <StateMetaCard
          className="active"
          title={'Active'}
          statistic={`${activePercent.toFixed(2)}%`}
          formula={'(active / confirmed) * 100'}
          description={`For every 100 confirmed cases, ${activePercent.toFixed(
            0
          )} are currently infected.`}
        />

        <StateMetaCard
          className="recovery"
          title={'Recovery Rate'}
          statistic={`${recoveryPercent.toFixed(2)}%`}
          formula={'(recovered / confirmed) * 100'}
          description={`For every 100 confirmed cases,
            ${Math.round(
              recoveryPercent.toFixed(0)
            )} have recovered from the virus.`}
        />

        <StateMetaCard
          className="mortality"
          title={'Mortality Rate'}
          statistic={`${deathPercent.toFixed(2)}%`}
          formula={'(deceased / confirmed) * 100'}
          description={`For every 100 confirmed cases,
            ${Math.round(
              deathPercent.toFixed(0)
            )} have unfortunately passed away from the virus.`}
        />

        <StateMetaCard
          className="gr"
          title={'Avg. Growth Rate'}
          statistic={growthRate > 0 ? `${Math.round(growthRate / 7)}%` : '-'}
          formula={
            '(((previousDayData - sevenDayBeforeData) / sevenDayBeforeData) * 100)/7'
          }
          date={`${format(new Date(prevWeekDate), 'dd MMM')} - ${format(
            new Date(indiaDate),
            'dd MMM'
          )}`}
          description={`In the last one week, the number of new infections has grown by an average of ${Math.round(
            growthRate / 7
          )}% every day.`}
        />

        <StateMetaCard
          className="tpm"
          title={'Tests Per Million'}
          statistic={`≈ ${Math.round(testPerMillion)}`}
          formula={
            '(total tests in state / total population of state) * 1 Million'
          }
          date={`As of ${formatLastUpdated(data.meta.tested.last_updated)} ago`}
          description={`For every 1 million people in ${STATE_NAMES[stateCode]},
            ${Math.round(testPerMillion)} people were tested.`}
        />
      </div>
    </React.Fragment>
  );
}

export default StateMeta;
