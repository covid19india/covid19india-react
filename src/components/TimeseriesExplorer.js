import TimeseriesLoader from './loaders/Timeseries';

import {
  TIMESERIES_CHART_TYPES,
  TIMESERIES_OPTIONS,
  STATE_NAMES,
} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {getIndiaYesterdayISO, parseIndiaDate} from '../utils/commonFunctions';

import {PinIcon, IssueOpenedIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import {formatISO, sub} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useMemo, useRef, useState, lazy, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocalStorage} from 'react-use';

const Timeseries = lazy(() => import('./Timeseries'));

function TimeseriesExplorer({
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

  return (
    <div
      className={classnames('TimeseriesExplorer fadeInUp', {
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
          onClick={
            setAnchor &&
            setAnchor.bind(this, anchor === 'timeseries' ? null : 'timeseries')
          }
        >
          <PinIcon />
        </div>

        <h1>{t('Spread Trends')}</h1>
        <div className="tabs">
          {Object.entries(TIMESERIES_CHART_TYPES).map(
            ([ctype, value], index) => (
              <div
                className={`tab ${chartType === ctype ? 'focused' : ''}`}
                key={ctype}
                onClick={setChartType.bind(this, ctype)}
              >
                <h4>{t(value)}</h4>
              </div>
            )
          )}
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
              onChange={setIsUniform.bind(this, !isUniform)}
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
              onChange={setIsLog.bind(this, !isLog)}
            />
          </div>
        </div>
      </div>

      <div className="region-highlighted">
        {STATE_NAMES[regionHighlighted.stateCode]}
      </div>

      {isVisible && (
        <Suspense fallback={<TimeseriesLoader />}>
          <Timeseries
            stateCode={regionHighlighted.stateCode}
            {...{timeseries, dates, chartType, isUniform, isLog}}
          />
        </Suspense>
      )}

      {!isVisible && <div style={{height: '50rem'}} />}

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

export default React.memo(TimeseriesExplorer, isEqual);
