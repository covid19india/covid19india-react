import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import {formatNumber, getStatistic} from '../utils/commonFunctions';

import {ShieldCheckIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {useState, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, Globals} from 'react-spring';

// Disable react-spring color string interpolation
// It renders administered => administergba(255, 0, 0, 1)
Globals.assign({colors: null});

function ProgressBar({dose1, dose2}) {
  const {t} = useTranslation();
  const [highlightedDose, setHighlightedDose] = useState(1);

  const doseSpring = useSpring({
    dose1,
    dose2,
    from: {
      dose1: 0,
      dose2: 0,
    },
  });

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
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div
      className="LevelVaccinated fadeInUp"
      style={{animationDelay: `${750 + 4 * 250}ms`}}
    >
      <ShieldCheckIcon />
      <animated.h4>
        {spring.total.to(
          (total) =>
            `${formatNumber(Math.floor(total))} ${t(
              STATISTIC_CONFIGS['vaccinated'].displayName
            )}`
        )}
      </animated.h4>
    </div>
  );
}

function VaccinationHeader({data}) {
  const dose1 = getStatistic(data, 'total', 'vaccinated1', {perCent: true});
  const dose2 = getStatistic(data, 'total', 'vaccinated2', {perCent: true});

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
