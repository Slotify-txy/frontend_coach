import { createApi } from '@reduxjs/toolkit/query/react'
import { v4 as uuidv4 } from 'uuid';
import * as SlotStatusConstants from "../constants/slotStatus"
import { api } from "./api"

export const openHourApiSlice = api.injectEndpoints({
    reducerPath: 'openHourApi',
    tagTypes: ['OpenHour'],
    endpoints: (builder) => ({
        getOpenHours: builder.query({
            query: ({ coachId }) => `/open-hour/${coachId}`,
            transformResponse: (response) => (
                response.map(({ startAt, endAt }) => (
                    {
                        id: uuidv4(),
                        start: startAt,
                        end: endAt,
                        isDraggable: true,
                        status: SlotStatusConstants.AVAILABLE
                    }
                ))
            ),
            providesTags: ['OpenHour'],
        }),
        createOpenHours: builder.mutation({
            query: ({ coachId, openHours }) => ({
                url: `/open-hour/${coachId}`,
                method: 'POST',
                body: openHours,
            }),
            invalidatesTags: ['OpenHour'],
        }),
        deleteOpenHoursByCoachId: builder.mutation({
            query: ({ coachId }) => ({
                url: `/open-hour/coach/${coachId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['OpenHour'],
        }),
    }),
})

export const { useGetOpenHoursQuery, useCreateOpenHoursMutation, useDeleteOpenHoursByCoachIdMutation } = openHourApiSlice