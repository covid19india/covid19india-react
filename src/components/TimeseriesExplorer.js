import TimeseriesLoader from './loaders/Timeseries';

import {
  STATE_NAMES,
  TIMESERIES_CHART_TYPES,
  TIMESERIES_LOOKBACK_DAYS,
  TIMESERIES_STATISTICS,
} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {
  getIndiaDateYesterdayISO,
  parseIndiaDate,
  retry,
} from '../utils/commonFunctions';

import {PinIcon, ReplyIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {min} from 'd3-array';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocalStorage, useWindowSize} from 'react-use';

const Timeseries = lazy(() => retry(() => import('./Timeseries')));
const TimeseriesBrush = lazy(() => retry(() => import('./TimeseriesBrush')));

function TimeseriesExplorer({
  stateCode,
  timeseries,
  date: timelineDate,
  regionHighlighted,
  setRegionHighlighted,
  anchor,
  setAnchor,
  expandTable = false,
  hideVaccinated = false,
}) {
  const {t} = useTranslation();
  const [lookback, setLookback] = useLocalStorage('timeseriesLookbackDays', 90);
  const [chartType, setChartType] = useLocalStorage('chartType', 'total');
  const [isUniform, setIsUniform] = useLocalStorage('isUniform', false);
  const [isLog, setIsLog] = useLocalStorage('isLog', false);
  const [isMovingAverage, setIsMovingAverage] = useLocalStorage(
    'isMovingAverage',
    false
  );

  const stateCodeDateRange = Object.keys(timeseries?.[stateCode]?.dates || {});
  const beginningDate =
    stateCodeDateRange[0] || timelineDate || getIndiaDateYesterdayISO();
  const endDate = min([
    stateCodeDateRange[stateCodeDateRange.length - 1],
    timelineDate || getIndiaDateYesterdayISO(),
  ]);

  const [brushSelectionEnd, setBrushSelectionEnd] = useState(endDate);
  useEffect(() => {
    setBrushSelectionEnd(endDate);
  }, [endDate]);

  const brushSelectionStart =
    lookback !== null
      ? formatISO(subDays(parseIndiaDate(brushSelectionEnd), lookback), {
          representation: 'date',
        })
      : beginningDate;

  const explorerElement = useRef();
  const isVisible = useIsVisible(explorerElement, {once: true});
  const {width} = useWindowSize();

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

  const dates = useMemo(
    () =>
      Object.keys(selectedTimeseries || {}).filter((date) => date <= endDate),
    [selectedTimeseries, endDate]
  );

  const brushSelectionDates = useMemo(
    () =>
      dates.filter(
        (date) => brushSelectionStart <= date && date <= brushSelectionEnd
      ),
    [dates, brushSelectionStart, brushSelectionEnd]
  );

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

  const statistics = useMemo(
    () =>
      TIMESERIES_STATISTICS.filter(
        (statistic) =>
          (statistic !== 'vaccinated' || !hideVaccinated) &&
          (chartType === 'delta' || statistic !== 'tpr')
      ),
    [chartType, hideVaccinated]
  );

  return (
    <div
      className={classnames(
        'TimeseriesExplorer fadeInUp',
        {
          stickied: anchor === 'timeseries',
        },
        {expanded: expandTable}
      )}
      style={{
        display:
          anchor && anchor !== 'timeseries' && (!expandTable || width < 769)
            ? 'none'
            : '',
      }}
      ref={explorerElement}
    >
      <div className="timeseries-header">
        <div
          className={classnames('anchor', 'fadeInUp', {
            stickied: anchor === 'timeseries',
          })}
          style={{
            display: expandTable && width > 769 ? 'none' : '',
          }}
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

        <div className="timeseries-options">
          <div className="scale-modes">
            <label className="main">{`${t('Scale Modes')}:`}</label>
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
              className={`timeseries-mode ${
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

          <div
            className={`timeseries-mode ${
              chartType === 'total' ? 'disabled' : ''
            } moving-average`}
          >
            <label htmlFor="timeseries-moving-average">
              {t('7 day Moving Average')}
            </label>
            <input
              id="timeseries-moving-average"
              type="checkbox"
              checked={chartType === 'delta' && isMovingAverage}
              className="switch"
              disabled={chartType !== 'delta'}
              onChange={setIsMovingAverage.bind(this, !isMovingAverage)}
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
            dates={brushSelectionDates}
            {...{
              statistics,
              endDate,
              chartType,
              isUniform,
              isLog,
              isMovingAverage,
            }}
          />
          <TimeseriesBrush
            timeseries={selectedTimeseries}
            regionHighlighted={selectedRegion}
            currentBrushSelection={[brushSelectionStart, brushSelectionEnd]}
            animationIndex={statistics.length}
            {...{dates, endDate, lookback, setBrushSelectionEnd, setLookback}}
          />
        </Suspense>
      )}
      {!isVisible && <div style={{height: '50rem'}} />}
      <div
        className="pills fadeInUp"
        style={{animationDelay: `${(1 + statistics.length) * 250}ms`}}
      >
        {TIMESERIES_LOOKBACK_DAYS.map((numDays) => (
          <button
            key={numDays}
            type="button"
            className={classnames({
              selected: numDays === lookback,
            })}
            onClick={setLookback.bind(this, numDays)}
          >
            {numDays !== null ? `${numDays} ${t('days')}` : t('Beginning')}
          </button>
        ))}
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
  } else if (!equal(currProps.hideVaccinated, prevProps.hideVaccinated)) {
    return false;
  }
  return true;
};

export default memo(TimeseriesExplorer, isEqual);
