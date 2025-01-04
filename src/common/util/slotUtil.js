import moment from 'moment';

export const convertSlots = (data) => {
  return data.map((slot) => {
    const { start, end } = slot;
    return {
      ...slot,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
    };
  });
};

export const convertStatusToText = (status) => {
  return status
    .split('_')
    .map((status) => status.charAt(0) + status.slice(1).toLowerCase())
    .join(' ');
};

// check if the slot will overlaps with existing slots
export const isOverlapped = (slots, start, end, id = undefined) => {
  return slots.some((slot) => {
    if (id && slot.id === id) {
      return false;
    }
    const range1 = moment.range(start, end);
    const range2 = moment.range(moment(slot.start), moment(slot.end));
    return range1.overlaps(range2);
  });
};

/**
 * Check if the calendar's slot is within the some student's available times. If so, if it's the start or end of the available times.
 */
export const IsCalendarSlotWithinAvailableTimes = (slots, date) => {
  const ret = {
    isAvailable: false,
    isStart: false,
    isEnd: false,
  };
  if (slots === undefined) {
    return ret;
  }
  date = moment(date);
  slots.forEach((slot) => {
    const start = moment(slot.start);
    const end = moment(slot.end);
    if (
      !ret.isAvailable &&
      date.isSameOrAfter(start, 'minute') &&
      date.isBefore(end, 'minute')
    ) {
      ret.isAvailable = true;
    }
    if (!ret.isStart && date.isSame(start, 'minute')) {
      ret.isStart = true;
    }

    if (!ret.isEnd && end.isSame(moment(date).add(0.5, 'hours'), 'minute')) {
      ret.isEnd = true;
    }
  });

  return ret;
};

/**
 * Check if the appointment is doable. `availableSlotsOfSomeStudent` should already be combined slots.
 */
export const isWithinAvailableTimes = (
  availableSlotsOfSomeStudent,
  start,
  end
) => {
  start = moment(start);
  end = moment(end);
  return availableSlotsOfSomeStudent.some((slot) => {
    const slotStart = moment(slot.start);
    const slotEnd = moment(slot.end);
    return (
      start.isSameOrAfter(slotStart, 'minute') &&
      end.isSameOrBefore(slotEnd, 'minute')
    );
  });
};
