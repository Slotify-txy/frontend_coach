import { api } from './api';

export const studentApiSlice = api.injectEndpoints({
  reducerPath: 'studentApi',
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getSchedulingStudents: builder.query({
      query: ({ coachId }) => `student/coach/${coachId}/scheduling`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students', id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),
    getStudentById: builder.query({
      query: ({ studentId }) => `student/${studentId}`,
      providesTags: (result) =>
        result
          ? [{ type: 'Students', id: result.id }, { type: 'Students' }]
          : [{ type: 'Students' }],
    }),
    getStudentsByCoachId: builder.query({
      query: ({ coachId }) => `student/coach/${coachId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students', id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSchedulingStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentsByCoachIdQuery,
} = studentApiSlice;
