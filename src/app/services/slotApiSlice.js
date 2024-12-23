import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

export const slotApiSlice = api.injectEndpoints({
  reducerPath: 'slotApi',
  tagTypes: ['Slots'],
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: ({ coachId }) => `/slot/${coachId}`,
      transformResponse: (response) => {
        const emails = ['xiyuan@gmail.com', 'alex@gmail.com'];
        const names = ['xiyuan', 'alex'];
        let index = 0;
        return response.map(({ startAt, endAt, status, studentId }) => {
          index += 1;
          if (index >= emails.length) {
            index = 0;
          }
          return {
            id: uuidv4(),
            start: startAt,
            end: endAt,
            studentId,
            email: emails[index],
            name: names[index],
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
        url: `/slot/${studentId}/${coachId}`,
        method: 'POST',
        body: slots,
      }),
      invalidatesTags: [{ type: 'Slots', id: 'LIST' }],
    }),
    deleteSlots: builder.mutation({
      query: ({ studentId, coachId }) => ({
        url: `/slot/${studentId}/${coachId}`,
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
