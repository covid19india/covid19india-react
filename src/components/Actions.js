import ActionsPanel from './ActionsPanel';

import {API_DOMAIN} from '../constants';
import {fetcher, retry} from '../utils/commonFunctions';

import equal from 'fast-deep-equal';
import {memo, useState, useEffect, lazy, Suspense} from 'react';
import {useLocalStorage} from 'react-use';
import useSWR from 'swr';

const Updates = lazy(() => retry(() => import('./Updates')));

const Actions = ({date, setDate, dates}) => {
  const [showUpdates, setShowUpdates] = useState(false);
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);
  const [lastViewedLog, setLastViewedLog] = useLocalStorage('lastViewedLog', 0);
  const [isTimelineMode, setIsTimelineMode] = useState(false);

  const {data: updates} = useSWR(`${API_DOMAIN}/updatelog/log.json`, fetcher, {
    revalidateOnFocus: true,
  });

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
    <>
      <ActionsPanel
        {...{
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
        }}
      />

      {showUpdates && (
        <Suspense fallback={<div />}>
          <Updates {...{updates}} />
        </Suspense>
      )}
    </>
  );
};

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(Actions, isEqual);
