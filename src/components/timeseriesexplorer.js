import TimeSeries from './timeseries';

import {PinIcon, IssueOpenedIcon} from '@primer/octicons-v2-react';
import 'intersection-observer';
import Observer from '@researchgate/react-intersection-observer';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {createBreakpoint, useLocalStorage} from 'react-use';

const useBreakpoint = createBreakpoint({XL: 1280, L: 768, S: 350});

function TimeSeriesExplorer({
  timeseries,
  activeStateCode,
  onHighlightState,
  regionHighlighted,
  setRegionHighlighted,
  states,
  anchor,
  setAnchor,
}) {
  const {t} = useTranslation();
  // const breakpoint = useBreakpoint();
  const [lastDaysCount, setLastDaysCount] = useState(30);

  const [chartType, setChartType] = useLocalStorage('chartType', 'cumulative');

  const [isTimeseriesIntersecting, setIsTimeseriesIntersecting] = useState(
    false
  );

  const [isUniform, setIsUniform] = useLocalStorage('isUniform', true);
  const [isLog, setIsLog] = useLocalStorage('isLog', false);

  const options = {
    rootMargin: '0px 0px 0px 0px',
  };

  return (
    <div
      className={classnames('TimeSeriesExplorer', {
        stickied: anchor === 'timeseries',
      })}
      style={{display: anchor === 'mapexplorer' ? 'none' : ''}}
    >
      <div className="timeseries-header">
        <div
          className={classnames('anchor', {
            stickied: anchor === 'timeseries',
          })}
          onClick={() => {
            setAnchor(anchor === 'timeseries' ? null : 'timeseries');
          }}
        >
          <PinIcon />
        </div>

        <h1>{t('Spread Trends')}</h1>
        <div className="tabs">
          <div
            className={`tab ${chartType === 'cumulative' ? 'focused' : ''}`}
            onClick={() => {
              setChartType('cumulative');
            }}
          >
            <h4>{t('Cumulative')}</h4>
          </div>
          <div
            className={`tab ${chartType === 'discrete' ? 'focused' : ''}`}
            onClick={() => {
              setChartType('discrete');
              setIsLog(false);
            }}
          >
            <h4>{t('Daily')}</h4>
          </div>
        </div>

        <div className="scale-modes">
          <label className="main">{t('Scale Modes')}</label>
          <div className="timeseries-mode">
            <label htmlFor="timeseries-mode">{t('Uniform')}</label>
            <input
              id="timeseries-mode"
              type="checkbox"
              className="switch"
              checked={isUniform}
              aria-label={t('Checked by default to scale uniformly.')}
              onChange={() => {
                setIsUniform(!isUniform);
              }}
            />
          </div>
          <div
            className={`timeseries-logmode ${
              chartType !== 'cumulative' ? 'disabled' : ''
            }`}
          >
            <label htmlFor="timeseries-logmode">{t('Logarithmic')}</label>
            <input
              id="timeseries-logmode"
              type="checkbox"
              checked={chartType === 'cumulative' && isLog}
              className="switch"
              disabled={chartType !== 'cumulative'}
              onChange={() => {
                setIsLog(!isLog);
              }}
            />
          </div>
        </div>

        {states && (
          <div className="trends-state-name">
            <select
              value={activeStateCode}
              onChange={({target}) => {
                const selectedState = target.selectedOptions[0].getAttribute(
                  'statedata'
                );
                onHighlightState(JSON.parse(selectedState));
              }}
            >
              {states.map((s) => {
                return (
                  <option
                    value={s.statecode}
                    key={s.statecode}
                    statedata={JSON.stringify(s)}
                  >
                    {s.statecode === 'TT' ? t('All States') : t(s.state)}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <TimeSeries
        {...{timeseries, chartType, isUniform, isLog}}
        dates={Object.keys(timeseries).slice(-lastDaysCount)}
        stateCode={activeStateCode}
      />

      <div className="pills">
        <button
          type="button"
          onClick={() => setLastDaysCount(Infinity)}
          className={lastDaysCount === Infinity ? 'selected' : ''}
        >
          {t('Beginning')}
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(30)}
          className={lastDaysCount === 30 ? 'selected' : ''}
          aria-label="1 month"
        >
          {`1 ${t('Month')}`}
        </button>
        <button
          type="button"
          onClick={() => setLastDaysCount(14)}
          className={lastDaysCount === 14 ? 'selected' : ''}
          aria-label="14 days"
        >
          {`2 ${t('Weeks')}`}
        </button>
      </div>

      <div className="alert">
        <IssueOpenedIcon size={24} />
        <div className="alert-right">
          {t('Tested chart is independent of uniform scaling')}
        </div>
      </div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.activeStateCode, prevProps.activeStateCode)) {
    return false;
  }
  if (!equal(currProps.anchor, prevProps.anchor)) {
    return false;
  }
  return true;
};

export default React.memo(TimeSeriesExplorer, isEqual);
