import type { EventItem } from '../api/types'

type Capacity = Pick<EventItem, 'capacity' | 'reserved'>

export type CapacityStatus = 'open' | 'few' | 'closed'

export const MAX_SEATS_PER_RESERVATION = 4

// 残席が定員の2割以下になったら「残りわずか」
export const FEW_RATIO = 0.2

export function remainingSeats({ capacity, reserved }: Capacity): number {
  return Math.max(0, capacity - reserved)
}

export function capacityStatus(event: Capacity): CapacityStatus {
  const remaining = remainingSeats(event)
  if (remaining === 0) return 'closed'
  if (remaining / event.capacity <= FEW_RATIO) return 'few'
  return 'open'
}

export const STATUS_LABEL: Record<CapacityStatus, string> = {
  open: '受付中',
  few: '残りわずか',
  closed: '満席・受付終了',
}

export type BookingCheck =
  | { ok: true }
  | { ok: false; reason: 'closed' | 'insufficient'; remaining: number }

export function canBook(event: Capacity, seats: number): BookingCheck {
  const remaining = remainingSeats(event)
  if (remaining === 0) return { ok: false, reason: 'closed', remaining }
  if (seats > remaining) return { ok: false, reason: 'insufficient', remaining }
  return { ok: true }
}

export function maxSelectableSeats(event: Capacity): number {
  return Math.min(MAX_SEATS_PER_RESERVATION, remainingSeats(event))
}
