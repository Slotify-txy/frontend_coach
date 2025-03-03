import { createSelector, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/services/api';
import update from 'immutability-helper';
import { slotApiSlice } from '../../app/services/slotApiSlice';
import { getDisplayedStudentSlot } from '../../common/util/slotUtil';
import { all } from 'axios';

const slice = createSlice({
  name: 'slot',
  initialState: {
    planningSlots: [],
  },
  reducers: {
    setPlanningSlots: (state, { payload }) => {
      state.planningSlots = payload;
    },
    deleteSlotFromPlanningSlots: (state, { payload: id }) => {
      state.planningSlots = state.planningSlots.filter(
        (slot) => slot.id !== id
      );
    },
    updateSlotInPlanningSlots: (state, { payload }) => {
      const { id, start, end, classId } = payload;
      let slot = state.planningSlots.find((slot) => slot.id === id);
      slot.start = start;
      slot.end = end;
      slot.classId = classId;
    },
    addSlotToPlanningSlots: (state, { payload }) => {
      state.planningSlots.push(payload);
    },
    emptyPlanningSlots: (state) => {
      state.planningSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getAvailableStudents.matchFulfilled,
      (state) => {
        state.planningSlots = [];
      }
    );
  },
});

export const {
  setPlanningSlots,
  deleteSlotFromPlanningSlots,
  updateSlotInPlanningSlots,
  addSlotToPlanningSlots,
  emptyPlanningSlots,
} = slice.actions;

export default slice.reducer;

const selectPlanningSlots = (state) => state.slot.planningSlots;

export const selectTransformedPlanningSlots = createSelector(
  [selectPlanningSlots],
  (slots) =>
    slots.map((slot) => ({
      ...slot,
      start: new Date(slot.start),
      end: new Date(slot.end),
    }))
);
