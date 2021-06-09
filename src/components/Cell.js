import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import {formatNumber} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {memo, useCallback} from 'react';
import {animated, useSpring} from 'react-spring';

const Cell = ({
  statistic,
  data,
  lastUpdatedDate,
  getTableStatistic,
  setMapStatistic,
  mapStatistic,
}) => {
  const total = getTableStatistic(data, statistic, 'total');
  const delta = getTableStatistic(data, statistic, 'delta');

  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });

  const handleMapClick = useCallback(
    (statistic, e) => {
      e.stopPropagation();
      setMapStatistic(statistic);
    },
    [setMapStatistic]
  );

  const statisticConfig = STATISTIC_CONFIGS[statistic];

  return (
    <div
      className="cell statistic"
      onClick={mapStatistic ? handleMapClick.bind(this, statistic) : null}
    >
      {statisticConfig?.showDelta && (
        <animated.div
          className={classnames('delta', `is-${statistic}`)}
          title={delta}
        >
          {spring.delta.to((delta) =>
            delta > 0
              ? '\u2191' + formatNumber(delta, statisticConfig.format)
              : delta < 0
              ? '\u2193' + formatNumber(Math.abs(delta), statisticConfig.format)
              : ''
          )}
        </animated.div>
      )}

      <animated.div className="total" title={total}>
        {spring.total.to((total) =>
          formatNumber(total, statisticConfig.format, statistic)
        )}
      </animated.div>
      {mapStatistic && (
        <div
          className={classnames('map-indicator', `is-${statistic}`, {
            highlighted: statistic === mapStatistic,
          })}
          style={{
            background:
              statistic === mapStatistic && statisticConfig?.color
                ? statisticConfig.color
                : null,
          }}
        />
      )}
    </div>
  );
};

const isCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  } else if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  } else if (!equal(prevProps.mapStatistic, currProps.mapStatistic)) {
    return false;
  } else if (!equal(prevProps.getTableStatistic, currProps.getTableStatistic)) {
    return false;
  }
  return true;
};

export default memo(Cell, isCellEqual);
