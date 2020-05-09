import StateMetaCard from './statemetacard';

import {formatNumber} from '../utils/commonfunctions';

import {format, parse} from 'date-fns';
import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

function StateMeta({
  stateData,
  lastTestObject,
  population,
  lastSevenDaysData,
  totalData,
}) {
  const confirmed = stateData.confirmed;
  const active = stateData.active;
  const deaths = stateData.deaths;
  const recovered = confirmed - active - deaths;
  const sevenDayBeforeData = lastSevenDaysData[0].totalconfirmed;
  const sevenDayBeforeDate = format(lastSevenDaysData[0].date, 'dd MMM');
  const previousDayData = lastSevenDaysData[6].totalconfirmed;
  const previousDayDate = format(lastSevenDaysData[6].date, 'dd MMM');
  var confirmedPerMillion = (confirmed / population) * 1000000;
  var recoveryPercent = (recovered / confirmed) * 100;
  var activePercent = (active / confirmed) * 100;
  var deathPercent = (deaths / confirmed) * 100;
  var testPerMillion = (lastTestObject?.totaltested / population) * 1000000;
  var growthRate =
    ((previousDayData - sevenDayBeforeData) / sevenDayBeforeData) * 100;
  var totalConfirmedPerMillion =
    (totalData[0].confirmed / 1332900000) * 1000000;
  // const doublingRate =
  // growthRate > 0 ? (70 / Math.round(growthRate)).toFixed(2) : 0;

  const updatedDate = !isNaN(
    parse(lastTestObject?.updatedon, 'dd/MM/yyyy', new Date())
  )
    ? `As of ${format(
        parse(lastTestObject?.updatedon, 'dd/MM/yyyy', new Date()),
        'dd MMM'
      )}`
    : '';
  totalConfirmedPerMillion = ((isNaN(totalConfirmedPerMillion)) || (totalConfirmedPerMillion === Infinity)) ? '-' : totalConfirmedPerMillion.toFixed(2);
  confirmedPerMillion = ((isNaN(confirmedPerMillion)) || (confirmedPerMillion === Infinity)) ? '-' : confirmedPerMillion.toFixed(2);
  recoveryPercent = ((isNaN(recoveryPercent)) || (recoveryPercent === Infinity)) ? '-' : recoveryPercent.toFixed(2);
  activePercent = ((isNaN(activePercent)) || (activePercent === Infinity)) ? '-' : activePercent.toFixed(2);
  deathPercent = ((isNaN(deathPercent)) || (deathPercent === Infinity)) ? '-' : deathPercent.toFixed(2);
  testPerMillion = ((isNaN(testPerMillion)) || (testPerMillion === Infinity)) ? '-' : testPerMillion.toFixed(2);
  growthRate = ((isNaN(growthRate)) || (growthRate === Infinity)) ? '-' : (growthRate/7).toFixed(2);

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
          statistic={confirmedPerMillion}
          total={totalConfirmedPerMillion}
          formula={'(confirmed / state population) * 1 Million'}
          description={`
            ${confirmedPerMillion} out of every 1 million people in ${
            stateData.state
          } have tested positive for the virus.
            `}
        />

        <StateMetaCard
          className="active"
          title={'Active'}
          statistic={`${activePercent}%`}
          formula={'(active / confirmed) * 100'}
          description={`For every 100 confirmed cases, ${activePercent} are currently infected.`}
        />

        <StateMetaCard
          className="recovery"
          title={'Recovery Rate'}
          statistic={`${recoveryPercent}%`}
          formula={'(recovered / confirmed) * 100'}
          description={`For every 100 confirmed cases, 
            ${recoveryPercent} have recovered from the virus.`}
        />

        <StateMetaCard
          className="mortality"
          title={'Mortality Rate'}
          statistic={`${deathPercent}%`}
          formula={'(deceased / confirmed) * 100'}
          description={`For every 100 confirmed cases, 
            ${deathPercent} have unfortunately passed away from the virus.`}
        />

        <StateMetaCard
          className="gr"
          title={'Avg. Growth Rate'}
          statistic={`${growthRate}%`}
          formula={
            '(((previousDayData - sevenDayBeforeData) / sevenDayBeforeData) * 100)/7'
          }
          date={`${sevenDayBeforeDate} - ${previousDayDate}`}
          description={`In the last one week, the number of new infections has grown by an average of ${growthRate}% every day.`}
        />

        <StateMetaCard
          className="tpm"
          title={'Tests Per Million'}
          statistic={`≈ ${testPerMillion}`}
          formula={
            '(total tests in state / total population of state) * 1 Million'
          }
          date={updatedDate}
          description={`For every 1 million people in ${stateData.state},
            ${testPerMillion} people were tested.`}
        />

        {/* <div className="meta-item ptr fadeInUp">
          <div className="meta-item-top">
            <h3>Positive Test Rate</h3>
            <span
              data-tip={
                'TPM = (total tests in state / total population of state) * 1 Million'
              }
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>
            {lastTestObject?.testpositivityrate
              ? lastTestObject.testpositivityrate
              : 'N/A'}
          </h1>
          {updatedDate}
          <p>
            {lastTestObject?.testpositivityrate
              ? `Out the of total tests conducted till date month, ${lastTestObject.testpositivityrate}% were positive for the virus`
              : 'N/A'}
          </p>
        </div>*/}

        {/*
          <div className="meta-item dbr fadeInUp">
            <div className="meta-item-top">
              <h3>Doubling Rate</h3>
              <Icon.Info />
            </div>
            <h1>
              {doublingRate > 0 ? Math.round(doublingRate * 7) + ' Days' : '-'}
            </h1>
            <h6 style={{margin: '0'}}>
              {sevenDayBeforeDate} - {previousDayDate}
            </h6>
          </div>
        )*/}
      </div>
    </React.Fragment>
  );
}

export default StateMeta;
