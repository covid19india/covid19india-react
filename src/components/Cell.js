import {SPRING_CONFIG_NUMBERS} from '../constants.js';
import {formatNumber, getStatistic} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {animated, useSpring} from 'react-spring';

const Cell = ({statistic, data, isPerMillion}) => {
  let total = getStatistic(data, 'total', statistic, isPerMillion);
  // TODO: Maybe move inside getStatistic
  if (!total && statistic === 'tested') {
    total = NaN;
  }
  if (statistic === 'tested date' && data.meta && data.meta.tested) {
    total = data.meta.tested.last_updated;
  }
  if (statistic === 'population' && data.meta) {
    total = data.meta.population;
  }
  const delta = getStatistic(data, 'delta', statistic, isPerMillion);

  if (!total) {
    total = '-';
  }
  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div className="cell statistic">
      {statistic !== 'active' && (
        <animated.div className={classnames('delta', `is-${statistic}`)}>
          {spring.delta.interpolate((delta) =>
            delta > 0
              ? '\u2191' +
                formatNumber(
                  Math.floor(delta),
                  statistic === 'tested' ? 'short' : null
                )
              : delta < 0
              ? '\u2193' +
                formatNumber(
                  Math.floor(Math.abs(delta)),
                  statistic === 'tested' ? 'short' : null
                )
              : ''
          )}
        </animated.div>
      )}

      <animated.div className="total">
        {spring.total.interpolate((total) =>
          statistic === 'tested date'
            ? total
            : formatNumber(
                Math.floor(total),
                (statistic === 'tested') | (statistic === 'population')
                  ? 'short'
                  : null
              )
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
