import { delay, http, HttpResponse } from 'msw'
import type { ReservationInput } from '../api/types'
import { findEvent, listEvents, listReservations, reserve } from './db'

export function createHandlers({ latency }: { latency: number }) {
  return [
    http.get('*/api/events', async () => {
      await delay(latency)
      return HttpResponse.json(listEvents())
    }),

    http.get('*/api/events/:id', async ({ params }) => {
      await delay(latency)
      const event = findEvent(String(params.id))
      return event
        ? HttpResponse.json(event)
        : HttpResponse.json({ message: 'イベントが見つかりません' }, { status: 404 })
    }),

    http.get('*/api/reservations', async ({ request }) => {
      await delay(latency)
      const eventId = new URL(request.url).searchParams.get('eventId') ?? undefined
      return HttpResponse.json(listReservations(eventId))
    }),

    http.post('*/api/events/:id/reservations', async ({ params, request }) => {
      await delay(latency)
      const body = (await request.json()) as ReservationInput
      const result = reserve(String(params.id), body)
      if (result.ok) return HttpResponse.json(result.reservation, { status: 201 })
      switch (result.status) {
        case 404:
          return HttpResponse.json({ message: 'イベントが見つかりません' }, { status: 404 })
        case 409:
          return HttpResponse.json({ message: result.message, remaining: result.remaining }, { status: 409 })
        case 422:
          return HttpResponse.json({ message: '入力内容を確認してください', errors: result.errors }, { status: 422 })
      }
    }),
  ]
}
