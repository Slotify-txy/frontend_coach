import { api } from './api';

export const studentApiSlice = api.injectEndpoints({
  reducerPath: 'studentApi',
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getAvailableStudents: builder.query({
      query: ({ coachId }) => `student/coach/${coachId}/available`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Students', id })),
              { type: 'Students', id: 'LIST' },
              { type: 'Students', id: 'AVAILABLE' },
            ]
          : [
              { type: 'Students', id: 'LIST' },
              { type: 'Students', id: 'AVAILABLE' },
            ],
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
  useGetAvailableStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentsByCoachIdQuery,
} = studentApiSlice;
