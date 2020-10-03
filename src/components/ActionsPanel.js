import {parse, format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useMemo, useCallback, lazy, Suspense} from 'react';
import * as Icon from 'react-feather';
import {useSpring, animated} from 'react-spring';

const Timeline = lazy(() => import('./Timeline'));

const ActionsPanel = ({
  lastViewedLog,
  newUpdate,
  isTimelineMode,
  setIsTimelineMode,
  showUpdates,
  setDate,
  dates,
  setNewUpdate,
  setShowUpdates,
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

  const TimelineIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-.2 -.2 17 17"
        width="16"
        height="16"
      >
        <path
          fillRule="evenodd"
          d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0
          .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715
          4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154
          8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0
          01.75.75v2.992l2.028.812a.75.75 0 01-.557
          1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75
          0 017.75 4z"
        ></path>
      </svg>
    ),
    []
  );

  const {transform, opacity} = useSpring({
    opacity: isTimelineMode ? 1 : 0,
    transform: `perspective(600px) rotateX(${isTimelineMode ? 180 : 0}deg)`,
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

  const handleClick = useCallback(() => {
    setIsTimelineMode(true);
    if (showUpdates) setShowUpdates(!showUpdates);
  }, [setIsTimelineMode, setShowUpdates, showUpdates]);

  return (
    <React.Fragment>
      <animated.div
        className="actions"
        style={{
          opacity: opacity.interpolate((o) => 1 - o),
          transform,
          pointerEvents: isTimelineMode ? 'none' : '',
        }}
      >
        <h5 className="fadeInUp" style={trail[0]}>{`${getTimeFromMilliseconds(
          lastViewedLog
        )} IST`}</h5>

        <div className="bell-icon fadeInUp" style={trail[1]}>
          {!showUpdates ? Bell : BellOff}
          {newUpdate && <div className="indicator"></div>}
        </div>

        <div
          className="timeline-icon fadeInUp"
          onClick={handleClick}
          style={trail[2]}
        >
          {TimelineIcon}
        </div>
      </animated.div>

      <animated.div
        className="actions timeline"
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
          pointerEvents: !isTimelineMode ? 'none' : '',
        }}
      >
        {isTimelineMode && (
          <Suspense fallback={<div />}>
            <Timeline {...{setIsTimelineMode, setDate, dates}} />
          </Suspense>
        )}
      </animated.div>
    </React.Fragment>
  );
};

export default ActionsPanel;
