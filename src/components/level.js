import {PRIMARY_STATISTICS} from '../constants';
import {formatNumber, capitalize} from '../utils/commonfunctions';

import {HeartFillIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import * as easings from 'd3-ease';
import equal from 'fast-deep-equal';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';

function PureLevelItem({statistic, total, delta}) {
  const {t} = useTranslation();
  const spring = useSpring({
    total: total,
    delta: delta,
    from: {total: total, delta: delta},
    config: {
      easing: easings.easeQuadOut,
      tension: 500,
      duration: 1000,
      clamp: true,
    },
  });

  return (
    <div className={classnames('level-item', `is-${statistic}`)}>
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
    </div>
  );
}

const LevelItem = React.memo(PureLevelItem);

const handleStatistic = (statistic, data) => {
  if (statistic === 'active') {
    return data.confirmed - data.recovered - data.deceased;
  }
  return data[statistic];
};

function Level({data}) {
  return (
    <div className="Level">
      {PRIMARY_STATISTICS.map((statistic) => (
        <LevelItem
          key={statistic}
          statistic={statistic}
          total={handleStatistic(statistic, data.total)}
          delta={handleStatistic(statistic, data.delta)}
        />
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (equal(prevProps.data.last_updated, currProps.data.last_updated)) {
    return true;
  }
  return false;
};

export default React.memo(Level, isEqual);
