import TimeseriesLoader from './loaders/timeseries';

import {
  STATE_NAMES,
  TIMESERIES_CHART_TYPES,
  TIMESERIES_OPTIONS,
} from '../constants';
import {getIndiaYesterdayISO, parseIndiaDate} from '../utils/commonfunctions';

import {PinIcon, IssueOpenedIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import {formatISO, sub} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useMemo, useRef, useState, lazy, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {useIsVisible} from 'react-is-visible';
import {useLocalStorage} from 'react-use';

const TimeSeries = lazy(() =>
  import('./timeseries' /* webpackChunkName: "TimeSeries" */)
);

function TimeSeriesExplorer({
  timeseries,
  date: timelineDate,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  stateCodes,
}) {
  const {t} = useTranslation();
  const [timeseriesOption, setTimeseriesOption] = useState(
    TIMESERIES_OPTIONS.MONTH
  );
  const [chartType, setChartType] = useLocalStorage('chartType', 'total');
  const [isUniform, setIsUniform] = useLocalStorage('isUniform', true);
  const [isLog, setIsLog] = useLocalStorage('isLog', false);
  const explorerElement = useRef();
  const isVisible = useIsVisible(explorerElement, {once: true});

  const dates = useMemo(() => {
    const today = timelineDate || getIndiaYesterdayISO();
    const pastDates = Object.keys(timeseries || {}).filter(
      (date) => date <= today
    );

    if (timeseriesOption === TIMESERIES_OPTIONS.TWO_WEEKS) {
      const cutOffDate = formatISO(sub(parseIndiaDate(today), {weeks: 2}), {
        representation: 'date',
      });
      return pastDates.filter((date) => date >= cutOffDate);
    } else if (timeseriesOption === TIMESERIES_OPTIONS.MONTH) {
      const cutOffDate = formatISO(sub(parseIndiaDate(today), {months: 1}), {
        representation: 'date',
      });
      return pastDates.filter((date) => date >= cutOffDate);
    }
    return pastDates;
  }, [timeseries, timelineDate, timeseriesOption]);

  const handleChange = ({target}) => {
    setRegionHighlighted({
      stateCode: target.value,
      districtName: null,
    });
  };

  return (
    <div
      className={classnames('TimeSeriesExplorer', {
        stickied: anchor === 'timeseries',
      })}
      style={{display: anchor === 'mapexplorer' ? 'none' : ''}}
      ref={explorerElement}
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
          {Object.entries(TIMESERIES_CHART_TYPES).map(([ctype, value]) => (
            <div
              className={`tab ${chartType === ctype ? 'focused' : ''}`}
              key={ctype}
              onClick={() => {
                setChartType(ctype);
              }}
            >
              <h4>{t(value)}</h4>
            </div>
          ))}
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
              chartType !== 'total' ? 'disabled' : ''
            }`}
          >
            <label htmlFor="timeseries-logmode">{t('Logarithmic')}</label>
            <input
              id="timeseries-logmode"
              type="checkbox"
              checked={chartType === 'total' && isLog}
              className="switch"
              disabled={chartType !== 'total'}
              onChange={() => {
                setIsLog(!isLog);
              }}
            />
          </div>
        </div>

        {stateCodes && (
          <div className="trends-state-name">
            <select value={regionHighlighted.stateCode} onChange={handleChange}>
              {stateCodes.map((stateCode) => {
                return (
                  <option value={stateCode} key={stateCode}>
                    {stateCode === 'TT'
                      ? t('All States')
                      : t(STATE_NAMES[stateCode])}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {isVisible && (
        <Suspense fallback={<TimeseriesLoader />}>
          <TimeSeries
            stateCode={regionHighlighted.stateCode}
            {...{timeseries, dates, chartType, isUniform, isLog}}
          />
        </Suspense>
      )}

      <div className="pills">
        {Object.values(TIMESERIES_OPTIONS).map((option) => (
          <button
            key={option}
            type="button"
            className={classnames({selected: timeseriesOption === option})}
            onClick={() => setTimeseriesOption(option)}
          >
            {t(option)}
          </button>
        ))}
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
  if (
    !equal(
      currProps.regionHighlighted.stateCode,
      prevProps.regionHighlighted.stateCode
    )
  ) {
    return false;
  }
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  }
  if (!equal(currProps.anchor, prevProps.anchor)) {
    return false;
  }
  return true;
};

export default React.memo(TimeSeriesExplorer, isEqual);
