import Tooltip from './Tooltip';

import {STATISTIC_CONFIGS} from '../constants';
import {toTitleCase} from '../utils/commonFunctions';

import {InfoIcon, SortAscIcon, SortDescIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import {memo, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useLongPress} from 'react-use';

function StateHeaderCell({handleSort, sortData, setSortData, statistic}) {
  const {t} = useTranslation();
  const wasLongPressed = useRef(false);

  const onLongPress = () => {
    if (sortData.sortColumn === statistic) {
      wasLongPressed.current = true;
      setSortData(
        produce(sortData, (sortDataDraft) => {
          sortDataDraft.delta = !sortData.delta;
        })
      );
    }
  };
  const longPressEvent = useLongPress(onLongPress, {isPreventDefault: false});

  const handleClick = useCallback(
    (statistic) => {
      if (wasLongPressed.current) {
        wasLongPressed.current = false;
      } else {
        handleSort(statistic);
      }
    },
    [handleSort]
  );

  const statisticConfig = STATISTIC_CONFIGS[statistic];

  return (
    <div
      className={classnames('cell', 'heading')}
      onClick={handleClick.bind(this, statistic)}
      {...longPressEvent}
    >
      {sortData.sortColumn === statistic && (
        <div
          className={classnames('sort-icon', {
            [`is-${statistic}`]: sortData.delta,
          })}
        >
          {sortData.isAscending ? (
            <SortAscIcon size={12} />
          ) : (
            <SortDescIcon size={12} />
          )}
        </div>
      )}
      {statisticConfig?.tableConfig?.notes && (
        <Tooltip message={t(statisticConfig.tableConfig.notes)}>
          <InfoIcon size={14} />
        </Tooltip>
      )}
      <div>
        {t(
          toTitleCase(
            statisticConfig?.tableConfig?.displayName ||
              statisticConfig.displayName
          )
        )}
      </div>
    </div>
  );
}

const isStateHeaderCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.sortData, currProps.sortData)) {
    return false;
  } else {
    return true;
  }
};

export default memo(StateHeaderCell, isStateHeaderCellEqual);
