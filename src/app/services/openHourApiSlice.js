import { v4 as uuidv4 } from 'uuid';
import * as SlotStatusConstants from '../../constants/slotStatus';
import { api } from './api';

export const openHourApiSlice = api.injectEndpoints({
  reducerPath: 'openHourApi',
  tagTypes: ['OpenHours'],
  endpoints: (builder) => ({
    getOpenHours: builder.query({
      query: ({ coachId }) => `/open-hour/${coachId}`,
      transformResponse: (response) =>
        response.map(({ startAt, endAt }) => ({
          id: uuidv4(),
          start: startAt,
          end: endAt,
          isDraggable: true,
          status: SlotStatusConstants.AVAILABLE,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OpenHours', id })),
              { type: 'OpenHours', id: 'LIST' },
            ]
          : [{ type: 'OpenHours', id: 'LIST' }],
    }),
    createOpenHours: builder.mutation({
      query: ({ coachId, openHours }) => ({
        url: `/open-hour/${coachId}`,
        method: 'POST',
        body: openHours,
      }),
      invalidatesTags: [{ type: 'OpenHours', id: 'LIST' }],
    }),
    deleteOpenHoursByCoachId: builder.mutation({
      query: ({ coachId }) => ({
        url: `/open-hour/coach/${coachId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'OpenHours', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOpenHoursQuery,
  useCreateOpenHoursMutation,
  useDeleteOpenHoursByCoachIdMutation,
} = openHourApiSlice;
