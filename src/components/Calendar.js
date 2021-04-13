import {parseIndiaDate} from '../utils/commonFunctions';

import {
  add,
  formatISO,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useState} from 'react';
import ReactCalendar from 'react-calendar';
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from 'react-feather';
import {useSwipeable} from 'react-swipeable';

function Calendar({date, dates, slider}) {
  const [view, setView] = useState('month');
  const [activeStartDate, setActiveStartDate] = useState(parseIndiaDate(date));

  const minDate = parseIndiaDate(dates[0]);
  const maxDate = parseIndiaDate(dates[dates.length - 1]);

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

  const handleViewButton = ({view}) => {
    setView(view);
  };

  const handleNavigationButton = ({activeStartDate}) => {
    setActiveStartDate(activeStartDate);
  };

  const handleNavigation = (direction) => {
    const newDate = add(
      activeStartDate,
      view === 'month' ? {months: direction} : {years: direction}
    );
    const lower =
      view === 'month' ? startOfMonth(minDate) : startOfYear(minDate);
    const upper = view === 'month' ? endOfMonth(maxDate) : endOfYear(maxDate);
    if (lower <= newDate && newDate <= upper) {
      setActiveStartDate(newDate);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: handleNavigation.bind(this, -1),
    onSwipedLeft: handleNavigation.bind(this, 1),
  });

  const handleWheel = (event) => {
    if (event.deltaX !== 0) {
      handleNavigation(Math.sign(event.deltaX));
    }
  };

  return (
    <div className="Calendar" onWheel={handleWheel} {...swipeHandlers}>
      <ReactCalendar
        value={parseIndiaDate(date)}
        tileDisabled={isDateDisabled}
        {...{minDate, maxDate, activeStartDate, view}}
        onActiveStartDateChange={handleNavigationButton}
        onViewChange={handleViewButton}
        minDetail="year"
        showFixedNumberOfWeeks
        onChange={handleCalendarClick}
        prevLabel={
          <div>
            <ChevronLeft size={18} />
          </div>
        }
        nextLabel={
          <div>
            <ChevronRight size={18} />
          </div>
        }
        prev2Label={
          <div>
            <ChevronsLeft size={18} />
          </div>
        }
        next2Label={
          <div>
            <ChevronsRight size={18} />
          </div>
        }
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
