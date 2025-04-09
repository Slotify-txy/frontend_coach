import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.REACT_APP_BACKEND_DOMAIN ?? 'http://localhost:8084') +
      '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, use that for authenticated requests
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: () => ({}),
});
