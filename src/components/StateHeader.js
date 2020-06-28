import StateDropdown from './StateDropdown';

import {formatDate, formatNumber, getStatistic} from '../utils/commonFunctions';

import React from 'react';
import {useTranslation} from 'react-i18next';
import {animated, config, useSpring, useTrail} from 'react-spring';

function StateHeader({data, stateCode}) {
  const {t} = useTranslation();

  const trail = useTrail(3, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {
      transform: 'translate3d(0, 0px, 0)',
      opacity: 1,
      delay: 1000,
    },
    config: config.gentle,
  });

  const spring = useSpring({
    total: getStatistic(data, 'total', 'tested'),
    config: config.gentle,
  });

  return (
    <div className="StateHeader">
      <div className="header-left">
        <StateDropdown {...{stateCode}} hyperlink={false} trail={trail[0]} />
        {data?.meta?.['last_updated'] && (
          <animated.h5 style={trail[1]}>
            {`Last Updated on ${formatDate(
              data.meta.last_updated,
              'dd MMM, p'
            )} IST`}
          </animated.h5>
        )}
      </div>

      <animated.div className="header-right" style={trail[2]}>
        <h5>{t('Tested')}</h5>
        <animated.h2>
          {spring.total.interpolate((total) => formatNumber(Math.floor(total)))}
        </animated.h2>
        {data?.meta?.tested?.['last_updated'] && (
          <h5 className="timestamp">
            {`As of ${formatDate(data.meta.tested.last_updated, 'dd MMMM')}`}
          </h5>
        )}
        {data?.meta?.tested?.source && (
          <h5>
            {'per '}
            <a href={data.meta.tested.source} target="_noblank">
              source
            </a>
          </h5>
        )}
      </animated.div>
    </div>
  );
}

export default React.memo(StateHeader);
