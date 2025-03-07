import { api } from './api';

export const userApiSlice = api.injectEndpoints({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ user }) => ({
        url: '/user',
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApiSlice;
