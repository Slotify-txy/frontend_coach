import { createSelector } from '@reduxjs/toolkit';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { slotApiSlice as slotApi } from '../../app/services/slotApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';

const moment = extendMoment(Moment);

export const selectSlotsResultByCoachId = slotApi.endpoints.getSlots.select({
  coachId: 10,
});

/**
 * Get SCHEDULING slots for each student
 * return type: { studentId: [slots] }
 */
export const selectStudentAvailableSlots = createSelector(
  selectSlotsResultByCoachId,
  (slots) => {
    slots = slots?.data ?? [];
    const ret = {};
    slots.forEach((slot) => {
      if (slot.status !== SlotStatusConstants.SCHEDULING) return;
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
  }
);

export const selectUnschedulingSlots = createSelector(
  selectSlotsResultByCoachId,
  (slots) => {
    const data = slots?.data ?? [];
    return data.filter(
      (slot) => slot.status !== SlotStatusConstants.SCHEDULING
    );
  }
);
