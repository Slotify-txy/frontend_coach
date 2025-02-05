import moment from 'moment';
import SLOT_STATUS from '../../common/constants/slotStatus';

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
  switch (status) {
    case SLOT_STATUS.PLANNING_OPEN_HOUR || SLOT_STATUS.PLANNING_SCHEDULE:
      return 'Planning';
    default:
      return status
        .split('_')
        .map((status) => status.charAt(0) + status.slice(1).toLowerCase())
        .join(' ');
  }
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

/**
 * Get SCHEDULING slots for each student
 * @returns { studentId: [slots] }
 */
export const computeStudentAvailableSlots = (slots) => {
  slots = slots ?? [];
  const ret = {};
  slots.forEach((slot) => {
    if (slot.status !== SLOT_STATUS.AVAILABLE) return;
    if (slot.studentId in ret) {
      ret[slot.studentId].push(slot);
    } else {
      ret[slot.studentId] = [slot];
    }
  });

  for (const studentId in ret) {
    ret[studentId].sort((a, b) => moment(a.start) - moment(b.start));
    const ranges = ret[studentId].map((slot) =>
      moment.range(moment(slot.start), moment(slot.end))
    );
    const joinedRanges = [];
    for (let i = 0; i < ranges.length; i++) {
      let range = ranges[i];
      while (i + 1 < ranges.length && range.adjacent(ranges[i + 1])) {
        range = range.add(ranges[i + 1], { adjacent: true });
        i += 1;
      }
      joinedRanges.push(range);
    }
    ret[studentId] = joinedRanges;
  }

  return ret;
};

export const getUnschedulingSlots = (slots) => {
  slots = slots ?? [];
  return slots.filter((slot) => slot.status !== SLOT_STATUS.AVAILABLE);
};

export const getStatusColor = (status) => {
  switch (status) {
    case SLOT_STATUS.AVAILABLE:
      return '#039BE5';
    case SLOT_STATUS.PENDING:
      return '#f6bf26';
    case SLOT_STATUS.OPEN_HOUR:
    case SLOT_STATUS.APPOINTMENT:
      return '#33b679';
    case SLOT_STATUS.PLANNING_OPEN_HOUR:
    case SLOT_STATUS.PLANNING_SCHEDULE:
      return '#7986cb';
    default:
      return '#7986cb';
  }
};
