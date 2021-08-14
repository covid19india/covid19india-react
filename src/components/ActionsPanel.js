import Tooltip from './Tooltip';

import {formatDate, retry} from '../utils/commonFunctions';

import {BellIcon, BellSlashIcon, HistoryIcon} from '@primer/octicons-react';
import {useMemo, useCallback, lazy, Suspense} from 'react';
import {useTranslation} from 'react-i18next';

const Timeline = lazy(() => retry(() => import('./Timeline')));

const ActionsPanel = ({
  lastUpdatedDate,
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
  const {t} = useTranslation();

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
      <div
        className="actions"
        style={{
          opacity: isTimelineMode ? 0 : 1,
          transform: `perspective(600px) rotateX(${
            isTimelineMode ? 90 : 0
          }deg)`,
          pointerEvents: isTimelineMode ? 'none' : '',
        }}
      >
        <h5 className="fadeInUp" style={trail[0]}>{`${formatDate(
          lastUpdatedDate,
          'dd MMM, p'
        )} ${t('IST')}`}</h5>

        <div
          className="bell-icon fadeInUp"
          style={trail[1]}
          onClick={handleBellClick}
        >
          {!showUpdates ? <BellIcon size={15} /> : <BellSlashIcon size={15} />}
          {newUpdate && <div className="indicator"></div>}
        </div>

        <Tooltip message={'Timeline'} hold>
          <div
            className="timeline-icon fadeInUp"
            onClick={handleTimelineClick}
            style={trail[2]}
          >
            {<HistoryIcon />}
          </div>
        </Tooltip>
      </div>

      {isTimelineMode && (
        <Suspense fallback={<div />}>
          <Timeline
            {...{date, setDate, dates, isTimelineMode, setIsTimelineMode}}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ActionsPanel;
