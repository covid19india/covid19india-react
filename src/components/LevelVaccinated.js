import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import {formatNumber, getStatistic} from '../utils/commonFunctions';

import {ShieldCheckIcon} from '@primer/octicons-v2-react';
import equal from 'fast-deep-equal';
import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';

function LevelVaccinated({data}) {
  const {t} = useTranslation();

  const spring = useSpring({
    total: getStatistic(data, 'total', 'vaccinated'),
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div className="LevelVaccinated fadeInUp">
      <ShieldCheckIcon />
      <animated.h4>
        {spring.total.interpolate(
          (total) =>
            `${formatNumber(Math.floor(total))} ${t(
              STATISTIC_CONFIGS['vaccinated'].displayName
            )}`
        )}
      </animated.h4>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  return true;
};

export default memo(LevelVaccinated, isEqual);
