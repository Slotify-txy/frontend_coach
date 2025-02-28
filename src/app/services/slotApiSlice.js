import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

export const slotApiSlice = api.injectEndpoints({
  reducerPath: 'slotApi',
  tagTypes: ['Slots', 'Students'],
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: ({ coachId }) => `/slot/coach/${coachId}`,
      transformResponse: (response) => {
        return response.map(
          ({ id, startAt, endAt, status, studentId, classId }) => {
            return {
              // id: uuidv4(),
              id,
              start: startAt,
              end: endAt,
              studentId,
              classId,
              status,
              isDraggable: false,
            };
          }
        );
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
      query: ({ slots }) => ({
        url: `/slot`,
        method: 'POST',
        body: slots,
      }),
      invalidatesTags: [
        { type: 'Slots', id: 'LIST' },
        { type: 'Students', id: 'AVAILABLE' },
      ],
    }),
    // deleteSlots: builder.mutation({
    //   query: ({ studentId, coachId }) => ({
    //     url: `/slot/student/${studentId}/coach/${coachId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (result, error, id) => [{ type: 'Slots', id }],
    // }),
    deleteSlotById: builder.mutation({
      query: (id) => ({
        url: `/slot/${id}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(), // by default, rtk query receives json response
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Slots', id },
        { type: 'Students', id: 'AVAILABLE' },
      ],
    }),
    updateSlotStatusById: builder.mutation({
      query: ({ id, status }) => ({
        url: `/slot/${id}?status=${status}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Slots', id },
        { type: 'Students', id: 'AVAILABLE' },
      ],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useGetOpenHoursQuery,
  useCreateSlotsMutation,
  useDeleteSlotByIdMutation,
  useUpdateSlotStatusByIdMutation,
} = slotApiSlice;
