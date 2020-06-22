import TimeseriesLoader from './loaders/Timeseries';

import {TIMESERIES_CHART_TYPES, TIMESERIES_OPTIONS} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {getIndiaYesterdayISO, parseIndiaDate} from '../utils/commonFunctions';

import {PinIcon, IssueOpenedIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import {formatISO, sub} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useMemo, useRef, useState, lazy, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, config, useTrail} from 'react-spring';
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
    TIMESERIES_OPTIONS.TWO_WEEKS
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

  const trail = useTrail(5, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {
      transform: 'translate3d(0, 0px, 0)',
      opacity: 1,
    },
    delay: 250,
    config: config.gentle,
  });

  return (
    <div
      className={classnames('TimeseriesExplorer', {
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

        <animated.h1 style={trail[0]}>{t('Spread Trends')}</animated.h1>
        <div className="tabs">
          {Object.entries(TIMESERIES_CHART_TYPES).map(
            ([ctype, value], index) => (
              <animated.div
                className={`tab ${chartType === ctype ? 'focused' : ''}`}
                key={ctype}
                onClick={() => {
                  setChartType(ctype);
                }}
                style={trail[index]}
              >
                <h4>{t(value)}</h4>
              </animated.div>
            )
          )}
        </div>

        <div className="scale-modes">
          <animated.label className="main" style={trail[2]}>
            {t('Scale Modes')}
          </animated.label>
          <animated.div className="timeseries-mode" style={trail[3]}>
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
          </animated.div>
          <animated.div
            className={`timeseries-logmode ${
              chartType !== 'total' ? 'disabled' : ''
            }`}
            style={trail[4]}
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
          </animated.div>
        </div>
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
