import {formatDate} from '../utils/commonFunctions';
import {parse, format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useMemo, lazy, Suspense} from 'react';
import * as Icon from 'react-feather';
import {useSpring, animated} from 'react-spring';

const Calendar = lazy( () =>
  import('./Calendar' /* webpackChunkName: "Calendar" */)
);

const ActionsPanel = ({
  lastViewedLog,
  newUpdate,
  showUpdates,
  setDate,
  setNewUpdate,
  setShowUpdates,
  date
}) => {
  const Bell = useMemo(
    () => (
      <Icon.Bell
        onClick={() => {
          setShowUpdates(!showUpdates);
          setNewUpdate(false);
        }}
      />
    ),
    [setNewUpdate, setShowUpdates, showUpdates]
  );

  const BellOff = useMemo(
    () => (
      <Icon.BellOff
        onClick={() => {
          setShowUpdates(!showUpdates);
        }}
      />
    ),
    [setShowUpdates, showUpdates]
  );

  const {transform, opacity} = useSpring({
    opacity: 0,
    transform: 'perspective(600px) rotateX(0deg)',
    config: {mass: 5, tension: 500, friction: 80},
  });

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${500 + index * 250}ms`,
      });
      return null;
    });
    return styles;
  }, []);

  const getTimeFromMilliseconds = (lastViewedLog) => {
    return format(
      utcToZonedTime(parse(lastViewedLog, 'T', new Date()), 'Asia/Kolkata'),
      'dd MMM, p'
    );
  };

  return (
    <React.Fragment>
      <animated.div
        className="actions"
        style={{
          opacity: opacity.interpolate((o) => 1 - o),
          transform,
          pointerEvents: '',
        }}
      >

        <animated.h5 style={trail[0]}>{`${!!date ? formatDate(date, 'dd MMM Y'): getTimeFromMilliseconds(
          lastViewedLog
        )} IST`}</animated.h5>

        {!showUpdates && (
          <div className="bell-icon fadeInUp" style={trail[1]}>
            {Bell}
            {newUpdate && <div className="indicator"></div>}
          </div>
        )}
        {showUpdates && BellOff}

        <animated.div
          className="calendar-icon"
          style={trail[2]}
        >
          <Suspense fallback={<div />}>
            <Calendar {...{setDate, date}}/>
          </Suspense>
        </animated.div>
      </animated.div>

    </React.Fragment>
  );
};

export default ActionsPanel;