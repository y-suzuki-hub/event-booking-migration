export type EventCategory = 'seminar' | 'workshop' | 'kids'

export type EventItem = {
  id: string
  title: string
  category: EventCategory
  startsAt: string
  venue: string
  capacity: number
  reserved: number
  descriptionHtml: string
}

export type Reservation = {
  id: string
  eventId: string
  name: string
  email: string
  seats: number
  createdAt: string
}

export type ReservationInput = Pick<Reservation, 'name' | 'email' | 'seats'>

export type ApiError = { message: string; remaining?: number }

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  seminar: 'セミナー',
  workshop: 'ワークショップ',
  kids: '親子・キッズ',
}
