import {parseIndiaDate} from '../utils/commonFunctions';

import {formatISO} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo} from 'react';
import ReactCalendar from 'react-calendar';

function Calendar({date, dates, slider}) {
  const isDateDisabled = ({date, view}) => {
    return (
      view === 'month' &&
      !dates.includes(formatISO(date, {representation: 'date'}))
    );
  };

  const handleCalendarClick = (value) => {
    const clickedDate = formatISO(value, {representation: 'date'});
    slider.moveToSlide(dates.indexOf(clickedDate));
  };

  return (
    <div className="Calendar">
      <ReactCalendar
        value={parseIndiaDate(date)}
        minDate={parseIndiaDate(dates[dates.length - 1])}
        maxDate={parseIndiaDate(dates[0])}
        tileDisabled={isDateDisabled}
        minDetail="year"
        showFixedNumberOfWeeks
        onChange={handleCalendarClick}
      />
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(Calendar, isEqual);
