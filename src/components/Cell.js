import {formatNumber, getStatistic} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {animated, useSpring, config} from 'react-spring';

const Cell = ({statistic, data}) => {
  const total = getStatistic(data, 'total', statistic);
  const delta = getStatistic(data, 'delta', statistic);

  const spring = useSpring(
    {
      total: total,
      delta: delta,
      from: {
        total: total,
        delta: delta,
      },
    },
    config.gentle
  );

  return (
    <div className="cell statistic">
      {statistic !== 'active' && (
        <animated.div className={classnames('delta', `is-${statistic}`)}>
          {spring.delta.interpolate((delta) =>
            delta > 0
              ? '\u2191' + formatNumber(Math.floor(delta))
              : delta < 0
              ? '\u2193' + formatNumber(Math.floor(Math.abs(delta)))
              : ''
          )}
        </animated.div>
      )}
      <animated.div className="total">
        {spring.total.interpolate((total) => formatNumber(Math.floor(total)))}
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
  return true;
};

export default React.memo(Cell, isCellEqual);
