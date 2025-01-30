import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../../app/services/api';
import update from 'immutability-helper';

const slice = createSlice({
  name: 'student',
  initialState: {
    allStudents: [],
    schedulingStudents: [],
    arrangingStudents: [],
  },
  reducers: {
    addArrangingStudent: (state, { payload }) => {
      state.arrangingStudents.push(payload);
    },
    addAllSchedulingStudentsToArrangingStudents: (state) => {
      state.arrangingStudents = [
        ...state.arrangingStudents,
        ...state.schedulingStudents,
      ];
      state.schedulingStudents = [];
    },
    addAllArrangingStudentsToSchedulingStudents: (state) => {
      state.schedulingStudents = [
        ...state.schedulingStudents,
        ...state.arrangingStudents,
      ];
      state.arrangingStudents = [];
    },
    dragWithinScheduling: (state, { payload }) => {
      const { dragIndex, hoverIndex } = payload;
      state.schedulingStudents = update(state.schedulingStudents, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, state.schedulingStudents[dragIndex]],
        ],
      });
    },
    dragWithinArranging: (state, { payload }) => {
      const { dragIndex, hoverIndex } = payload;
      state.arrangingStudents = update(state.arrangingStudents, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, state.arrangingStudents[dragIndex]],
        ],
      });
    },
    dragToScheduling: (state, { payload }) => {
      const { index, student } = payload;
      state.schedulingStudents = update(state.schedulingStudents, {
        $splice: [[index, 1]],
      });
      state.arrangingStudents = update(state.arrangingStudents, {
        $unshift: [student],
      });
    },
    dragToArranging: (state, { payload }) => {
      const { index, student } = payload;
      state.arrangingStudents = update(state.arrangingStudents, {
        $splice: [[index, 1]],
      });
      state.schedulingStudents = update(state.schedulingStudents, {
        $unshift: [student],
      });
    },
    dragToCalendar: (state, { payload }) => {
      const { index } = payload;
      state.arrangingStudents = update(state.arrangingStudents, {
        $splice: [[index, 1]],
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getStudentsByCoachId.matchFulfilled,
        (state, { payload }) => {
          state.allStudents = payload;
        }
      )
      .addMatcher(
        api.endpoints.getSchedulingStudents.matchFulfilled,
        (state, { payload }) => {
          state.schedulingStudents = payload;
        }
      );
  },
});

export const {
  addArrangingStudent,
  addAllSchedulingStudentsToArrangingStudents,
  addAllArrangingStudentsToSchedulingStudents,
  dragWithinScheduling,
  dragWithinArranging,
  dragToScheduling,
  dragToArranging,
  dragToCalendar,
} = slice.actions;

export default slice.reducer;

export const selectAllStudents = (state) => state.student.allStudents;
export const selectSchedulingStudents = (state) =>
  state.student.schedulingStudents;
export const selectArrangingStudents = (state) =>
  state.student.arrangingStudents;
