import { api } from './api';

export const coachApiSlice = api.injectEndpoints({
  reducerPath: 'coachApi',
  tagTypes: ['Coaches'],
  endpoints: (builder) => ({
    updateCoach: builder.mutation({
      query: ({ studentId, coach }) => ({
        url: `/coach/student/${studentId}`,
        method: 'PUT',
        body: coach,
      }),
      invalidatesTags: ['User'],
    }),
    deleteStudentsFromCoach: builder.mutation({
      query: ({ coachId, body }) => ({
        url: `/coach/${coachId}/student`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }, 'User'],
    }),
  }),
});

export const { useUpdateCoachMutation, useDeleteStudentsFromCoachMutation } =
  coachApiSlice;
