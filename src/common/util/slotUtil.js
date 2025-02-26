import moment from 'moment';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { v4 as uuidv4 } from 'uuid';

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
      ret.classId = slot.classId;
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
  scheduledClasses,
  start,
  end,
  classId = undefined
) => {
  start = moment(start);
  end = moment(end);
  return availableSlotsOfSomeStudent.some((slot) => {
    const slotStart = moment(slot.start);
    const slotEnd = moment(slot.end);
    return (
      start.isSameOrAfter(slotStart, 'minute') &&
      end.isSameOrBefore(slotEnd, 'minute') &&
      (classId == slot.classId || !scheduledClasses.has(slot.classId))
    );
  });
};

/**
 * Combine available slots for each student
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
    const ranges = ret[studentId].map((slot) => {
      return {
        slotRange: moment.range(moment(slot.start), moment(slot.end)),
        classId: slot.classId,
      };
    });
    const joinedRanges = [];
    for (let i = 0; i < ranges.length; i++) {
      let { slotRange, classId } = ranges[i];
      while (
        i + 1 < ranges.length &&
        classId == ranges[i + 1].classId &&
        slotRange.adjacent(ranges[i + 1].slotRange)
      ) {
        slotRange = slotRange.add(ranges[i + 1].slotRange, { adjacent: true });
        i += 1;
      }
      joinedRanges.push({ ...slotRange, classId });
    }
    ret[studentId] = joinedRanges;
  }
  return ret;
};

export const getUnschedulingSlots = (slots) => {
  slots = slots ?? [];
  return slots.filter((slot) => slot.status !== SLOT_STATUS.AVAILABLE);
};

export const autoSchedule = (students, slots) => {
  const studentMap = new Map(
    students.map((s) => [s.id, s.numOfClassCanBeScheduled])
  );
  // console.log('studentMap', studentMap);

  const scheduled = [];

  const scheduledClasses = new Set();
  const statusSet = new Set([
    SLOT_STATUS.PENDING,
    SLOT_STATUS.APPOINTMENT,
    SLOT_STATUS.REJECTED,
    SLOT_STATUS.CANCELLED,
  ]);
  slots.forEach((slot) => {
    if (statusSet.has(slot.status)) {
      scheduledClasses.add(slot.classId);
    }
  });

  const forbiddenStartTime = new Set();
  // update forbiddenStartTime
  slots.forEach((slot) => {
    if (
      slot.status == SLOT_STATUS.PENDING ||
      slot.status == SLOT_STATUS.APPOINTMENT
    ) {
      let start = moment(slot.start);
      const slotEnd = moment(slot.end);
      forbiddenStartTime.add(start.clone().subtract(0.5, 'hours').toString());

      // at least a 30-minute break if the class starts after 5pm
      if (start.hour() > 17) {
        forbiddenStartTime.add(start.clone().subtract(1, 'hours').toString());
      }

      // at least a 30-minute break if the class ends after 5pm
      if (slotEnd.hour() >= 17) {
        forbiddenStartTime.add(slotEnd.toString());
      }

      while (start.clone().add(0.5, 'hours').isSameOrBefore(slotEnd)) {
        forbiddenStartTime.add(start.toString());
        start.add(0.5, 'hours');
      }
    }
  });

  let filteredSlots = slots.filter(
    (slot) =>
      moment(slot.end).isSameOrAfter(moment()) && studentMap.has(slot.studentId)
  );

  // console.log('filteredSlots', filteredSlots);

  const updateHelperObjs = (
    slots,
    forbiddenStartTime,
    timeMap,
    impactMap,
    studentToCountOfStartMap,
    countToStudentsMap
  ) => {
    // console.log('scheduledClasses', scheduledClasses);

    slots = slots.filter(
      (slot) =>
        !scheduledClasses.has(slot.classId) &&
        slot.status == SLOT_STATUS.AVAILABLE
    );

    // console.log('slots', slots);
    slots.forEach((slot) => {
      let start = moment(slot.start);
      const slotEnd = moment(slot.end);
      const studentId = slot.studentId;
      while (start.clone().add(1, 'hours').isSameOrBefore(slotEnd)) {
        if (start < moment()) {
          start.add(0.5, 'hours');
          continue;
        }
        const startString = start.toString();
        if (forbiddenStartTime.has(startString)) {
          start.add(0.5, 'hours');
          continue;
        }

        if (!studentToCountOfStartMap.has(studentId)) {
          studentToCountOfStartMap.set(studentId, 1);
        } else {
          studentToCountOfStartMap.set(
            studentId,
            studentToCountOfStartMap.get(studentId) + 1
          );
        }

        if (!countToStudentsMap.has(startString)) {
          countToStudentsMap.set(startString, []);
        }
        countToStudentsMap.get(startString).push(studentId);

        if (!timeMap.has(startString)) timeMap.set(startString, []);
        timeMap.get(startString).push(slot);

        start.add(0.5, 'hours');
      }
    });

    for (const [start, slots] of timeMap) {
      let impact = slots.length;
      const startTime = moment(new Date(start));
      if (timeMap.has(startTime.clone().subtract(0.5, 'hours').toString()))
        impact += timeMap.get(
          startTime.clone().subtract(0.5, 'hours').toString()
        ).length;
      if (timeMap.has(startTime.clone().add(0.5, 'hours').toString()))
        impact += timeMap.get(
          startTime.clone().add(0.5, 'hours').toString()
        ).length;

      // at least a 30-minute break if the class starts after 5pm
      if (startTime.hour() > 17) {
        if (timeMap.has(startTime.clone().subtract(1, 'hours').toString())) {
          impact += timeMap.get(
            startTime.clone().subtract(1, 'hours').toString()
          ).length;
        }

        if (timeMap.has(startTime.clone().add(1, 'hours').toString())) {
          impact += timeMap.get(
            startTime.clone().add(1, 'hours').toString()
          ).length;
        }
      }

      impactMap.set(start, impact);
    }
  };

  while (studentMap.size != 0) {
    const timeMap = new Map();
    const impactMap = new Map();
    const studentToCountOfStartMap = new Map();
    const countToStudentsMap = new Map();

    updateHelperObjs(
      filteredSlots,
      forbiddenStartTime,
      timeMap,
      impactMap,
      studentToCountOfStartMap,
      countToStudentsMap
    );
    // console.log('studentMap', studentMap);
    // console.log('forbiddenStartTime', forbiddenStartTime);
    // console.log('timeMap', timeMap);
    // console.log('impactMap', impactMap);
    // console.log('studentToCountOfStartMap', studentToCountOfStartMap);
    // console.log('countToStudentsMap', countToStudentsMap);
    if (impactMap.size == 0) return scheduled;
    const sortedTimes = [...impactMap.entries()].sort((a, b) => {
      if (a[1] == b[1]) {
        return new Date(a) - new Date(b);
      }
      return a[1] - b[1];
    });
    // console.log('sortedTimes', sortedTimes);
    const startTime = sortedTimes[0][0];
    const { studentId, classId } = timeMap
      .get(startTime)
      .sort(
        (a, b) =>
          studentToCountOfStartMap.get(a.studentId) -
          studentToCountOfStartMap.get(b.studentId)
      )[0];

    const start = moment(new Date(startTime));

    scheduled.push({
      id: uuidv4(),
      studentId: studentId,
      start: new Date(startTime),
      end: start.clone().add(1, 'hours').toDate(),
      status: SLOT_STATUS.PLANNING_SCHEDULE,
      classId: classId,
      isDraggable: true,
    });
    // console.log('scheduled', scheduled);
    const numOfClassCanBeScheduled = studentMap.get(studentId);
    if (numOfClassCanBeScheduled == 1) {
      studentMap.delete(studentId);
    } else {
      studentMap.set(studentId, numOfClassCanBeScheduled - 1);
    }
    // console.log(studentMap.size, studentMap);

    filteredSlots = filteredSlots.filter((slot) => slot.classId != classId);
    scheduledClasses.add(classId);

    // update forbiddenStartTime
    forbiddenStartTime.add(startTime);
    forbiddenStartTime.add(start.clone().add(0.5, 'hours').toString());
    forbiddenStartTime.add(start.clone().subtract(0.5, 'hours').toString());

    // at least a 30-minute break if the class starts after 5pm
    if (start.hour() > 17) {
      forbiddenStartTime.add(start.clone().subtract(1, 'hours').toString());
    }

    // at least a 30-minute break if the class ends after 5pm
    if (start.clone().add(1, 'hours').hour() >= 17) {
      forbiddenStartTime.add(start.clone().add(1, 'hours').toString());
    }

    // console.log('filteredSlots', filteredSlots);
    // console.log('scheduledClasses', scheduledClasses);
  }

  return scheduled;
};

export const isSlotScheduled = (slot, scheduledClasses) =>
  scheduledClasses.has(slot.classId);

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
    case SLOT_STATUS.REJECTED:
      return '#616161';
    case SLOT_STATUS.CANCELLED:
      return '#d50100';
  }
};
