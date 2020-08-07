import TimeseriesLoader from './loaders/Timeseries';

import {
  TIMESERIES_CHART_TYPES,
  TIMESERIES_LOOKBACKS,
  STATE_NAMES,
} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {getIndiaYesterdayISO, parseIndiaDate} from '../utils/commonFunctions';

import {IssueOpenedIcon, PinIcon, ReplyIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import {formatISO, sub} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {useCallback, useMemo, useRef, lazy, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocalStorage, useSessionStorage} from 'react-use';

const Timeseries = lazy(() => import('./Timeseries'));

function TimeseriesExplorer({
  stateCode,
  timeseries,
  date: timelineDate,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  expandTable,
}) {
  const {t} = useTranslation();
  const [lookback, setLookback] = useSessionStorage(
    'timeseriesLookback',
    TIMESERIES_LOOKBACKS.MONTH
  );
  const [chartType, setChartType] = useLocalStorage('chartType', 'total');
  const [isUniform, setIsUniform] = useLocalStorage('isUniform', true);
  const [isLog, setIsLog] = useLocalStorage('isLog', false);
  const explorerElement = useRef();
  const isVisible = useIsVisible(explorerElement, {once: true});

  const selectedRegion = useMemo(() => {
    if (timeseries?.[regionHighlighted.stateCode]?.districts) {
      return {
        stateCode: regionHighlighted.stateCode,
        districtName: regionHighlighted.districtName,
      };
    } else {
      return {
        stateCode: regionHighlighted.stateCode,
        districtName: null,
      };
    }
  }, [timeseries, regionHighlighted.stateCode, regionHighlighted.districtName]);

  const selectedTimeseries = useMemo(() => {
    if (selectedRegion.districtName) {
      return timeseries?.[selectedRegion.stateCode]?.districts?.[
        selectedRegion.districtName
      ]?.dates;
    } else {
      return timeseries?.[selectedRegion.stateCode]?.dates;
    }
  }, [timeseries, selectedRegion.stateCode, selectedRegion.districtName]);

  const regions = useMemo(() => {
    const states = Object.keys(timeseries || {})
      .filter((code) => code !== stateCode)
      .sort((code1, code2) =>
        STATE_NAMES[code1].localeCompare(STATE_NAMES[code2])
      )
      .map((code) => {
        return {
          stateCode: code,
          districtName: null,
        };
      });
    const districts = Object.keys(timeseries || {}).reduce((acc1, code) => {
      return [
        ...acc1,
        ...Object.keys(timeseries?.[code]?.districts || {}).reduce(
          (acc2, districtName) => {
            return [
              ...acc2,
              {
                stateCode: code,
                districtName: districtName,
              },
            ];
          },
          []
        ),
      ];
    }, []);

    return [
      {
        stateCode: stateCode,
        districtName: null,
      },
      ...states,
      ...districts,
    ];
  }, [timeseries, stateCode]);

  const dropdownRegions = useMemo(() => {
    if (
      regions.find(
        (region) =>
          region.stateCode === regionHighlighted.stateCode &&
          region.districtName === regionHighlighted.districtName
      )
    )
      return regions;
    return [
      ...regions,
      {
        stateCode: regionHighlighted.stateCode,
        districtName: regionHighlighted.districtName,
      },
    ];
  }, [regionHighlighted.stateCode, regionHighlighted.districtName, regions]);

  const dates = useMemo(() => {
    const cutOffDateUpper = timelineDate || getIndiaYesterdayISO();
    const pastDates = Object.keys(selectedTimeseries || {}).filter(
      (date) => date <= cutOffDateUpper
    );

    const lastDate = pastDates[pastDates.length - 1];
    if (lookback === TIMESERIES_LOOKBACKS.BEGINNING) {
      return pastDates;
    }

    let cutOffDateLower;
    if (lookback === TIMESERIES_LOOKBACKS.MONTH) {
      cutOffDateLower = formatISO(sub(parseIndiaDate(lastDate), {months: 1}), {
        representation: 'date',
      });
    } else if (lookback === TIMESERIES_LOOKBACKS.THREE_MONTHS) {
      cutOffDateLower = formatISO(sub(parseIndiaDate(lastDate), {months: 3}), {
        representation: 'date',
      });
    }
    return pastDates.filter((date) => date >= cutOffDateLower);
  }, [selectedTimeseries, timelineDate, lookback]);

  const handleChange = useCallback(
    ({target}) => {
      setRegionHighlighted(JSON.parse(target.value));
    },
    [setRegionHighlighted]
  );

  const resetDropdown = useCallback(() => {
    setRegionHighlighted({
      stateCode: stateCode,
      districtName: null,
    });
  }, [stateCode, setRegionHighlighted]);

  return (
    <div
      className={classnames(
        'TimeseriesExplorer fadeInUp',
        {
          stickied: anchor === 'timeseries',
        },
        {expanded: expandTable}
      )}
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

      {dropdownRegions && (
        <div className="state-selection">
          <div className="dropdown">
            <select
              value={JSON.stringify(selectedRegion)}
              onChange={handleChange}
            >
              {dropdownRegions
                .filter(
                  (region) =>
                    STATE_NAMES[region.stateCode] !== region.districtName
                )
                .map((region) => {
                  return (
                    <option
                      value={JSON.stringify(region)}
                      key={`${region.stateCode}-${region.districtName}`}
                    >
                      {region.districtName
                        ? t(region.districtName)
                        : t(STATE_NAMES[region.stateCode])}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="reset-icon" onClick={resetDropdown}>
            <ReplyIcon />
          </div>
        </div>
      )}

      {isVisible && (
        <Suspense fallback={<TimeseriesLoader />}>
          <Timeseries
            timeseries={selectedTimeseries}
            regionHighlighted={selectedRegion}
            {...{dates, chartType, isUniform, isLog}}
          />
        </Suspense>
      )}

      {!isVisible && <div style={{height: '50rem'}} />}

      <div className="pills">
        {Object.values(TIMESERIES_LOOKBACKS).map((option) => (
          <button
            key={option}
            type="button"
            className={classnames({selected: lookback === option})}
            onClick={() => setLookback(option)}
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
  if (currProps.forceRender) {
    return false;
  } else if (!currProps.timeseries && prevProps.timeseries) {
    return true;
  } else if (currProps.timeseries && !prevProps.timeseries) {
    return false;
  } else if (
    !equal(
      currProps.regionHighlighted.stateCode,
      prevProps.regionHighlighted.stateCode
    )
  ) {
    return false;
  } else if (
    !equal(
      currProps.regionHighlighted.districtName,
      prevProps.regionHighlighted.districtName
    )
  ) {
    return false;
  } else if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (!equal(currProps.anchor, prevProps.anchor)) {
    return false;
  } else if (!equal(currProps.expandTable, prevProps.expandTable)) {
    return false;
  }
  return true;
};

export default React.memo(TimeseriesExplorer, isEqual);
