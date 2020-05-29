import {PRIMARY_STATISTICS} from '../constants';
import {capitalize, formatNumber, getStatistic} from '../utils/commonfunctions';

import {HeartFillIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, config, useTransition} from 'react-spring';

function PureLevelItem({statistic, total, delta}) {
  const {t} = useTranslation();
  const spring = useSpring(
    {
      total: total,
      delta: delta,
      from: {total: total, delta: delta},
    },
    config.gentle
  );

  return (
    <React.Fragment>
      <h5>{capitalize(t(statistic))}</h5>
      <h4>
        <animated.span>
          {delta > 0 ? (
            spring.delta.interpolate(
              (delta) => `+${formatNumber(Math.floor(delta))}`
            )
          ) : (
            <HeartFillIcon size={9} verticalAlign={2} />
          )}
        </animated.span>
      </h4>
      <h1>
        <animated.span>
          {spring.total.interpolate((total) => formatNumber(Math.floor(total)))}
        </animated.span>
      </h1>
    </React.Fragment>
  );
}

const LevelItem = React.memo(PureLevelItem);

function Level({data}) {
  const transitions = useTransition(PRIMARY_STATISTICS, null, {
    from: {transform: 'translate3d(0, 20px, 0)', opacity: 0},
    enter: {transform: 'translate3d(0, 0px, 0)', opacity: 1},
    trail: 200,
  });

  return (
    <div className="Level">
      {transitions.map(({item: statistic, key, props}) => (
        <animated.div
          key={key}
          className={classnames('level-item', `is-${statistic}`)}
          style={props}
        >
          <LevelItem
            {...{statistic}}
            total={getStatistic(data, 'total', statistic)}
            delta={getStatistic(data, 'delta', statistic)}
          />
        </animated.div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (
    !equal(
      getStatistic(prevProps.data, 'total', 'active'),
      getStatistic(currProps.data, 'total', 'active')
    )
  ) {
    return false;
  }
  return true;
};

export default React.memo(Level, isEqual);
