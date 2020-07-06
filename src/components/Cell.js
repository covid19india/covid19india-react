import {formatNumber, getStatistic} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {Spring, animated} from 'react-spring/renderprops.cjs';

const Cell = ({statistic, data, isPerMillion}) => {
  let total = getStatistic(data, 'total', statistic, isPerMillion);
  // TODO: Maybe move inside getStatistic
  if (!total && statistic === 'tested') {
    total = NaN;
  }
  const delta = getStatistic(data, 'delta', statistic, isPerMillion);

  return (
    <div className="cell statistic">
      {statistic !== 'active' && (
        <Spring native from={{delta: delta}} to={{delta: delta}}>
          {(props) => (
            <animated.div className={classnames('delta', `is-${statistic}`)}>
              {props.delta.interpolate((delta) =>
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
        </Spring>
      )}

      <Spring native from={{total: total}} to={{total: total}}>
        {(props) => (
          <animated.div className="total">
            {props.total.interpolate((total) =>
              formatNumber(
                Math.floor(total),
                statistic === 'tested' ? 'short' : null
              )
            )}
          </animated.div>
        )}
      </Spring>
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
