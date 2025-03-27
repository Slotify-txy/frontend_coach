import { api } from './api';

export const userApiSlice = api.injectEndpoints({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => `/coach/${id}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ studentId, coach }) => ({
        url: `/coach/student/${studentId}`,
        method: 'PUT',
        body: coach,
      }),
      invalidatesTags: ['User'],
    }),
    deleteStudentsFromUser: builder.mutation({
      query: ({ coachId, body }) => ({
        url: `/coach/${coachId}/student`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }, 'User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteStudentsFromUserMutation,
} = userApiSlice;
