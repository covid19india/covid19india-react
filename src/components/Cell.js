import {
  PER_MILLION_OPTIONS,
  SPRING_CONFIG_NUMBERS,
  STATISTIC_CONFIGS,
} from '../constants.js';
import {
  formatNumber,
  getIndiaTPR,
  getStatistic,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {animated, useSpring} from 'react-spring';

const Cell = ({statistic, data, isPerMillion, stateCode, states}) => {
  const statisticConfig = STATISTIC_CONFIGS[statistic];
  const statisticOptions = {
    ...statisticConfig.options,
    ...(isPerMillion &&
      !statisticConfig.options?.normalizeByKey &&
      PER_MILLION_OPTIONS),
  };
  const [total, delta] =
    stateCode !== 'TT' || statistic !== 'test positivity ratio'
      ? [
          getStatistic(data, 'total', statisticOptions),
          getStatistic(data, 'delta', statisticOptions),
        ]
      : Object.values(getIndiaTPR(states));

  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div className="cell statistic">
      {!statisticConfig.hideDelta && (
        <animated.div
          className={classnames('delta', `is-${statisticOptions.key}`)}
        >
          {spring.delta.interpolate((delta) =>
            delta > 0
              ? '\u2191' + formatNumber(delta, statisticConfig.format)
              : delta < 0
              ? '\u2193' + formatNumber(Math.abs(delta), statisticConfig.format)
              : ''
          )}
        </animated.div>
      )}

      <animated.div className="total">
        {spring.total.interpolate((total) =>
          formatNumber(total, statisticConfig.format, statistic)
        )}
      </animated.div>
    </div>
  );
};

const isCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  }
  if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  }
  if (!equal(prevProps.isPerMillion, currProps.isPerMillion)) {
    return false;
  }
  return true;
};

export default React.memo(Cell, isCellEqual);
