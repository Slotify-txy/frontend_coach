import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

export const slotApiSlice = api.injectEndpoints({
  reducerPath: 'slotApi',
  tagTypes: ['Slots'],
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: ({ coachId }) => `/slot/coach/${coachId}`,
      transformResponse: (response) => {
        return response.map(({ startAt, endAt, status, studentId }) => {
          return {
            id: uuidv4(),
            start: startAt,
            end: endAt,
            studentId,
            status,
            isDraggable: false,
          };
        });
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Slots', id })),
              { type: 'Slots', id: 'LIST' },
            ]
          : [{ type: 'Slots', id: 'LIST' }],
    }),
    createSlots: builder.mutation({
      query: ({ studentId, coachId, slots }) => ({
        url: `/slot/student/${studentId}/coach/${coachId}`,
        method: 'POST',
        body: slots,
      }),
      invalidatesTags: [{ type: 'Slots', id: 'LIST' }],
    }),
    deleteSlots: builder.mutation({
      query: ({ studentId, coachId }) => ({
        url: `/slot/student/${studentId}/coach/${coachId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Slots', id }],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} = slotApiSlice;
