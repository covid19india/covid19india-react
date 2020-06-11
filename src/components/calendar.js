import {formatDate} from '../utils/commonfunctions';
import React from 'react';
import DatePicker from 'react-date-picker';
import {differenceInCalendarDays} from "date-fns";
import {Calendar as CalendarIcon} from "react-feather";

const Calendar = ({setDate, date}) => {
  const today = new Date()

  return (
    <React.Fragment>
      <DatePicker
        value={!!date ? new Date(date) : today}
        minDate={new Date('02-Mar-2020')}
        maxDate={today}
        calendarIcon={<CalendarIcon />}
        clearIcon={null}
        onChange={(value) => {
          setDate(differenceInCalendarDays(today, value) === 0 ? '': formatDate(value, "yyyy-MM-dd"))
        }}
      />
    </React.Fragment>
  );
};

export default React.memo(Calendar);