import { api } from './api';

export const userApiSlice = api.injectEndpoints({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;
