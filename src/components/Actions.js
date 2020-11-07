import ActionsPanel from './ActionsPanel';

import {fetcher} from '../utils/commonFunctions';

import {memo, useState, useEffect, lazy, Suspense} from 'react';
import {useLocalStorage} from 'react-use';
import useSWR from 'swr';

const Updates = lazy(() => import('./Updates'));

const Actions = ({setDate, dates}) => {
  const [showUpdates, setShowUpdates] = useState(false);
  const [newUpdate, setNewUpdate] = useLocalStorage('newUpdate', false);
  const [lastViewedLog, setLastViewedLog] = useLocalStorage('lastViewedLog', 0);
  const [isTimelineMode, setIsTimelineMode] = useState(false);

  const {data: updates} = useSWR(
    'https://api.covid19india.org/updatelog/log.json',
    fetcher,
    {
      revalidateOnFocus: true,
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
    <>
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
    </>
  );
};

const isEqual = (prevProps, currProps) => {
  return true;
};

export default memo(Actions, isEqual);
