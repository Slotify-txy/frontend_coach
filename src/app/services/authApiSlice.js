import { api } from './api';

export const authApiSlice = api.injectEndpoints({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (token) => ({
        url: '/auth/sign-in/google',
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
