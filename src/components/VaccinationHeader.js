import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import {formatNumber, getStatistic} from '../utils/commonFunctions';

import {ShieldCheckIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {useEffect, useRef, useState, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, Globals} from 'react-spring';

// Disable react-spring color string interpolation
// It renders administered => administergba(255, 0, 0, 1)
Globals.assign({colors: null});

function ProgressBar({dose1, dose2}) {
  const {t} = useTranslation();
  const [highlightedDose, setHighlightedDose] = useState(2);
  const isMounted = useRef(false);

  const doseSpring = useSpring({
    dose1,
    dose2,
    from: {
      dose1: 0,
      dose2: 0,
    },
    delay: isMounted.current ? 0 : 2000,
  });

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <div
      className="progress-bar-wrapper fadeInUp"
      style={{animationDelay: `${750 + 5 * 250}ms`}}
    >
      <div
        className={classnames('legend', {highlighted: highlightedDose === 1})}
      >
        <div className="label-wrapper">
          <animated.div
            style={{width: doseSpring.dose1.to((n) => `calc(${n}% - 3rem)`)}}
          />
          <div
            className="label"
            onMouseEnter={setHighlightedDose.bind(this, 1)}
            onMouseLeave={setHighlightedDose.bind(this, 2)}
          >
            {t('At least one dose')}
          </div>
        </div>
        <animated.div
          className="arrow"
          style={{
            marginLeft: doseSpring.dose1.to((n) => `calc(${n}% - 0.3ch)`),
          }}
        >
          |
        </animated.div>
      </div>
      <div className="progress-bar">
        <animated.div
          className={classnames('progress-bar', 'value', {
            highlighted: highlightedDose === 1,
          })}
          style={{width: doseSpring.dose1.to((n) => `${n}%`)}}
          onMouseEnter={setHighlightedDose.bind(this, 1)}
          onMouseLeave={setHighlightedDose.bind(this, 2)}
        >
          <animated.span>
            {doseSpring.dose1.to((n) => formatNumber(n, '%'))}
          </animated.span>
        </animated.div>
        <animated.div
          className={classnames('progress-bar', 'value', 'opaque', {
            highlighted: highlightedDose === 2,
          })}
          style={{width: doseSpring.dose2.to((n) => `${n}%`)}}
        />
      </div>
      {dose2 > 0 && (
        <div
          className={classnames('legend', {
            highlighted: highlightedDose === 2,
          })}
        >
          <animated.div
            className="arrow"
            style={{
              marginLeft: doseSpring.dose2.to((n) => `calc(${n}% - 0.3ch)`),
            }}
          >
            |
          </animated.div>
          <div className="label-wrapper">
            <animated.div
              style={{
                width: doseSpring.dose2.to((n) => `calc(${n}% - 4rem)`),
              }}
            />
            <animated.div className="label">
              {doseSpring.dose2.to(
                (n) => `${t('Fully vaccinated')} (${formatNumber(n, '%')})`
              )}
            </animated.div>
          </div>
        </div>
      )}
    </div>
  );
}

function Level({data}) {
  const {t} = useTranslation();

  const spring = useSpring({
    total: getStatistic(data, 'total', 'vaccinated'),
    // delta: getStatistic(data, 'delta', 'vaccinated'),
    config: SPRING_CONFIG_NUMBERS,
  });

  const statisticConfig = STATISTIC_CONFIGS.vaccinated;

  return (
    <div
      className="level-vaccinated fadeInUp"
      style={{animationDelay: `${750 + 4 * 250}ms`}}
    >
      <ShieldCheckIcon />
      <animated.div>
        {spring.total.to((total) => formatNumber(total, 'long'))}
      </animated.div>
      {/* <animated.div>
        {spring.delta.to(
          (delta) =>
            `(+ ${formatNumber(delta, 'long')})`
        )}
      </animated.div> */}
      <div>{t(statisticConfig.displayName)}</div>
    </div>
  );
}

function VaccinationHeader({data}) {
  const dose1 = getStatistic(data, 'total', 'vaccinated1', {
    normalizedByPopulationPer: 'hundred',
  });
  const dose2 = getStatistic(data, 'total', 'vaccinated2', {
    normalizedByPopulationPer: 'hundred',
  });

  return (
    <div className="VaccinationHeader">
      <Level {...{data}} />
      <ProgressBar {...{dose1, dose2}} />
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  return true;
};

export default memo(VaccinationHeader, isEqual);
