import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../../app/services/api';
import update from 'immutability-helper';

const slice = createSlice({
  name: 'student',
  initialState: {
    isSearching: false,
    allStudents: [],
    availableStudents: [],
    filteredAvailableStudents: [],
    arrangingStudents: [],
  },
  reducers: {
    setIsSearching: (state, { payload }) => {
      state.isSearching = payload;
    },
    searchStudents: (state, { payload }) => {
      state.filteredAvailableStudents = state.availableStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(payload.toLowerCase()) ||
          student.email.toLowerCase().includes(payload.toLowerCase())
      );
    },
    addAvailableStudent: (state, { payload }) => {
      if (state.isSearching) {
        state.filteredAvailableStudents.unshift(payload);
      } else {
        state.availableStudents.unshift(payload);
      }
    },
    addArrangingStudent: (state, { payload }) => {
      state.arrangingStudents.unshift(payload);
    },
    addAllAvailableStudentsToArrangingStudents: (state) => {
      state.arrangingStudents = [
        ...state.arrangingStudents,
        ...state.availableStudents,
      ];
      state.availableStudents = [];
    },
    addAllArrangingStudentsToAvailableStudents: (state) => {
      state.availableStudents = [
        ...state.availableStudents,
        ...state.arrangingStudents,
      ];
      state.arrangingStudents = [];
    },
    dragWithinAvailable: (state, { payload }) => {
      const { dragIndex, hoverIndex } = payload;
      if (state.isSearching) {
        state.filteredAvailableStudents = update(
          state.filteredAvailableStudents,
          {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, state.filteredAvailableStudents[dragIndex]],
            ],
          }
        );
      } else {
        state.availableStudents = update(state.availableStudents, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, state.availableStudents[dragIndex]],
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
    dragToAvailable: (state, { payload }) => {
      const { index, student } = payload;
      state.availableStudents = update(state.availableStudents, {
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
      state.availableStudents = update(state.availableStudents, {
        $unshift: [student],
      });
    },
    dragToCalendar: (state, { payload }) => {
      const { id } = payload;
      let index = state.availableStudents.findIndex(
        (student) => student.id === id
      );
      state.availableStudents = update(state.availableStudents, {
        $splice: [[index, 1]],
      });
      if (state.isSearching) {
        index = state.filteredAvailableStudents.findIndex(
          (student) => student.id === id
        );
        state.filteredAvailableStudents = update(
          state.filteredAvailableStudents,
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
        api.endpoints.getAvailableStudents.matchFulfilled,
        (state, { payload }) => {
          state.availableStudents = payload;
          state.filteredAvailableStudents = payload;
        }
      );
  },
});

export const {
  setIsSearching,
  searchStudents,
  addAvailableStudent,
  addArrangingStudent,
  addAllAvailableStudentsToArrangingStudents,
  addAllArrangingStudentsToAvailableStudents,
  dragWithinAvailable,
  dragWithinArranging,
  dragToAvailable,
  dragToArranging,
  dragToCalendar,
} = slice.actions;

export default slice.reducer;

export const selectIsSearching = (state) => state.student.isSearching;
export const selectAllStudents = (state) => state.student.allStudents;
export const selectFilteredAvailableStudents = (state) =>
  state.student.filteredAvailableStudents;
export const selectAvailableStudents = (state) =>
  state.student.availableStudents;
export const selectArrangingStudents = (state) =>
  state.student.arrangingStudents;
