import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../appConfig'
import { apiReady } from './ready'
import type { EventItem, Reservation, ReservationInput } from './types'

const rawBaseQuery = fetchBaseQuery({ baseUrl: `${globalThis.location.origin}${BASE_URL}api/` })

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  await apiReady
  return rawBaseQuery(args, api, extraOptions)
}

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery,
  tagTypes: ['Event', 'Reservation'],
  endpoints: (build) => ({
    getEvents: build.query<EventItem[], void>({
      query: () => 'events',
      providesTags: (result = []) => [
        ...result.map((e) => ({ type: 'Event' as const, id: e.id })),
        { type: 'Event' as const, id: 'LIST' },
      ],
    }),
    getEvent: build.query<EventItem, string>({
      query: (id) => `events/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    getReservations: build.query<Reservation[], string | undefined>({
      query: (eventId) => (eventId ? `reservations?eventId=${encodeURIComponent(eventId)}` : 'reservations'),
      providesTags: ['Reservation'],
    }),
    createReservation: build.mutation<Reservation, ReservationInput & { eventId: string }>({
      query: ({ eventId, ...body }) => ({
        url: `events/${encodeURIComponent(eventId)}/reservations`,
        method: 'POST',
        body,
      }),
      // 409（先に満席になった）でも最新の残席を取り直すため、成否にかかわらず無効化する
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: 'Event', id: eventId },
        { type: 'Event', id: 'LIST' },
        'Reservation',
      ],
    }),
  }),
})

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useGetReservationsQuery,
  useCreateReservationMutation,
} = eventsApi
