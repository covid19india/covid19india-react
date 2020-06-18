import {fetcher} from '../utils/commonfunctions';

import {parse, format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useMemo, useState, useEffect, lazy, Suspense} from 'react';
import * as Icon from 'react-feather';
import {useSpring, animated, useTrail, config} from 'react-spring';
import {useLocalStorage} from 'react-use';
import useSWR from 'swr';

const Timeline = lazy(() =>
  import('./timeline' /* webpackChunkName: "Timeline" */)
);

const Updates = lazy(() =>
  import('./updates' /* webpackChunkName: "Updates" */)
);

const Actions = ({setDate, dates}) => {
  const [showUpdates, setShowUpdates] = useState(false);
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);
  const [lastViewedLog, setLastViewedLog] = useLocalStorage('lastViewedLog', 0);
  const [isTimelineMode, setIsTimelineMode] = useState(false);

  const {data: updates} = useSWR(
    'https://api.covid19india.org/updatelog/log.json',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (updates !== undefined) {
      const lastTimestamp = updates.slice().reverse()[0].timestamp * 1000;
      if (lastTimestamp !== lastViewedLog) {
        setNewUpdate(true);
        setLastViewedLog(lastTimestamp);
      }
    }
  }, [lastViewedLog, updates, setLastViewedLog, setNewUpdate]);

  return (
    <React.Fragment>
      <ActionsPanel
        {...{
          lastViewedLog,
          newUpdate,
          isTimelineMode,
          setIsTimelineMode,
          showUpdates,
          setDate,
          dates,
          setNewUpdate,
          setShowUpdates,
        }}
      />

      {showUpdates && (
        <Suspense fallback={<div />}>
          <Updates {...{updates}} />
        </Suspense>
      )}
    </React.Fragment>
  );
};

const isEqual = (prevProps, currProps) => {
  return true;
};

export default React.memo(Actions, isEqual);

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

  const trail = useTrail(3, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {
      transform: 'translate3d(0, 0px, 0)',
      opacity: 1,
    },
    config: config.stiff,
  });

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
          pointerEvents: isTimelineMode ? 'none' : '',
        }}
      >
        <animated.h5 style={trail[0]}>{`${getTimeFromMilliseconds(
          lastViewedLog
        )} IST`}</animated.h5>

        {!showUpdates && (
          <animated.div className="bell-icon" style={trail[1]}>
            {Bell}
            {newUpdate && <div className="indicator"></div>}
          </animated.div>
        )}

        {showUpdates && BellOff}
        <animated.div
          className="timeline-icon"
          onClick={() => {
            setIsTimelineMode(true);
            if (showUpdates) setShowUpdates(!showUpdates);
          }}
          style={trail[2]}
        >
          {TimelineIcon}
        </animated.div>
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
