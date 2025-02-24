import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../../app/services/api';
import update from 'immutability-helper';
import { slotApiSlice } from '../../../app/services/slotApiSlice';
import { getDisplayedStudentSlot } from '../../../common/util/slotUtil';
import { all } from 'axios';

const slice = createSlice({
  name: 'student',
  initialState: {
    isSearching: false,
    searchText: '',
    rangeStart: null,
    rangeEnd: null,
    allStudents: [],
    allAvailableStudents: [],
    availableStudents: [],
    filteredAvailableStudents: [],
    displayedStudents: [],
    arrangingStudents: [],
  },
  reducers: {
    searchStudents: (state, { payload }) => {
      state.filteredAvailableStudents = state.availableStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(payload.toLowerCase()) ||
          student.email.toLowerCase().includes(payload.toLowerCase())
      );
      state.searchText = payload;
      state.isSearching = state.searchText !== '';
    },
    // updateDisplayedStudents: (state) => {
    //   const slots = slotApiSlice.endpoints.getSlots();
    //   const students = getDisplayedStudentSlot(state.availableStudents, slots);
    //   state.displayedStudents = students.filter((student) => {
    //     student.slots.some(
    //       (slot) =>
    //         (state.rangeStart == null || slot.startAt >= state.rangeStart) &&
    //         (state.rangeEnd == null || slot.endAt <= state.rangeEnd)
    //     ) &&
    //       ((state.searchText != null &&
    //         student.name
    //           .toLowerCase()
    //           .includes(state.searchText.toLowerCase())) ||
    //         student.email
    //           .toLowerCase()
    //           .includes(state.searchText.toLowerCase()));
    //   });
    // },
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
    updateArrangingStudent: (state, { payload }) => {
      state.arrangingStudents = payload;
    },
    addAllAvailableStudentsToArrangingStudents: (state) => {
      state.arrangingStudents = [
        ...state.arrangingStudents,
        ...state.availableStudents.filter((student) => {
          const studentInArranging = state.arrangingStudents.find(
            (s) => s.id == student.id
          );
          if (studentInArranging) {
            studentInArranging.numOfClassCanBeScheduled +=
              student.numOfClassCanBeScheduled;
            return false;
          }
          return true;
        }),
      ];

      state.availableStudents = [];
      if (state.isSearching) {
        updateFilteredAvailableStudents(state);
      }
    },
    addAllArrangingStudentsToAvailableStudents: (state) => {
      state.availableStudents = [
        ...state.availableStudents,
        ...state.arrangingStudents.filter((student) => {
          const studentInAvailable = state.availableStudents.find(
            (s) => s.id == student.id
          );
          if (studentInAvailable) {
            studentInAvailable.numOfClassCanBeScheduled +=
              student.numOfClassCanBeScheduled;
            return false;
          }
          return true;
        }),
      ];
      state.arrangingStudents = [];

      if (state.isSearching) {
        updateFilteredAvailableStudents(state);
      }
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
    dragToArrangingFromAvailable: (state, { payload }) => {
      const { id } = payload;
      const studentInAvailable = state.availableStudents.find(
        (student) => student.id == id
      );

      if (studentInAvailable.numOfClassCanBeScheduled == 1) {
        const index = state.availableStudents.findIndex(
          (student) => student.id === id
        );
        state.availableStudents = update(state.availableStudents, {
          $splice: [[index, 1]],
        });
      } else {
        studentInAvailable.numOfClassCanBeScheduled -= 1;
      }

      if (state.isSearching) {
        updateFilteredAvailableStudents(state);
      }

      const studentInArranging = state.arrangingStudents.find(
        (student) => student.id == id
      );

      if (studentInArranging) {
        studentInArranging.numOfClassCanBeScheduled += 1;
      } else {
        state.arrangingStudents = update(state.arrangingStudents, {
          $unshift: [
            update(studentInAvailable, {
              numOfClassCanBeScheduled: { $set: 1 },
            }),
          ],
        });
      }
    },
    dragToAvailableFromArranging: (state, { payload }) => {
      const { id } = payload;
      const studentInArranging = state.arrangingStudents.find(
        (student) => student.id == id
      );

      if (studentInArranging.numOfClassCanBeScheduled == 1) {
        const index = state.arrangingStudents.findIndex(
          (student) => student.id === id
        );
        state.arrangingStudents = update(state.arrangingStudents, {
          $splice: [[index, 1]],
        });
      } else {
        studentInArranging.numOfClassCanBeScheduled -= 1;
      }

      const studentInAvailable = state.availableStudents.find(
        (student) => student.id == id
      );

      if (studentInAvailable) {
        studentInAvailable.numOfClassCanBeScheduled += 1;
      } else {
        state.availableStudents = update(state.availableStudents, {
          $unshift: [
            update(studentInArranging, {
              numOfClassCanBeScheduled: { $set: 1 },
            }),
          ],
        });
      }

      if (state.isSearching) {
        updateFilteredAvailableStudents(state);
      }
    },
    addToArrangingFromCalendar: (state, { payload }) => {
      const { id } = payload;
      const studentInArranging = state.arrangingStudents.find(
        (student) => student.id == id
      );

      if (studentInArranging) {
        studentInArranging.numOfClassCanBeScheduled += 1;
      } else {
        const student = state.allStudents.find((student) => student.id == id);
        state.arrangingStudents = update(state.arrangingStudents, {
          $unshift: [
            update(student, {
              numOfClassCanBeScheduled: { $set: 1 },
            }),
          ],
        });
      }
    },
    dragToCalendar: (state, { payload }) => {
      const { id } = payload;
      const studentInArranging = state.arrangingStudents.find(
        (student) => student.id == id
      );

      if (studentInArranging.numOfClassCanBeScheduled == 1) {
        const index = state.arrangingStudents.findIndex(
          (student) => student.id === id
        );
        state.arrangingStudents = update(state.arrangingStudents, {
          $splice: [[index, 1]],
        });
      } else {
        studentInArranging.numOfClassCanBeScheduled -= 1;
      }

      // if (state.isSearching) {
      //   index = state.filteredAvailableStudents.findIndex(
      //     (student) => student.id === id
      //   );
      //   state.filteredAvailableStudents = update(
      //     state.filteredAvailableStudents,
      //     {
      //       $splice: [[index, 1]],
      //     }
      //   );
      // }
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
          state.filteredAvailableStudents = state.availableStudents;
        }
      );
    // .addMatcher(
    //   api.endpoints.getSlots.matchFulfilled,
    //   (state, { payload }) => {
    //     const students = getDisplayedStudentSlot(
    //       state.availableStudents,
    //       payload
    //     );
    //     state.displayedStudents = students.filter((student) => {
    //       student.slots.some(
    //         (slot) =>
    //           (state.rangeStart == null ||
    //             slot.startAt >= state.rangeStart) &&
    //           (state.rangeEnd == null || slot.endAt <= state.rangeEnd)
    //       ) &&
    //         ((state.searchText != null &&
    //           student.name
    //             .toLowerCase()
    //             .includes(state.searchText.toLowerCase())) ||
    //           student.email
    //             .toLowerCase()
    //             .includes(state.searchText.toLowerCase()));
    //     });
    //   }
    // );
  },
});

const updateFilteredAvailableStudents = (state) => {
  state.filteredAvailableStudents = state.availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(state.searchText.toLowerCase())
  );
};

export const {
  searchStudents,
  addAvailableStudent,
  addArrangingStudent,
  updateArrangingStudent,
  addAllAvailableStudentsToArrangingStudents,
  addAllArrangingStudentsToAvailableStudents,
  dragWithinAvailable,
  dragWithinArranging,
  dragToAvailableFromArranging,
  dragToArrangingFromAvailable,
  addToArrangingFromCalendar,
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
