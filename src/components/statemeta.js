import {formatNumber} from '../utils/commonfunctions';

import {format, parse} from 'date-fns';
import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

function StateMeta({stateData, lastTestObject, population, lastSevenDaysData}) {
  const confirmed = stateData.confirmed;
  const active = stateData.active;
  const deaths = stateData.deaths;
  const recovered = confirmed - active - deaths;
  const sevenDayBeforeData = lastSevenDaysData[0].totalconfirmed;
  const sevenDayBeforeDate = format(lastSevenDaysData[0].date, 'dd MMM');
  const previousDayData = lastSevenDaysData[6].totalconfirmed;
  const previousDayDate = format(lastSevenDaysData[6].date, 'dd MMM');

  const confirmedPerMillion = (confirmed / population) * 1000000;
  const recoveryPercent = (recovered / confirmed) * 100;
  const activePercent = (active / confirmed) * 100;
  const deathPercent = (deaths / confirmed) * 100;
  const testPerMillion = (lastTestObject?.totaltested / population) * 1000000;
  const growthRate =
    ((previousDayData - sevenDayBeforeData) / sevenDayBeforeData) * 100;
  // const doublingRate =
  // growthRate > 0 ? (70 / Math.round(growthRate)).toFixed(2) : 0;

  const updatedDate = (
    <h6 style={{margin: '0'}}>
      {!isNaN(parse(lastTestObject?.updatedon, 'dd/MM/yyyy', new Date()))
        ? `As of ${format(
            parse(lastTestObject?.updatedon, 'dd/MM/yyyy', new Date()),
            'dd MMM'
          )}`
        : ''}
    </h6>
  );

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
        <div
          className="meta-item population fadeInUp"
          style={{color: '#37474F'}}
        >
          <h3>Population</h3>
          <h1>{formatNumber(population)}</h1>
        </div>
      </div>

      <div className="StateMeta">
        <div className="meta-item confirmed fadeInUp">
          <div className="meta-item-top">
            <h3>Confirmed Per Million</h3>
            <span
              data-tip={'WASSUP'}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>{confirmedPerMillion.toFixed(4)}</h1>
          <p>
            {`
            ${Math.round(
              confirmedPerMillion
            )} out of every 1 million people in ${
              stateData.state
            } have tested positive for the virus.
            `}
          </p>
        </div>

        <div className="meta-item active fadeInUp">
          <div className="meta-item-top">
            <h3>Active</h3>
            <span
              data-tip={'MAH'}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>{activePercent.toFixed(2)}%</h1>
          <p>{`For every 100 confirmed cases, ${activePercent.toFixed(
            0
          )} are still being medically treated.`}</p>
        </div>

        <div className="meta-item recovery fadeInUp">
          <div className="meta-item-top">
            <h3>Recovery Rate</h3>
            <span
              data-tip={'HOMIE'}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>{recoveryPercent.toFixed(2)}%</h1>
          <p>
            {`For every 100 confirmed cases, 
            ${Math.round(
              recoveryPercent.toFixed(0)
            )} have recovered from the virus.`}
          </p>
        </div>

        <div className="meta-item mortality fadeInUp">
          <div className="meta-item-top">
            <h3>Mortality Rate</h3>
            <span
              data-tip={'WASSUP'}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>{deathPercent.toFixed(2)}%</h1>
          <p>
            {`For every 100 confirmed cases, 
            ${Math.round(
              deathPercent.toFixed(0)
            )} have unfortunately passed away from the virus.`}
          </p>
        </div>

        <div className="meta-item gr fadeInUp">
          <div className="meta-item-top">
            <h3>Avg. Growth Rate</h3>
            <span
              data-tip={'WASSUP'}
              data-event="touchstart mouseover"
              data-event-off="mouseleave"
              data-for="stateMeta"
            >
              <Icon.Info />
            </span>
          </div>
          <h1>{growthRate > 0 ? `${Math.round(growthRate / 7)}%` : '-'}</h1>
          <h6 style={{margin: '0'}}>
            {sevenDayBeforeDate} - {previousDayDate}
          </h6>
          <p>
            {`In the last one week, the number of new infections has grown by an average of ${Math.round(
              growthRate / 7
            )}% every day.`}
          </p>
        </div>

        <div className="meta-item tpm fadeInUp">
          <div className="meta-item-top">
            <h3>Tests Per Million</h3>
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
            <span>&#x2248;</span> {Math.round(testPerMillion)}
          </h1>
          {updatedDate}
          <p>
            {`For every 1 million people in ${stateData.state},
            ${Math.round(testPerMillion)} people were tested.`}
          </p>
        </div>

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
