import TimeSeries from './timeseries';

import React from 'react';
import * as Icon from 'react-feather';
import {useLocalStorage} from 'react-use';

function TimeSeriesExplorer({
  timeseries,
  activeStateCode,
  onHighlightState,
  states,
  anchor,
  setAnchor,
}) {
  const [graphOption, setGraphOption] = useLocalStorage(
    'timeseriesGraphOption',
    1
  );

  const [timeseriesMode, setTimeseriesMode] = useLocalStorage(
    'timeseriesMode',
    true
  );
  const [timeseriesLogMode, setTimeseriesLogMode] = useLocalStorage(
    'timeseriesLogMode',
    false
  );

  return (
    <div
      className={`TimeSeriesExplorer ${
        anchor === 'timeseries' ? 'stickied' : ''
      }`}
      style={{display: anchor === 'mapexplorer' ? 'none' : ''}}
    >
      <div
        className="timeseries-header fadeInUp"
        style={{animationDelay: '2.5s'}}
      >
        {window.innerWidth > 769 && (
          <div
            className={`anchor ${anchor === 'timeseries' ? 'stickied' : ''}`}
            onClick={() => {
              setAnchor(anchor === 'timeseries' ? null : 'timeseries');
            }}
          >
            <Icon.Anchor />
          </div>
        )}

        <h1>Spread Trends</h1>
        <div className="tabs">
          <div
            className={`tab ${graphOption === 1 ? 'focused' : ''}`}
            onClick={() => {
              setGraphOption(1);
            }}
          >
            <h4>Cumulative</h4>
          </div>
          <div
            className={`tab ${graphOption === 2 ? 'focused' : ''}`}
            onClick={() => {
              setGraphOption(2);
            }}
          >
            <h4>Daily</h4>
          </div>
        </div>

        <div className="scale-modes">
          <label className="main">Scale Modes</label>
          <div className="timeseries-mode">
            <label htmlFor="timeseries-mode">Uniform</label>
            <input
              id="timeseries-mode"
              type="checkbox"
              checked={timeseriesMode}
              className="switch"
              aria-label="Checked by default to scale uniformly."
              onChange={(event) => {
                setTimeseriesMode(!timeseriesMode);
              }}
            />
          </div>
          <div
            className={`timeseries-logmode ${
              graphOption !== 1 ? 'disabled' : ''
            }`}
          >
            <label htmlFor="timeseries-logmode">Logarithmic</label>
            <input
              id="timeseries-logmode"
              type="checkbox"
              checked={graphOption === 1 && timeseriesLogMode}
              className="switch"
              disabled={graphOption !== 1}
              onChange={(event) => {
                setTimeseriesLogMode(!timeseriesLogMode);
              }}
            />
          </div>
        </div>

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
                  {s.statecode === 'TT' ? 'All States' : s.state}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <TimeSeries
        timeseries={timeseries[activeStateCode]}
        stateCode={activeStateCode}
        type={graphOption}
        mode={timeseriesMode}
        logMode={timeseriesLogMode}
      />
    </div>
  );
}

export default React.memo(TimeSeriesExplorer);
