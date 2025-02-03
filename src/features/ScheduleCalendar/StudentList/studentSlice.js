import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../../app/services/api';
import update from 'immutability-helper';

const slice = createSlice({
  name: 'student',
  initialState: {
    isSearching: false,
    allStudents: [],
    schedulingStudents: [],
    filteredSchedulingStudents: [],
    arrangingStudents: [],
  },
  reducers: {
    setIsSearching: (state, { payload }) => {
      state.isSearching = payload;
    },
    searchStudents: (state, { payload }) => {
      state.filteredSchedulingStudents = state.schedulingStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(payload.toLowerCase()) ||
          student.email.toLowerCase().includes(payload.toLowerCase())
      );
    },
    addSchedulingStudent: (state, { payload }) => {
      if (state.isSearching) {
        state.filteredSchedulingStudents.push(payload);
      } else {
        state.schedulingStudents.push(payload);
      }
    },
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
      if (state.isSearching) {
        state.filteredSchedulingStudents = update(
          state.filteredSchedulingStudents,
          {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, state.filteredSchedulingStudents[dragIndex]],
            ],
          }
        );
      } else {
        state.schedulingStudents = update(state.schedulingStudents, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, state.schedulingStudents[dragIndex]],
          ],
        });
      }
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
      const { id } = payload;
      let index = state.schedulingStudents.findIndex(
        (student) => student.id === id
      );
      state.schedulingStudents = update(state.schedulingStudents, {
        $splice: [[index, 1]],
      });
      if (state.isSearching) {
        index = state.filteredSchedulingStudents.findIndex(
          (student) => student.id === id
        );
        state.filteredSchedulingStudents = update(
          state.filteredSchedulingStudents,
          {
            $splice: [[index, 1]],
          }
        );
      }
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
          state.filteredSchedulingStudents = payload;
        }
      );
  },
});

export const {
  setIsSearching,
  searchStudents,
  addSchedulingStudent,
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

export const selectIsSearching = (state) => state.student.isSearching;
export const selectAllStudents = (state) => state.student.allStudents;
export const selectFilteredSchedulingStudents = (state) =>
  state.student.filteredSchedulingStudents;
export const selectSchedulingStudents = (state) =>
  state.student.schedulingStudents;
export const selectArrangingStudents = (state) =>
  state.student.arrangingStudents;
