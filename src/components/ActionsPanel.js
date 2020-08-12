import {BellIcon, BellSlashIcon, HistoryIcon} from '@primer/octicons-react';
import {parse, format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useMemo, useCallback, lazy, Suspense} from 'react';
import {useSpring, animated} from 'react-spring';
import '../styles/actions.scss';

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
      <div
        onClick={() => {
          setShowUpdates(!showUpdates);
          setNewUpdate(false);
        }}
      >
        <BellIcon />
      </div>
    ),
    [setNewUpdate, setShowUpdates, showUpdates]
  );

  const BellOff = useMemo(
    () => (
      <div
        onClick={() => {
          setShowUpdates(!showUpdates);
          setNewUpdate(false);
        }}
      >
        <BellSlashIcon
          onClick={() => {
            setShowUpdates(!showUpdates);
          }}
        />
      </div>
    ),
    [setNewUpdate, setShowUpdates, showUpdates]
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
        <h6
          className="timestamp fadeInUp"
          style={trail[0]}
        >{`${getTimeFromMilliseconds(lastViewedLog)} IST`}</h6>

        <div
          data-tooltip={'Updates'}
          className="bell-icon fadeInUp"
          style={trail[1]}
        >
          {!showUpdates ? Bell : BellOff}
          {newUpdate && <div className="indicator"></div>}
        </div>

        <div
          className="timeline-icon fadeInUp"
          onClick={handleClick}
          style={trail[2]}
        >
          <HistoryIcon />
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
