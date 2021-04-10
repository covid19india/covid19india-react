import {formatDate} from '../utils/commonFunctions';

import {BellIcon, BellSlashIcon, HistoryIcon} from '@primer/octicons-react';
import {parse} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {useMemo, useCallback, lazy, Suspense} from 'react';
import {useSpring, animated} from 'react-spring';

const Timeline = lazy(() => import('./Timeline'));

const ActionsPanel = ({
  lastViewedLog,
  newUpdate,
  isTimelineMode,
  setIsTimelineMode,
  showUpdates,
  date,
  setDate,
  dates,
  setNewUpdate,
  setShowUpdates,
}) => {
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
    const lastViewedDate = utcToZonedTime(
      parse(lastViewedLog, 'T', new Date()),
      'Asia/Kolkata'
    );
    return formatDate(lastViewedDate, 'dd MMM, p');
  };

  const handleTimelineClick = useCallback(() => {
    setIsTimelineMode(true);
    if (showUpdates) setShowUpdates(!showUpdates);
  }, [setIsTimelineMode, setShowUpdates, showUpdates]);

  const handleBellClick = useCallback(() => {
    if (!showUpdates) setNewUpdate(false);
    setShowUpdates(!showUpdates);
  }, [showUpdates, setShowUpdates, setNewUpdate]);

  return (
    <div className="ActionsPanel">
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

        <div
          className="bell-icon fadeInUp"
          style={trail[1]}
          onClick={handleBellClick}
        >
          {!showUpdates ? <BellIcon size={15} /> : <BellSlashIcon size={15} />}
          {newUpdate && <div className="indicator"></div>}
        </div>

        <div
          className="timeline-icon fadeInUp"
          onClick={handleTimelineClick}
          style={trail[2]}
        >
          {<HistoryIcon />}
        </div>
      </animated.div>

      {isTimelineMode && (
        <Suspense fallback={<div />}>
          <Timeline
            style={{
              opacity,
              transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
              pointerEvents: !isTimelineMode ? 'none' : '',
            }}
            {...{date, setDate, dates, setIsTimelineMode}}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ActionsPanel;
