import SLOT_STATUS from '../../common/constants/slotStatus';
import { api } from './api';

export const openHourApiSlice = api.injectEndpoints({
  reducerPath: 'openHourApi',
  tagTypes: ['OpenHours'],
  endpoints: (builder) => ({
    getOpenHours: builder.query({
      query: ({ coachId }) => `/open-hour/coach/${coachId}`,
      transformResponse: (response) =>
        response.map(({ id, startAt, endAt }) => ({
          // id: uuidv4(),
          id,
          start: startAt,
          end: endAt,
          isDraggable: false,
          status: SLOT_STATUS.OPEN_HOUR,
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
        url: `/open-hour/coach/${coachId}`,
        method: 'POST',
        body: openHours,
      }),
      invalidatesTags: [{ type: 'OpenHours', id: 'LIST' }],
    }),
    deleteOpenHourById: builder.mutation({
      query: (id) => ({
        url: `/open-hour/${id}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(), // by default, rtk query receives json response
      }),
      invalidatesTags: (result, error, id) => [{ type: 'OpenHours', id }],
    }),
  }),
});

export const {
  useGetOpenHoursQuery,
  useCreateOpenHoursMutation,
  useDeleteOpenHourByIdMutation,
} = openHourApiSlice;
