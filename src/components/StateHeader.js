import StateDropdown from './StateDropdown';

import {SPRING_CONFIG_NUMBERS} from '../constants.js';
import {formatDate, formatNumber, getStatistic} from '../utils/commonFunctions';

import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';

function StateHeader({data, stateCode}) {
  const {t} = useTranslation();

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });

    return styles;
  }, []);

  const spring = useSpring({
    total: getStatistic(data, 'total', 'tested'),
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div className="StateHeader">
      <div className="header-left">
        <StateDropdown {...{stateCode}} hyperlink={false} trail={trail[0]} />
        {data?.meta?.['last_updated'] && (
          <h5 className="fadeInUp" style={trail[1]}>
            {`Last Updated on ${formatDate(
              data.meta.last_updated,
              'dd MMM, p'
            )} IST`}
          </h5>
        )}
      </div>

      <div className="header-right fadeInUp" style={trail[2]}>
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
      </div>
    </div>
  );
}

export default React.memo(StateHeader);
