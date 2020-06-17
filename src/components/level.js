import {PRIMARY_STATISTICS} from '../constants';
import {
  capitalize,
  formatNumber,
  getPercentageText,
  getStatistic,
} from '../utils/commonfunctions';

import {HeartFillIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, config, useTrail} from 'react-spring';

function PureLevelItem({statistic, total, delta, confirmed}) {
  const {t} = useTranslation();
  const spring = useSpring(
    {
      total: total,
      delta: delta,
      from: {total: total, delta: delta},
    },
    config.stiff
  );

  return (
    <React.Fragment>
      <h5>
        {t(capitalize(statistic)) +
          ' ' +
          (statistic !== 'confirmed'
            ? getPercentageText(confirmed, total)
            : '')}
      </h5>
      <animated.h4>
        {statistic !== 'active' ? (
          delta > 0 ? (
            spring.delta.interpolate(
              (delta) => `+${formatNumber(Math.floor(delta))}`
            )
          ) : (
            <HeartFillIcon size={9} verticalAlign={2} />
          )
        ) : (
          '\u00A0'
        )}
      </animated.h4>
      <animated.h1>
        {spring.total.interpolate((total) => formatNumber(Math.floor(total)))}
      </animated.h1>
    </React.Fragment>
  );
}

const LevelItem = React.memo(PureLevelItem);

function Level({data}) {
  const [trail, set] = useTrail(4, () => ({
    transform: 'translate3d(0, 20px, 0)',
    opacity: 0,
    config: config.stiff,
  }));

  set({transform: 'translate3d(0, 0px, 0)', opacity: 1});

  return (
    <div className="Level">
      {PRIMARY_STATISTICS.map((statistic, index) => (
        <animated.div
          key={index}
          className={classnames('level-item', `is-${statistic}`)}
          style={trail[index]}
        >
          <LevelItem
            {...{statistic}}
            total={getStatistic(data, 'total', statistic)}
            delta={getStatistic(data, 'delta', statistic)}
            confirmed={getStatistic(data, 'total', 'confirmed')}
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
