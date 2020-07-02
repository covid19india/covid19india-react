import {PRIMARY_STATISTICS} from '../constants';
import {capitalize, formatNumber, getStatistic} from '../utils/commonFunctions';

import {HeartFillIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, config} from 'react-spring';

function PureLevelItem({statistic, total, delta}) {
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
      <h5>{t(capitalize(statistic))}</h5>
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
  const trail = useMemo(() => {
    const styles = [];

    PRIMARY_STATISTICS.map((statistic, index) => {
      styles.push({
        animationDelay: `${750 + index * 250}ms`,
      });
      return null;
    });
    return styles;
  }, []);

  return (
    <div className="Level">
      {PRIMARY_STATISTICS.map((statistic, index) => (
        <animated.div
          key={index}
          className={classnames('level-item', `is-${statistic}`, 'fadeInUp')}
          style={trail[index]}
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
